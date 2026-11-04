// app/composables/useItemSearch.ts
export const useItemSearch = () => {
  const searchQuery = useState('item_search_query', () => '')
  const selectedCategoryFilter = useState('item_category_filter', () => '')

  const setSearchQuery = (val: string) => {
    searchQuery.value = val
  }

  const setCategoryFilter = (val: string) => {
    selectedCategoryFilter.value = val
  }

  return {
    searchQuery,
    selectedCategoryFilter,
    setSearchQuery,
    setCategoryFilter,
  }
}