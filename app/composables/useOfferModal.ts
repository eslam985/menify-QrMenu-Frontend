// app/composables/useOfferModal.ts
export const useOfferModal = () => {
  const isOpen = useState("offer_modal_open", () => false);
  const editingOffer = useState<unknown | null>(
    "offer_editing_offer",
    () => null,
  );

  const openModal = (offer: unknown | null = null) => {
    editingOffer.value = offer;
    isOpen.value = true;
  };

  const closeModal = () => {
    editingOffer.value = null;
    isOpen.value = false;
  };

  return {
    isOpen,
    editingOffer,
    openModal,
    closeModal,
  };
};
