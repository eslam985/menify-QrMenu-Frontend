// app/composables/useItemReorderModal.ts
export const useItemReorderModal = () => {
  const isOpen = useState('item_reorder_modal_open', () => false)

  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    openModal,
    closeModal,
  }
}