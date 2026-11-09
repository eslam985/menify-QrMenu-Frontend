<!-- app/components/dashboard/items/ItemModal.vue -->
<script setup lang="ts">
import type { CreateMenuItemType } from "@/schemas/menuItemSchema/menuItemSchema.js";
import { useForm, type FormField } from "~/composables/useForm";
import { useItemModal } from "~/composables/useItemModal";
import type { MenuItemResponse } from "~/types/dataType/menuItemType";
const { isOpen, selectedItem: editingItem, closeModal } = useItemModal();
const itemStore = useItemStore();
const categoryStore = useCategoryStore();

// 1. إنشاء نسخة مستقلة ومحمية من الـ Composable الخاص بالفورم
const formInstance = useForm();
const { setFormConfig, formDataPayload, resetForm } = formInstance;

// 2. حقن الـ Instance للـ BaseForm الابن عبر الـ Provide النقية
provide("current_form_instance", formInstance);

// إدارات مخصصة للصورة والـ Checkbox للحفاظ على توافق المعمارية الحالية
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isAvailable = ref<boolean>(true);
const errorMessage = ref("");

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    imagePreview.value = URL.createObjectURL(target.files[0]);
  }
};

// 3. بناء مصفوفة الحقول وتغذية قائمة خيارات الـ Categories ديناميكياً من الـ Store
const itemFieldsConfig = computed<FormField[]>(() => [
  {
    column: "title",
    value: "",
    label: "اسم الصنف",
    required: true,
    type: "text",
    colspan: "col-span-3",
  },
  {
    column: "category_id",
    value: categoryStore.categories[0]?.id || "",
    label: "التصنيف",
    required: true,
    type: "select",
    colspan: "col-span-1 sm:col-span-1.5", // متجاوب ومقسوم هندسياً بجانب السعر
    options: categoryStore.categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  },
  {
    column: "price",
    value: 0,
    label: "السعر (ج.م)",
    required: true,
    type: "text", // نتركه نصاً ليتوافق مع الحقول القياسية في المعمارية
    colspan: "col-span-1 sm:col-span-1.5",
  },
  {
    column: "description",
    value: "",
    label: "الوصف",
    required: false,
    type: "textarea",
    colspan: "col-span-3",
  },
]);

// 4. دالة الإرسال المركزية المتوافقة مع معمارية الـ Payload النظيف والرفع الثنائي
const handleSubmit = async () => {
  errorMessage.value = "";

  // بناء الكائن النهائي مع تحويل الأرقام بدقة للباك إند
  const payload: CreateMenuItemType["body"] = {
    category_id: formDataPayload.value.category_id as string,
    title: String(
      formDataPayload.value.title ?? "",
    ).trim() as CreateMenuItemType["body"]["title"],
    description: String(
      formDataPayload.value.description ?? "",
    ).trim() as CreateMenuItemType["body"]["description"],
    price: Number(formDataPayload.value.price || 0),
    is_available: isAvailable.value,
  };

  if (payload.price < 1) {
    const notiStore = useNotificationStore();
    notiStore.show(
      `سعر  '  ${payload.title ?? "الصنف"}  '  لا يجب ان يكون 0`,
      "error",
    );
    return;
  }

  try {
    const existingItem = editingItem.value as MenuItemResponse | null;
    let itemId = existingItem?.id;

    if (existingItem) {
      await itemStore.updateItem(existingItem.id, payload);
    } else {
      const newItem = await itemStore.addItem(payload);
      if (newItem && newItem.id) {
        itemId = newItem.id;
      }
    }

    // رفع الصورة بشكل منفصل ومنعزل تماماً إن وجدت بنجاح
    if (selectedFile.value && itemId) {
      const formData = new FormData();
      formData.append("image", selectedFile.value);
      await itemStore.uploadImage(itemId, formData);
    }

    closeModal();
    resetForm();
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } };
    errorMessage.value = error.data?.message || "فشل حفظ الصنف";
  }
};

// 5. مراقبة تفتح وغلق المودال لشحن البيانات أو تفريغها نقياً
watch(
  [isOpen, editingItem],
  ([open, item]) => {
    if (!open) {
      resetForm();
      imagePreview.value = null;
      selectedFile.value = null;
      return;
    }

    if (item) {
      isAvailable.value =
        (item as { is_available?: boolean | null }).is_available ?? true;
      imagePreview.value =
        (item as { image_url?: string | null }).image_url || null;
      selectedFile.value = null;

      setFormConfig(itemFieldsConfig.value, handleSubmit, {
        title: (item as { title?: string | null }).title || "",
        category_id:
          (item as { category_id?: string | null }).category_id || "",
        price: (item as { price?: number | null }).price || 0,
        description:
          (item as { description?: string | null }).description || "",
        display_order:
          (item as { display_order?: number | null }).display_order ?? 0,
      });
    } else {
      isAvailable.value = true;
      imagePreview.value = null;
      selectedFile.value = null;

      setFormConfig(itemFieldsConfig.value, handleSubmit, {
        category_id: categoryStore.categories[0]?.id || "",
      });
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    v-if="isOpen"
    @click.self="closeModal"
    class="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
  >
    <div
      class="bg-card rounded-card border-primary/10 gap-fluid flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto border p-6 text-right shadow-2xl"
    >
      <!-- عنوان المودال -->
      <h3
        class="text-fluid-h3 text-primary border-primary/5 border-b pb-2 font-bold"
      >
        {{ editingItem ? "تعديل صنف" : "إضافة صنف جديد" }}
      </h3>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <!-- استدعاء فورم النظام العام وتمرير كل المحتويات في مكانها الهندسي السليم -->
        <UiBaseForm>
          <!-- أولاً: حقن الحقول الخاصة (الصورة والـ Checkbox) لتظهر قبل الأزرار -->
          <template #extra-fields>
            <div
              class="gap-fluid mt-2 grid grid-cols-1 items-start md:grid-cols-2"
            >
              <!-- حقل الصورة المطور -->
              <div class="flex flex-col gap-1.5 text-right">
                <label class="text-fluid-xs text-primary block font-medium"
                  >صورة الصنف</label
                >
                <div class="flex items-center gap-3">
                  <div
                    v-if="imagePreview"
                    class="border-primary/20 relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border"
                  >
                    <img
                      :src="imagePreview"
                      class="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      @click="
                        {
                          imagePreview = null;
                          selectedFile = null;
                        }
                      "
                      class="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-bold text-white opacity-0 transition-opacity hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="file"
                    @change="handleFileChange"
                    accept="image/*"
                    class="bg-bg border-primary/10 text-text/80 text-fluid-xs file:text-fluid-xs file:bg-primary/10 file:text-primary hover:file:bg-primary/20 w-full cursor-pointer rounded-xl border p-2 file:ml-2 file:rounded-md file:border-0 file:px-2.5 file:py-0.5 file:font-bold"
                  />
                </div>
              </div>

              <!-- حقل الـ Checkbox الخاص بالإتاحة -->
              <div class="flex items-center gap-2 pt-6 text-right">
                <input
                  v-model="isAvailable"
                  type="checkbox"
                  id="is_available"
                  class="accent-primary border-primary/20 text-primary h-4 w-4 cursor-pointer rounded"
                />
                <label
                  for="is_available"
                  class="text-fluid-xs text-text cursor-pointer font-bold select-none"
                  >الصنف متاح للطلب حالياً</label
                >
              </div>
            </div>
          </template>

          <!-- ثانياً: حقن زر الإلغاء بجانب زر الحفظ في نهاية الفورم تماماً -->
          <template #actions>
            <button
              type="button"
              @click="closeModal"
              class="bg-bg border-primary/10 text-text hover:bg-primary/5 cursor-pointer rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
          </template>
        </UiBaseForm>

        <!-- إظهار رسائل الخطأ الجانبية إن وُجدت في الأسفل خالص -->
        <p
          v-if="errorMessage"
          class="mt-2 rounded-lg bg-red-500/10 p-2.5 text-xs text-red-500"
        >
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>
