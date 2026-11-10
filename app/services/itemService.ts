import type {
  CreateMenuItemType,
  ListMenuItemsType,
  ReorderMenuItemsType,
  UpdateMenuItemType,
} from "@/schemas/menuItemSchema/menuItemSchema.js";
import type {
  DeleteMenuItemResult,
  MenuItemResponse,
} from "@/types/dataType/menuItemType";

export const useItemService = () => {
  const { apiFetch } = useApi();

  return {
    async getItems(params?: ListMenuItemsType["query"]) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse[]>>(
        "/menu-items",
        { params },
      );

      return res;
    },

    async getItemById(id: string) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        `/menu-items/${id}`,
      );

      return res;
    },

    async createItem(body: CreateMenuItemType["body"]) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        "/menu-items",
        {
          method: "POST",
          body,
        },
      );

      return res;
    },

    async updateItem(id: string, body: UpdateMenuItemType["body"]) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        `/menu-items/${id}`,
        {
          method: "PATCH",
          body,
        },
      );

      return res;
    },

    async deleteItem(id: string) {
      const res = await apiFetch<BaseApiResponse<DeleteMenuItemResult | null>>(
        `/menu-items/${id}`,
        {
          method: "DELETE",
        },
      );

      return res;
    },

    async setAvailability(id: string, is_available: boolean) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        `/menu-items/${id}/availability`,
        {
          method: "PATCH",
          body: { is_available },
        },
      );

      return res;
    },

    async uploadImage(id: string, formData: FormData) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        `/menu-items/${id}/image`,
        {
          method: "POST",
          body: formData,
        },
      );

      return res;
    },

    async deleteImage(id: string) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse | null>>(
        `/menu-items/${id}/image`,
        {
          method: "DELETE",
        },
      );

      return res;
    },

    async reorderItems(payload: ReorderMenuItemsType["body"]) {
      const res = await apiFetch<BaseApiResponse<MenuItemResponse[]>>(
        "/menu-items/reorder",
        {
          method: "PATCH",
          body: payload,
        },
      );

      return res;
    },
  };
};
