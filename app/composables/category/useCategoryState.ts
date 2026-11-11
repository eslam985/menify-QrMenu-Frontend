import { useCategoryModal } from "~/composables/category/useCategoryModal";
import { useCategorySearch } from "~/composables/category/useCategorySearch";

const { isOpen, editingCategory, closeModal, openModal } = useCategoryModal();
const { searchQuery } = useCategorySearch();

export const useCategoryState = () => {
  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const authStore = useAuthStore();

  const handleRefresh = async () => {
    const isSuccess = await categoryStore.fetchCategories();

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
    isOpen,
    editingCategory,
    closeModal,
    handleRefresh,
    openModal,
    handleDelete,
  };
};
