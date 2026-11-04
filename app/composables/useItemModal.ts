// app/composables/useItemModal.ts
export const useItemModal = () => {
  const isOpen = useState('public_item_modal_open', () => false)
  const selectedItem = useState<any | null>('public_selected_item', () => null)
  const activeCategoryItems = useState<any[]>('public_active_category_items', () => [])

  const setActiveCategoryItems = (items: any[]) => {
    activeCategoryItems.value = items || []
  }

  const openModal = (item: any | null = null) => {
    if (item) selectedItem.value = item
    isOpen.value = true
  }

  const closeModal = () => {
    selectedItem.value = null
    isOpen.value = false
  }

  return {
    isOpen,
    selectedItem,
    activeCategoryItems,
    setActiveCategoryItems,
    openModal,
    closeModal,
  }
}