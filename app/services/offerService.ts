// app/services/offerService.ts
import type { OfferResponse } from "@/types/dataType/offerType";
import type {
  ListOffersType,
  CreateOfferType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";

export const useOfferService = () => {
  const { apiFetch } = useApi();

  return {
    async getOffers(params?: ListOffersType["query"]) {
      const res = await apiFetch<BaseApiResponse<OfferResponse[]>>("/offers", {
        params,
      });

      return res;
    },

    async getOfferById(id: string) {
      const res = await apiFetch<BaseApiResponse<OfferResponse | null>>(
        `/offers/${id}`,
      );

      return res;
    },

    async createOffer(body: CreateOfferType["body"]) {
      const res = await apiFetch<BaseApiResponse<OfferResponse>>("/offers", {
        method: "POST",
        body,
      });

      return res;
    },

    async updateOffer(id: string, body: UpdateOfferType["body"]) {
      const res = await apiFetch<BaseApiResponse<OfferResponse | null>>(
        `/offers/${id}`,
        { method: "PATCH", body },
      );

      return res;
    },

    async deleteOffer(id: string) {
      const res = await apiFetch<BaseApiResponse<{ id: string | null } | null>>(
        `/offers/${id}`,
        {
          method: "DELETE",
        },
      );

      return res;
    },

    async uploadImage(id: string, formData: FormData) {
      const res = await apiFetch<BaseApiResponse<OfferResponse | null>>(
        `/offers/${id}/image`,
        {
          method: "POST",
          body: formData,
        },
      );

      return res;
    },

    async deleteImage(id: string) {
      const res = await apiFetch<BaseApiResponse<OfferResponse | null>>(
        `/offers/${id}/image`,
        {
          method: "DELETE",
        },
      );

      return res;
    },
  };
};
