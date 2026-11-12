// frontend/app/composables/useShowModel.ts
export const useShowModal = <T = unknown>(
  modalKey: string = "default-modal",
) => {
  const isOpen = useState<boolean>(`${modalKey}-is-open`, () => false);
  const selectedData = useState<T | null>(`${modalKey}-data`, () => null);

  const openModal = (data?: T) => {
    if (data !== undefined) selectedData.value = data;
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
  };

  return { isOpen, openModal, closeModal, selectedData };
};
