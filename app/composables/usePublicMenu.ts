import QRCode from "qrcode";
import type {
  PublicMenuCategory,
  PublicMenuItem,
} from "@/types/dataType/publicMenuType";
import type { PublicOffer } from "@/types/dataType/publicMenuType";
import type { OfferItemResponse } from "@/types/dataType/offerType";

export const usePublicMenuState = () => {
  const publicMenuStore = usePublicMenuStore();
  const authStore = useAuthStore();

  const activeCategory = ref<string | number | null>(null);
  const selectedsection = ref("كل الاقسام");
  const isSticky = ref(false);
  const searchQuery = ref("");
  const qrCodeUrl = ref("");
  const copied = ref(false);
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

  const menuLink = computed(() => {
    if (import.meta.client) {
      return `${window.location.origin}/menu/${slug.value}`;
    }

    const requestUrl = useRequestURL();
    return `${requestUrl.origin}/menu/${slug.value}`;
  });

  const handleScroll = () =>
    window.scrollY > 1000 ? (isSticky.value = true) : (isSticky.value = false);

  const scrollToCategory = (categoryId: string | number) => {
    if (!categoryId) return;

    activeCategory.value = categoryId;

    const element = document.getElementById(`category-${categoryId}`);

    element
      ? element.scrollIntoView({ behavior: "smooth", block: "start" })
      : null;
  };

  const getOriginalTotal = (offer: PublicOffer) => {
    if (offer.original_total) return offer.original_total;

    if (!offer.items || !offer.items?.length) return 0;

    return offer.items.reduce((sum: number, item: OfferItemResponse) => {
      const unitPrice = item.unit_price || 0;
      const qty = item.quantity || 0;
      return sum + unitPrice * qty;
    }, 0);
  };

  const generateQr = async () => {
    try {
      qrCodeUrl.value = await QRCode.toDataURL(menuLink.value, {
        width: 300,
        margin: 2,
        color: {
          dark: "#c95400",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(menuLink.value);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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

  return {
    publicMenuStore,
    authStore,
    sections,
    activeCategory,
    filteredCategories,
    targetCategories,
    selectedsection,
    isSticky,
    searchQuery,
    menuLink,
    slug,
    qrCodeUrl,
    copied,
    daysMap,
    todayHours,
    scrollToCategory,
    handleScroll,
    getOriginalTotal,
    generateQr,
    copyLink,
  };
};
