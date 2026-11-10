import type {
  CategoryResponse,
  DeleteCategoryResult,
  CategoryWithCountResponse,
} from "@/types/dataType/categoryType";
import type {
  CreateCategoryType,
  UpdateCategoryType,
} from "@/schemas/categorySchema/categorySchema";

export const useCategoryService = () => {
  const { apiFetch } = useApi();

  return {
    async getCategories() {
      const res =
        await apiFetch<BaseApiResponse<CategoryWithCountResponse[]>>(
          "/categories",
        );

      return res;
    },

    async createCategory(body: CreateCategoryType) {
      const res = await apiFetch<BaseApiResponse<CategoryWithCountResponse>>(
        "/categories",
        {
          method: "POST",
          body,
        },
      );

      return res;
    },

    async deleteCategory(id: string) {
      const res = await apiFetch<BaseApiResponse<DeleteCategoryResult>>(
        `/categories/${id}`,
        {
          method: "DELETE",
        },
      );

      return res;
    },

    async updateCategory(id: string, body: UpdateCategoryType) {
      const res = await apiFetch<BaseApiResponse<CategoryResponse | null>>(
        `/categories/${id}`,
        {
          method: "patch",
          body,
        },
      );

      return res;
    },
  };
};
