export const useItemModal = () => {
  const isOpen = useState("public_item_modal_open", () => false);
  const selectedItem = useState<unknown | null>(
    "public_selected_item",
    () => null,
  );
  const activeCategoryItems = useState<unknown[]>(
    "public_active_category_items",
    () => [],
  );

  const setActiveCategoryItems = (items: unknown[]) => {
    activeCategoryItems.value = items || [];
  };

  const openModal = (item: unknown | null = null) => {
    if (item) selectedItem.value = item;
    isOpen.value = true;
  };

  const closeModal = () => {
    selectedItem.value = null;
    isOpen.value = false;
  };

  return {
    isOpen,
    selectedItem,
    activeCategoryItems,
    setActiveCategoryItems,
    openModal,
    closeModal,
  };
};
