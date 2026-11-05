// app/services/categoryService.ts
export const useCategoryService = () => {
  const { apiFetch } = useApi()

  return {
    async getCategories() {
      return await apiFetch<{ success: boolean; data: any[] }>('/categories')
    },
    async createCategory(body: { name: string; section?: string; display_order?: number }) {
      return await apiFetch('/categories', {
        method: 'POST',
        body,
      })
    },
    async deleteCategory(id: string) {
      return await apiFetch(`/categories/${id}`, {
        method: 'DELETE',
      })
    },
    async updateCategory(id: string, body: { name: string; section?: string; display_order?: number }) {
      return await apiFetch(`/categories/${id}`, {
        method: 'patch', // أو PATCH حسب الـ API لديك، وغالباً PUT
        body,
      })
    },
  }
}