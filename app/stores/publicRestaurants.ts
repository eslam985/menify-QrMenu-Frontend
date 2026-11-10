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

    async function fetchRestaurants() {
      if (isLoaded.value || isLoading.value) return;

      isLoading.value = true;
      error.value = null;

      try {
        const res = await service.fetchRestaurants();

        if (!res || !res.success) return;

        restaurants.value = res.data ?? [];
        isLoaded.value = true;
      } catch (e: unknown) {
        const { message } = handleGlobalError(
          e,
          "فشل تحميل قائمة المطاعم",
          false,
        );
        error.value = message;
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
