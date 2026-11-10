import type { BaseApiResponse } from "@/types/globalTypes";
import type { PublicRestaurantListItem } from "@/types/dataType/publicMenuType";

export const usePublicRestaurantsService = () => {
  const config = useRuntimeConfig();
  const apiBase = () => config.public.apiBase;

  async function fetchRestaurants() {
    const res = await $fetch<
      Promise<BaseApiResponse<PublicRestaurantListItem[]>>
    >(`${apiBase()}/public/restaurants`);

    return res;
  }

  return { fetchRestaurants };
};
