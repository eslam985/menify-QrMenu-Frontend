<!-- app/components/dashboard/items/ItemModal.vue -->
<script setup lang="ts">
import type {
  CreateMenuItemType,
  UpdateMenuItemType,
} from "@/schemas/menuItemSchema/menuItemSchema.js";
import type { MenuItemResponse } from "~/types/dataType/menuItemType";

import { useImageUpload } from "#imports";
import { useForm } from "~/composables/useForm";
import { useItemModal } from "~/composables/item/useItemModal";
import { useItemState } from "@/composables/item/useItemState";
import { getItemFieldsConfig } from "~/constants/itemFieldsConfig";

const {
  selectedItem: editingItem,
  isOpenItem,
  closeItemModal,
} = useItemModal();
const { handleSubmit: submitForm } = useSubmitstate();
const { categoryStore, itemStore, isAvailable } = useItemState();
const { selectedFile, imagePreview, handleFileChange, resetImage } =
  useImageUpload();

const formInstance = useForm();
const { setFormConfig, formDataPayload, resetForm, isSubmitting } =
  formInstance;
provide("current_form_instance", formInstance);

const itemFieldsConfig = computed(() =>
  getItemFieldsConfig(categoryStore.categories),
);

const handleSubmit = async () => {
  if (itemStore.isSaving) return;

  const existingItem = editingItem.value as MenuItemResponse | null;
  const payload = formDataPayload.value;

  await submitForm({
    formDataPayload: payload,
    isSubmitting,
    apiCall: () => {
      return existingItem
        ? itemStore.updateItem(
            existingItem.id,
            payload as UpdateMenuItemType["body"],
          )
        : itemStore.addItem(payload as CreateMenuItemType["body"]);
    },
    onSuccess: async (isSuccess) => {
      if (!isSuccess) return;

      const targetItemId = existingItem
        ? existingItem.id
        : itemStore.items[itemStore.items.length - 1]?.id;

      if (selectedFile.value && targetItemId) {
        const formData = new FormData();
        formData.append("image", selectedFile.value);
        await itemStore.uploadImage(targetItemId, formData);
      }

      closeItemModal();
      resetForm();
      resetImage();
    },
  });
};

const syncModalForm = (open: boolean, item: MenuItemResponse | null) => {
  if (!open) {
    resetForm();
    resetImage();
    return;
  }

  selectedFile.value = null;

  if (item) {
    isAvailable.value = item.is_available ?? true;
    imagePreview.value = item.image_url || null;

    const initialData = {
      title: item.title || "",
      category_id: item.category_id || "",
      price: item.price || 0,
      description: item.description || "",
      display_order: item.display_order ?? 0,
    };

    setFormConfig(itemFieldsConfig.value, handleSubmit, initialData);
  } else {
    isAvailable.value = true;
    imagePreview.value = null;

    setFormConfig(itemFieldsConfig.value, handleSubmit, {
      category_id: categoryStore.categories[0]?.id || "",
    });
  }
};

watch(
  [isOpenItem, editingItem],
  ([open, item]) => syncModalForm(open, item as MenuItemResponse | null),
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
