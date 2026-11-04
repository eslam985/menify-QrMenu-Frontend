// app/services/itemService.ts
export const useItemService = () => {
  const { apiFetch } = useApi();

  return {
    async getItems(params?: Record<string, any>) {
      return await apiFetch<{ success: boolean; data: any[] }>(
        "/api/menu-items",
        {
          params,
        },
      );
    },

    async getItemById(id: string) {
      return await apiFetch<{ success: boolean; data: any }>(
        `/api/menu-items/${id}`,
      );
    },

    async createItem(body: {
      category_id: string;
      title: string;
      description?: string;
      price: number;
      image_url?: string;
      is_available?: boolean;
    }) {
      return await apiFetch("/api/menu-items", {
        method: "POST",
        body,
      });
    },

    async updateItem(
      id: string,
      body: Partial<{
        category_id: string;
        title: string;
        description: string;
        price: number;
        image_url: string;
        is_available: boolean;
        display_order: number;
      }>,
    ) {
      return await apiFetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        body,
      });
    },

    async deleteItem(id: string) {
      return await apiFetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });
    },

    async setAvailability(id: string, is_available: boolean) {
      return await apiFetch(`/api/menu-items/${id}/availability`, {
        method: "PATCH",
        body: { is_available },
      });
    },

    async uploadImage(id: string, formData: FormData) {
      return await apiFetch(`/api/menu-items/${id}/image`, {
        method: "POST",
        body: formData,
      });
    },

    async deleteImage(id: string) {
      return await apiFetch(`/api/menu-items/${id}/image`, {
        method: "DELETE",
      });
    },

    // في itemService.ts
    async reorderItems(payload: { category_id: string; ids: string[] }) {
      return await apiFetch("/api/menu-items/reorder", {
        method: "PATCH",
        body: payload, // يرسل category_id و ids بالشكل الصحيح تماماً للباك اند
      });
    },
  };
};
