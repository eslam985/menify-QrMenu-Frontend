export const useItemModal = () => {
  const isOpenItem = useState("public_item_modal_open", () => false);
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

  const openItemModal = (item: unknown | null = null) => {
    if (item) selectedItem.value = item;
    isOpenItem.value = true;
  };

  const closeItemModal = () => {
    selectedItem.value = null;
    isOpenItem.value = false;
  };

  return {
    isOpenItem,
    selectedItem,
    activeCategoryItems,
    setActiveCategoryItems,
    openItemModal,
    closeItemModal,
  };
};
