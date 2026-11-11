export const useItemReorderModal = () => {
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

  return {
    isOpenItemReorderModal,
    openModalItemReorderModal,
    closeModalItemReorderModal,
  };
};
