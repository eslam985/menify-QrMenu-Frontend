// /app/services/restaurantService.ts
export const useRestaurantService = () => {
  const { apiFetch } = useApi();

  return {
    async getRestaurant() {
      return await apiFetch<{message: string, success: boolean; data: any[] }>('/restaurant')
    },

    async updateRestaurant(body: any) {
      return await apiFetch("/restaurant", {
        method: "patch",
        body,
      });
    },

    async uploadLogo(formData: FormData) {
      return await apiFetch("/restaurant/logo", {
        method: "POST",
        body: formData,
      });
    },

    async deleteLogo() {
      return await apiFetch("/restaurant/logo", {
        method: "delete",
      });
    },
  };
};
