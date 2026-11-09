// app/composables/useOfferSearch.ts
export const useOfferSearch = () => {
  const searchQuery = useState("offer_search_query", () => "");
  const statusFilter = useState("offer_status_filter", () => "");

  const setSearchQuery = (val: string) => {
    searchQuery.value = val;
  };

  const setStatusFilter = (val: string) => {
    statusFilter.value = val;
  };

  return {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
  };
};
