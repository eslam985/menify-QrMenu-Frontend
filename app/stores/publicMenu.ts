// frontend/app/stores/publicMenu.ts
import { defineStore } from "pinia";
import type {
  PublicMenuCategory,
  PublicOffer,
  PublicRestaurantInfo,
} from "@/types/dataType/publicMenuType";

import { handleGlobalError } from "@/utils/apiError";
import { CURRENCY_LABELS } from "~/constants/currency";
import { usePublicMenuService } from "@/services/publicMenuService";

export const usePublicMenuStore = defineStore("publicMenu", () => {
  const publicMenuService = usePublicMenuService();

  const restaurant = ref<PublicRestaurantInfo | null>(null);
  const categories = ref<PublicMenuCategory[]>([]);
  const offers = ref<PublicOffer[]>([]);
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const error = ref<string | null>(null);

  const isNotFound = ref(false);
  const loadedSlug = ref<string | null>(null);

  const categoriesCount = computed(() => categories.value?.length);

  const sections = computed(() => {
    const translations = {
      food: "المأكولات",
      drinks: "المشروبات",
      desserts: "الحلويات",
      shisha: "الشيشة",
      other: "شئ أخر",
    };

    const uniqueSections = [
      ...new Set(categories.value.map((c) => c.section).filter(Boolean)),
    ];

    return uniqueSections.map((sec) => ({
      value: sec, // القيمة الإنجليزية للفلترة: 'food'
      label: translations[sec] || sec, // الاسم العربي للعرض: 'المأكولات'
    }));
  });

  async function fetchMenu(slug: string, force = false) {
    if (!slug || isLoading.value) return false;
    if (!force && loadedSlug.value === slug && restaurant.value) return true;


    if (loadedSlug.value !== slug) clearMenu();


    isLoading.value = true;
    error.value = null;
    isNotFound.value = false;
    try {
      const res = await publicMenuService.fetchMenu(slug);

      if (!res) return false;

      const { success, data } = res;

      if (!success || !data) return false;

      restaurant.value = {
        ...data.restaurant,
        currency:
          CURRENCY_LABELS[data.restaurant.currency] ?? data.restaurant.currency,
      };

      categories.value = data.categories ?? [];
      offers.value = data.offers ?? [];
      loadedSlug.value = slug;
      isLoaded.value = true;

      return res.success;
    } catch (e: unknown) {
      const { status, message } = handleGlobalError(
        e,
        "حدث خطأ أثناء تحميل بيانات المنيو.",
        false,
      );

      if (status === 404) {
        isNotFound.value = true;
        error.value = "عذراً، هذا المطعم غير موجود أو تم إيقاف الرابط.";
      } else {
        error.value = message;
      }

      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function clearMenu() {
    restaurant.value = null;
    isNotFound.value = false;
    categories.value = [];
    offers.value = [];
    error.value = null;
    isLoading.value = false;
    isLoaded.value = false;
    loadedSlug.value = null;
  }

  return {
    restaurant,
    categories,
    offers,
    isLoading,
    isNotFound,
    isLoaded,
    error,
    categoriesCount,
    loadedSlug,
    sections,
    fetchMenu,
    clearMenu,
  };
});
