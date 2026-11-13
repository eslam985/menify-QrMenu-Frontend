import type {
  PublicMenuCategory,
  PublicMenuItem,
} from "@/types/dataType/publicMenuType";

import type { CartItem } from "@/types/dataType/menuItemType";
import { useItemModal } from "~/composables/item/useItemModal";
export const usePublicMenuState = () => {
  const route = useRoute();

  const { setActiveCategoryItems, openItemModal } = useItemModal();

  const publicMenuStore = usePublicMenuStore();
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  const item = ref<CartItem>();
  const closeItemModel = ref(false);
  const selectedsection = ref("كل الاقسام");
  const searchQuery = ref("");
  const daysMap: Record<string, string> = {
    sun: "الأحد",
    mon: "الإثنين",
    tue: "الثلاثاء",
    wed: "الأربعاء",
    thu: "الخميس",
    fri: "الجمعة",
    sat: "السبت",
  };

  const sections = computed(() => publicMenuStore.sections);
  const slug = computed(() => authStore.restaurantSlug);
  const PublicSlug = fromRouteQuery(route.params.slug);

  const targetCategories = computed(() => {
    const res =
      selectedsection.value === "كل الاقسام"
        ? publicMenuStore.categories
        : publicMenuStore.categories.filter(
            (category) => category.section === selectedsection.value,
          );

    return res;
  });

  const filteredCategories = computed(() => {
    if (!searchQuery.value.trim()) return publicMenuStore.categories;

    const query = searchQuery.value.toLowerCase().trim();

    return publicMenuStore.categories
      .map((category: PublicMenuCategory) => {
        if (category.name?.toLowerCase().includes(query)) return category;

        const filteredItems = category.items?.filter(
          (item: PublicMenuItem) =>
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query),
        );

        return { ...category, items: filteredItems };
      })
      .filter(
        (category: PublicMenuCategory) =>
          category.items && category.items.length > 0,
      );
  });

  const todayHours = computed(() => {
    const hours = publicMenuStore.restaurant?.working_hours;
    if (!hours || typeof hours !== "object") return null;

    const daysKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
    const currentDayKey = daysKeys[new Date().getDay()];

    if (!currentDayKey) return null;

    const todayData = hours[currentDayKey];
    const dayName = daysMap[currentDayKey];

    if (!todayData || !todayData.open || !todayData.close) {
      return { dayName, text: "مغلق اليوم", isOpen: false };
    }

    return {
      dayName,
      text: `${todayData.open} ${todayData.close}`,
      isOpen: true,
    };
  });

  const openItem = (category: PublicMenuCategory, item: PublicMenuItem) => {
    if (!item.is_available) return;

    setActiveCategoryItems(category.items);
    openItemModal(item);
  };

  const handleFetchMenu = async () => {
    await publicMenuStore.fetchMenu(fromRouteQuery(PublicSlug));
  };

  const notFound = computed(() => {
    const error = publicMenuStore.error;

    if (typeof error !== "object" || error === null || !("response" in error)) {
      return false;
    }

    const response = error.response;

    return (
      typeof response === "object" &&
      response !== null &&
      "status" in response &&
      response.status === 404
    );
  });

  return {
    publicMenuStore,
    authStore,
    sections,
    filteredCategories,
    targetCategories,
    selectedsection,
    searchQuery,
    slug,
    daysMap,
    todayHours,
    route,
    PublicSlug,
    cartStore,
    item,
    closeItemModel,
    notFound,
    openItemModal,
    setActiveCategoryItems,
    openItem,
    handleFetchMenu,
  };
};
