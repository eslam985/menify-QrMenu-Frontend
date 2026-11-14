import { defineStore } from "pinia";
import { usePublicRestaurantsService } from "@/services/publicRestaurantsService";
import type { PublicRestaurantListItem } from "@/types/dataType/publicMenuType";
import { handleGlobalError } from "~/utils/apiError";

export const usePublicRestaurantsStore = defineStore(
  "publicRestaurants",
  () => {
    const service = usePublicRestaurantsService();

    const restaurants = ref<PublicRestaurantListItem[]>([]);
    const isLoading = ref(false);
    const isLoaded = ref(false);
    const error = ref<string | null>(null);

    async function fetchRestaurants(force = false) {
      if (!force && (isLoaded.value || isLoading.value)) return true;

      isLoading.value = true;
      error.value = null;

      try {
        const res = await service.fetchRestaurants();

        if (!res || !res.success) return false;

        restaurants.value = res.data ?? [];
        isLoaded.value = true;
        return res.success;
      } catch (e: unknown) {
        const { message } = handleGlobalError(
          e,
          "فشل تحميل قائمة المطاعم",
          false,
        );
        error.value = message;
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      restaurants,
      isLoading,
      isLoaded,
      error,
      fetchRestaurants,
    };
  },
);
