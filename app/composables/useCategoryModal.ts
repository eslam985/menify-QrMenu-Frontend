// app/composables/useCategoryModal.ts
export const useCategoryModal = () => {
  const isOpen = useState("category_modal_open", () => false);
  const editingCategory = useState<unknown | null>(
    "category_editing_item",
    () => null,
  );

  const openModal = (category: unknown | null = null) => {
    editingCategory.value = category;
    isOpen.value = true;
  };

  const closeModal = () => {
    editingCategory.value = null;
    isOpen.value = false;
  };

  return {
    isOpen,
    editingCategory,
    openModal,
    closeModal,
  };
};
