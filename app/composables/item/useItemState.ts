import { useItemSearch } from "~/composables/item/useItemSearch";
import type { CategoryResponse } from "~/types/dataType/categoryType";
import type { MenuItemResponse } from "~/types/dataType/menuItemType";
export const useItemState = () => {
  const {
    selectedCategoryFilter,
    searchQuery,
    setCategoryFilter,
    setSearchQuery,
  } = useItemSearch();

  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const itemStore = useItemStore();
  const authStore = useAuthStore();
  const isAvailable = ref<boolean>(true);
  
  const matchesSearchText = (
    text: string | null | undefined,
    query: string,
  ): boolean => {
    if (!text) return false;

    const isQuery: boolean = text.toLowerCase().includes(query);

    return isQuery;
  };

  const isItemMatchingQuery = (
    item: MenuItemResponse,
    query: string,
  ): boolean => {
    const category: CategoryResponse | undefined =
      categoryStore.findCategoryById(item.category_id);

    if (matchesSearchText(item.title, query)) return true;
    if (matchesSearchText(item.description, query)) return true;
    if (matchesSearchText(category?.name, query)) return true;
    if (matchesSearchText(category?.section, query)) return true;

    return false;
  };

  const filteredItems = computed(() => {
    let result = itemStore.items;

    if (selectedCategoryFilter.value) {
      result = itemStore.findItemsByCategoryId(selectedCategoryFilter.value);
    }

    const cleanQuery = searchQuery.value.toLowerCase().trim();
    if (cleanQuery) {
      result = result.filter((item) => isItemMatchingQuery(item, cleanQuery));
    }

    return result;
  });

  const handleRefresh = async () => {
    const isSuccess = await itemStore.fetchItems({}, true);

    if (isSuccess) notiStore.show("تم تحديث الأصناف بنجاح", "success");
  };

  const loadItemsData = async () => {
    await Promise.all([
      categoryStore.fetchCategories(),
      itemStore.fetchItems(),
    ]);
  };

  return {
    selectedCategoryFilter,
    categoryStore,
    filteredItems,
    isAvailable,
    searchQuery,
    notiStore,
    authStore,
    itemStore,
    setCategoryFilter,
    setSearchQuery,
    handleRefresh,
    loadItemsData,
  };
};
