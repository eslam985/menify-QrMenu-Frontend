// /app/services/restaurantService.ts
export const useRestaurantService = () => {
  const { apiFetch } = useApi();

  return {
    async getRestaurant() {
      return await apiFetch<{message: string, success: boolean; data: any[] }>('/api/restaurant')
    },

    async updateRestaurant(body: any) {
      return await apiFetch("/api/restaurant", {
        method: "patch",
        body,
      });
    },

    async uploadLogo(formData: FormData) {
      return await apiFetch("/api/restaurant/logo", {
        method: "POST",
        body: formData,
      });
    },

    async deleteLogo() {
      return await apiFetch("/api/restaurant/logo", {
        method: "delete",
      });
    },
  };
};
