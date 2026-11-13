import { useCategorySearch } from "~/composables/category/useCategorySearch";

const { searchQuery } = useCategorySearch();

export const useCategoryState = () => {
  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const authStore = useAuthStore();

  const loadCategoreData = async () => await categoryStore.fetchCategories();

  const handleRefresh = async () => {
    const isSuccess = await loadCategoreData();

    if (isSuccess) notiStore.show("تم تحديث البيانات بنجاح", "success");
  };

  const filteredCategories = computed(() => {
    if (!searchQuery.value) return categoryStore.categories;

    const query = searchQuery.value.toLowerCase().trim();

    return categoryStore.categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.section.toLowerCase().includes(query),
    );
  });

  const handleDelete = async (categoryId: string) => {
    if (!categoryId) return;
    await categoryStore.removeCategory(categoryId);
  };

  return {
    authStore,
    categoryStore,
    notiStore,
    filteredCategories,
    searchQuery,
    handleRefresh,
    handleDelete,
    loadCategoreData,
  };
};
