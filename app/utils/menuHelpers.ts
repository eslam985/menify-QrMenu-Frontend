import type { PublicOffer } from "@/types/dataType/publicMenuType";
import type { OfferItemResponse } from "@/types/dataType/offerType";

export const menuHelpers = () => {
  const getOriginalTotal = (offer: PublicOffer) => {
    if (offer.original_total) return offer.original_total;

    if (!offer.items || !offer.items?.length) return 0;

    return offer.items.reduce((sum: number, item: OfferItemResponse) => {
      const unitPrice = item.unit_price || 0;
      const qty = item.quantity || 0;
      return sum + unitPrice * qty;
    }, 0);
  };


  return { getOriginalTotal };
};
