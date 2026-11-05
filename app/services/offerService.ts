// app/services/offerService.ts
export const useOfferService = () => {
  const { apiFetch } = useApi()

  return {
    async getOffers(params?: Record<string, any>) {
      return await apiFetch<{ success: boolean; data: any[] }>('/offers', {
        params,
      })
    },

    async getOfferById(id: string) {
      return await apiFetch<{ success: boolean; data: any }>(`/offers/${id}`)
    },

    async createOffer(body: Record<string, any>) {
      return await apiFetch('/offers', {
        method: 'POST',
        body,
      })
    },

    async updateOffer(id: string, body: Record<string, any>) {
      return await apiFetch(`/offers/${id}`, {
        method: 'PATCH',
        body,
      })
    },

    async deleteOffer(id: string) {
      return await apiFetch(`/offers/${id}`, {
        method: 'DELETE',
      })
    },

    async uploadImage(id: string, formData: FormData) {
      return await apiFetch(`/offers/${id}/image`, {
        method: 'POST',
        body: formData,
      })
    },

    async deleteImage(id: string) {
      return await apiFetch(`/offers/${id}/image`, {
        method: 'DELETE',
      })
    },
  }
}