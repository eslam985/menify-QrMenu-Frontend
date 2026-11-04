// app/composables/useCategorySearch.ts
export const useCategorySearch = () => {
  const searchQuery = useState('category_search_query', () => '')

  const setSearchQuery = (val: string) => {
    searchQuery.value = val
  }

  return {
    searchQuery,
    setSearchQuery,
  }
}