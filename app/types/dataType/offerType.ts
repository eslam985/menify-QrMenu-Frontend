export type OfferStatus = "active" | "upcoming" | "expired" | "paused";

export interface OfferItemResponse {
  id: string;
  menu_item_id: string | null;
  title: string | null;
  custom_label: string | null;
  quantity: number;
  unit_price: number | null;
  image_url: string | null;
  is_available: boolean;
}

export interface OfferResponse {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  offer_price: number | null;
  original_total: number | null;
  savings: number | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  status: OfferStatus;
  all_items_available: boolean;
  items: OfferItemResponse[];
  created_at: string;
  updated_at: string;
}

export type OfferItemInput =
  | { menu_item_id: string; quantity: number }
  | { custom_label: string; quantity: number };

export interface CreateOfferInput {
  restaurantId: string;
  title: string;
  description?: string | null | undefined;
  offerPrice?: number | null | undefined;
  startsAt?: string | undefined;
  endsAt: string;
  isActive?: boolean | undefined;
  items?: OfferItemInput[] | undefined;
}

export interface UpdateOfferInput {
  title?: string | undefined;
  description?: string | null | undefined;
  offer_price?: number | null | undefined;
  starts_at?: string | undefined;
  ends_at?: string | undefined;
  is_active?: boolean | undefined;
  items?: OfferItemInput[] | undefined;
  status: OfferStatus;
}

export interface SetOfferImageResult {
  offer: OfferResponse;
  previousImageUrl: string | null;
}
