import { usePublicMenuService } from "@/services/publicMenuService";
import type {
  PublicMenuCategory,
  PublicOffer,
  PublicRestaurantInfo,
} from "@/types/dataType/publicMenuType";
import { handleGlobalError } from "@/utils/apiError";
import { defineStore } from "pinia";

const CURRENCY_LABELS: Record<string, string> = {
  EGP: "ج.م",
  SAR: "ر.س",
  AED: "د.إ",
  USD: "$",
  EUR: "€",
};

export const usePublicMenuStore = defineStore("publicMenu", () => {
  const publicMenuService = usePublicMenuService();

  const restaurant = ref<PublicRestaurantInfo | null>(null);
  const categories = ref<PublicMenuCategory[]>([]);
  const offers = ref<PublicOffer[]>([]);
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const error = ref<unknown>(null);

  let loadedSlug: string | null = null;
  const categoriesCount = computed(() => categories.value?.length);

  async function fetchMenu(slug: string) {
    if (!slug || isLoading.value) return;
    if (loadedSlug === slug && restaurant.value) return;

    isLoading.value = true;
    error.value = null;
    try {
      const res = await publicMenuService.fetchMenu(slug);

      if (!res) return false;

      const { success, data } = res;

      if (!success || !data) return false;

      const info = data.restaurant;

      info.currency = CURRENCY_LABELS[info.currency] ?? info.currency;
      restaurant.value = info;
      categories.value = data.categories ?? [];
      offers.value = data.offers ?? [];
      loadedSlug = slug;

      return res;
    } catch (e: unknown) {
      const { status, message } = handleGlobalError(
        e,
        "حدث خطأ أثناء تحميل بيانات المنيو.",
        false,
      );

      if (status === 404) {
        error.value = "عذراً، هذا المطعم غير موجود أو تم إيقاف الرابط.";
      } else {
        error.value = message;
      }

      return false;
    } finally {
      isLoading.value = false;
      isLoaded.value = true;
    }
  }

  function clearMenu() {
    restaurant.value = null;
    categories.value = [];
    offers.value = [];
    error.value = null;
    isLoading.value = false;
    isLoaded.value = false;
    loadedSlug = null;
  }

  return {
    restaurant,
    categories,
    offers,
    isLoading,
    isLoaded,
    error,
    categoriesCount,
    fetchMenu,
    clearMenu,
  };
});
