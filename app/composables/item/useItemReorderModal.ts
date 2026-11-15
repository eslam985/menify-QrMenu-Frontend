/**
 * Composable for managing the item reorder modal visibility
 * and drag-and-drop reordering logic within a category.
 */
export const useItemReorderModal = () => {
  const categoryStore = useCategoryStore();
  const itemStore = useItemStore();

  // Modal visibility state (shared via useState)
  const isOpenItemReorderModal = useState(
    "item_reorder_modal_open",
    () => false,
  );

  const openModalItemReorderModal = () => {
    isOpenItemReorderModal.value = true;
  };

  const closeModalItemReorderModal = () => {
    isOpenItemReorderModal.value = false;
  };

  // Drag-and-drop reordering state
  const localItems = ref<typeof itemStore.items>([]);
  const draggedIndex = ref<number | null>(null);
  const selectedCategoryId = ref("");
  const isSaving = ref(false);

  const loadCategoryItems = () => {
    if (!selectedCategoryId.value) {
      localItems.value = [];
      return;
    }

    localItems.value = itemStore.items
      .filter((item) => item.category_id === selectedCategoryId.value)
      .sort((a, b) => a.display_order - b.display_order);
  };

  const onDragStart = (index: number) => {
    draggedIndex.value = index;
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (dropIndex: number) => {
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;

    const itemToMove = localItems.value.splice(draggedIndex.value, 1)[0];

    if (!itemToMove) {
      draggedIndex.value = null;
      return;
    }

    localItems.value.splice(dropIndex, 0, itemToMove);
    draggedIndex.value = null;
  };

  const handleSaveReorder = async () => {
    if (localItems.value.length === 0 || !selectedCategoryId.value) return;

    isSaving.value = true;
    try {
      const payload = {
        category_id: selectedCategoryId.value,
        ids: localItems.value.map((item) => item.id),
      };

      const success = await itemStore.reorderItems(payload);
      if (success) {
        closeModalItemReorderModal();
      }
    } finally {
      isSaving.value = false;
    }
  };

  const initializeModal = () => {
    const firstCategory = categoryStore.categories[0];

    if (firstCategory && !selectedCategoryId.value) {
      selectedCategoryId.value = firstCategory.id;
    }

    loadCategoryItems();
  };

  return {
    isOpenItemReorderModal,
    openModalItemReorderModal,
    closeModalItemReorderModal,
    localItems,
    draggedIndex,
    selectedCategoryId,
    isSaving,
    loadCategoryItems,
    onDragStart,
    onDragOver,
    onDrop,
    handleSaveReorder,
    initializeModal,
  };
};
