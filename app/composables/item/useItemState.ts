import { useItemReorderModal } from "~/composables/item/useItemReorderModal";
import { useItemSearch } from "~/composables/item/useItemSearch";
import { useItemModal } from "~/composables/item/useItemModal";

export const useItemState = () => {
  const {
    closeModalItemReorderModal,
    openModalItemReorderModal,
    isOpenItemReorderModal,
  } = useItemReorderModal();

  const {
    activeCategoryItems,
    selectedItem,
    isOpenItem,
    setActiveCategoryItems,
    closeItemModal,
    openItemModal,
  } = useItemModal();

  const {
    selectedCategoryFilter,
    searchQuery,
    setCategoryFilter,
    setSearchQuery,
  } = useItemSearch();

  const publicMenuStore = usePublicMenuStore();
  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const itemStore = useItemStore();
  const authStore = useAuthStore();

  const localItems = ref<typeof itemStore.items>([]);
  const draggedIndex = ref<number | null>(null);
  const imagePreview = ref<string | null>(null);
  const selectedFile = ref<File | null>(null);
  const isAvailable = ref<boolean>(true);
  const selectedCategoryId = ref("");
  const isSaving = ref(false);

  const filteredItems = computed(() => {
    let result = itemStore.items;

    if (selectedCategoryFilter.value) {
      result = result.filter(
        (item) => item.category_id === selectedCategoryFilter.value,
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase().trim();

      result = result.filter((item) => {
        const category = categoryStore.categories.find(
          (c) => c.id === item.category_id,
        );

        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description
          ? item.description.toLowerCase().includes(query)
          : false;
        const categoryNameMatch = category
          ? category.name.toLowerCase().includes(query)
          : false;
        const categorySectionMatch = category
          ? category.section.toLowerCase().includes(query)
          : false;

        return (
          titleMatch || descMatch || categoryNameMatch || categorySectionMatch
        );
      });
    }

    return result;
  });

  const handleRefresh = async () => {
    try {
      await itemStore.fetchItems();
      notiStore.show("تم تحديث الأصناف بنجاح", "success");
    } catch (err: unknown) {
      notiStore.show("فشل تحديث الأصناف", "error");
    }
  };

  const loadCategoryItems = () => {
    if (!selectedCategoryId.value) {
      localItems.value = [];
      return;
    }

    localItems.value = itemStore.items
      .filter((item) => item.category_id === selectedCategoryId.value)
      .sort((a, b) => a.display_order - b.display_order);
  };

  const onDragStart = (index: number) => {
    draggedIndex.value = index;
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDrop = (dropIndex: number) => {
    if (draggedIndex.value === null || draggedIndex.value === dropIndex) return;

    const itemToMove = localItems.value.splice(draggedIndex.value, 1)[0];

    if (!itemToMove) {
      draggedIndex.value = null;
      return;
    }

    localItems.value.splice(dropIndex, 0, itemToMove);
    draggedIndex.value = null;
  };

  const handleSaveReorder = async () => {
    if (localItems.value.length === 0 || !selectedCategoryId.value) return;

    isSaving.value = true;
    try {
      const payload = {
        category_id: selectedCategoryId.value,
        ids: localItems.value.map((item) => item.id),
      };

      const success = await itemStore.reorderItems(payload);
      if (success) {
        closeModalItemReorderModal();
      }
    } finally {
      isSaving.value = false;
    }
  };

  const initializeModal = () => {
    const firstCategory = categoryStore.categories[0];

    if (firstCategory && !selectedCategoryId.value) {
      selectedCategoryId.value = firstCategory.id;
    }

    loadCategoryItems();
  };

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      selectedFile.value = target.files[0];
      imagePreview.value = URL.createObjectURL(target.files[0]);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categoryStore.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "—";
  };

  return {
    selectedCategoryFilter,
    isOpenItemReorderModal,
    activeCategoryItems,
    selectedCategoryId,
    publicMenuStore,
    categoryStore,
    filteredItems,
    selectedItem,
    draggedIndex,
    selectedFile,
    imagePreview,
    isAvailable,
    isOpenItem,
    searchQuery,
    localItems,
    notiStore,
    authStore,
    itemStore,
    isSaving,
    closeModalItemReorderModal,
    openModalItemReorderModal,
    setActiveCategoryItems,
    setCategoryFilter,
    loadCategoryItems,
    handleSaveReorder,
    handleFileChange,
    getCategoryName,
    initializeModal,
    closeItemModal,
    setSearchQuery,
    handleRefresh,
    openItemModal,
    onDragStart,
    onDragOver,
    onDrop,
  };
};
