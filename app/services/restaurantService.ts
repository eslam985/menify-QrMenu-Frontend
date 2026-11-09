// /app/services/restaurantService.ts
import type { RestaurantResponse } from "@/types/dataType/restaurantType";
import type { UpdateRestaurantType } from "@/schemas/restaurantSchema/restaurantSchema";

export const useRestaurantService = () => {
  const { apiFetch } = useApi();

  return {
    async getRestaurant() {
      const res =
        await apiFetch<BaseApiResponse<RestaurantResponse | null>>(
          "/restaurant",
        );

      return res;
    },

    async updateRestaurant(body: UpdateRestaurantType["body"]) {
      const res = await apiFetch<BaseApiResponse<RestaurantResponse | null>>(
        "/restaurant",
        {
          method: "patch",
          body,
        },
      );

      return res;
    },

    async uploadLogo(formData: FormData) {
      const res = await apiFetch<BaseApiResponse<RestaurantResponse | null>>(
        "/restaurant/logo",
        {
          method: "POST",
          body: formData,
        },
      );

      return res;
    },

    async deleteLogo() {
      const res = await apiFetch<BaseApiResponse<RestaurantResponse | null>>(
        "/restaurant/logo",
        {
          method: "delete",
        },
      );

      return res;
    },
  };
};
