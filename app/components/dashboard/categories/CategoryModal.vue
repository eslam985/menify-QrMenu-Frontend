<!-- app/components/dashboard/categories/CategoryModal.vue -->
<script setup lang="ts">
import { useCategoryModal } from "~/composables/useCategoryModal";
import { useForm, type FormField } from "~/composables/useForm";

import type { CreateCategoryType } from "@/schemas/categorySchema/categorySchema";
import type { CategorySection } from "@/types/dataType/categoryType";
const { isOpen, editingCategory, closeModal } = useCategoryModal();
const categoryStore = useCategoryStore();

const formInstance = useForm();
const { setFormConfig, formDataPayload, resetForm, isSubmitting } =
  formInstance;
const authStore = useAuthStore();

provide("current_form_instance", formInstance);

const categoryFieldsConfig: FormField[] = [
  {
    column: "name",
    value: "",
    label: "اسم التصنيف",
    required: true,
    type: "text",
    colspan: "col-span-3",
  },
  {
    column: "section",
    value: "food",
    label: "القسم (Section)",
    required: true,
    type: "select",
    colspan: "col-span-3",
    options: [
      { label: "طعام (Food)", value: "food" },
      { label: "مشروبات (Drinks)", value: "drinks" },
      { label: "حلويات (Desserts)", value: "desserts" },
      { label: "شيشة", value: "shisha" },
      { label: "أخرى (Other)", value: "other" },
    ],
  },
  {
    column: "display_order",
    value: 0,
    label: "ترتيب العرض (Display Order)",
    required: false,
    type: "text",
    colspan: "col-span-3",
  },
];

const handleSubmit = async () => {
  if (isSubmitting.value || categoryStore.isLoading) return;

  isSubmitting.value = true;

  const isEditing = Boolean(
    (editingCategory.value as { id?: unknown } | null)?.id,
  );
  let success = false;

  const payload: CreateCategoryType = {
    ...formDataPayload.value,
    name: String(formDataPayload.value.name || ""),
    section: (formDataPayload.value.section || "food") as CategorySection,
    display_order: Number(formDataPayload.value.display_order || 0),
  };

  if (isEditing) {
    success = await categoryStore.updateCategory(
      (editingCategory.value as { id: string }).id,
      payload,
    );
  } else {
    success = await categoryStore.addCategory(payload);
  }

  if (success !== false) {
    closeModal();
    resetForm();
  }
};

watch(
  [isOpen, editingCategory],
  ([open, category]) => {
    if (!open) {
      resetForm();
      return;
    }

    if (category) {
      const currentCategory = category as {
        name?: string;
        section?: CategorySection;
        display_order?: number | null;
      };

      setFormConfig(categoryFieldsConfig, handleSubmit, {
        name: currentCategory.name || "",
        section: currentCategory.section || "food",
        display_order: currentCategory.display_order ?? 0,
      });
    } else {
      setFormConfig(categoryFieldsConfig, handleSubmit);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="authStore?.isEditorAndAbove">
    <div
      v-if="isOpen"
      @click.self="closeModal"
      class="animate-fade-in p-fluid fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div
        class="bg-card rounded-card border-primary/10 gap-fluid p-section-fluid flex w-full max-w-md flex-col border text-right shadow-2xl"
      >
        <h3
          class="text-fluid-h3 text-primary border-primary/5 border-b pb-2 font-bold"
        >
          {{ editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد" }}
        </h3>

        <UiBaseForm />

        <div
          class="pr-fluid pointer-events-none -mt-12 flex w-full justify-start"
        >
          <button
            type="button"
            @click="closeModal"
            class="bg-card border-primary/10 text-text hover:bg-primary/5 text-fluid-xs px-fluid pointer-events-auto cursor-pointer rounded-xl border py-2 font-bold transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
