<!-- app/components/dashboard/items/ItemModal.vue -->
<script setup lang="ts">
import type {
  CreateMenuItemType,
  UpdateMenuItemType,
} from "@/schemas/menuItemSchema/menuItemSchema.js";
import { useForm, type FormField } from "~/composables/useForm";
import type { MenuItemResponse } from "~/types/dataType/menuItemType";

import { useItemState } from "@/composables/item/useItemState";

const {
  isOpenItem,
  selectedItem: editingItem,
  closeItemModal,
  categoryStore,
  itemStore,
  isAvailable,
  selectedFile,
  imagePreview,
  handleFileChange,
} = useItemState();

const formInstance = useForm();

const { setFormConfig, formDataPayload, resetForm, isSubmitting } =
  formInstance;
provide("current_form_instance", formInstance);

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
    colspan: "col-span-1 sm:col-span-1.5",
    options: categoryStore.categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
    isOpenItem,
  },
  {
    column: "price",
    value: 0,
    label: "السعر (ج.م)",
    required: true,
    type: "number",
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

const onSuccessReset = (isSuccess: boolean) => {
  if (isSuccess) {
    closeItemModal();
    resetForm();
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value || itemStore.isLoading) return;

  isSubmitting.value = true;

  const existingItem = editingItem.value as MenuItemResponse | null;
  let itemId = existingItem?.id;

  if (existingItem) {
    const isSuccess = await itemStore.updateItem(
      existingItem.id,
      formDataPayload.value as UpdateMenuItemType["body"],
    );

    onSuccessReset(isSuccess);
  } else {
    const isSuccess = await itemStore.addItem(
      formDataPayload.value as CreateMenuItemType["body"],
    );

    onSuccessReset(isSuccess);
  }

  if (selectedFile.value && itemId) {
    const formData = new FormData();
    formData.append("image", selectedFile.value);
    await itemStore.uploadImage(itemId, formData);
  }

  isSubmitting.value = false;
};

watch(
  [isOpenItem, editingItem],
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
    v-if="isOpenItem"
    @click.self="closeItemModal"
    class="animate-fade-in p-fluid fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  >
    <div
      class="bg-card rounded-card border-primary/10 gap-fluid px-section-fluid py-fluid flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto border text-right shadow-2xl"
    >
      <h3
        class="text-fluid-h3 text-primary border-primary/5 border-b pb-2 font-bold"
      >
        {{ editingItem ? "تعديل صنف" : "إضافة صنف جديد" }}
      </h3>
      <p
        v-if="itemStore.error"
        class="text-danger bg-danger/10 text-fluid-xs mt-2 rounded-lg p-2.5"
      >
        {{ itemStore.error }}
      </p>
      <form @submit.prevent="handleSubmit" class="gap-fluid flex flex-col">
        <UiBaseForm>
          <template #extra-fields>
            <div
              class="gap-fluid mt-2 grid grid-cols-1 items-start md:grid-cols-2"
            >
              <div class="flex flex-col gap-1.5 text-right">
                <label class="text-fluid-xs text-primary block font-medium"
                  >صورة الصنف</label
                >
                <div class="gap-fluid flex items-center">
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
                      class="text-fluid-sm absolute inset-0 flex items-center justify-center bg-black/40 font-bold text-white opacity-0 transition-opacity hover:opacity-100"
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

          <template #actions>
            <button
              type="button"
              @click="closeItemModal"
              class="bg-bg border-primary/10 text-text hover:bg-primary/5 text-fluid-xs px-fluid cursor-pointer rounded-xl border py-2.5 font-bold transition-colors"
            >
              إلغاء
            </button>
          </template>
        </UiBaseForm>
      </form>
    </div>
  </div>
</template>
