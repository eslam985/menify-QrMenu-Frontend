export interface MenuItemResponse {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
export interface CartItem extends MenuItemResponse {
  quantity: number;
}

export interface CreateMenuItemInput {
  restaurantId: string;
  categoryId: string;
  title: string;
  description?: string | null | undefined;
  price: number;
  isAvailable?: boolean | undefined;
}

export interface UpdateMenuItemInput {
  category_id?: string | undefined;
  title?: string | undefined;
  description?: string | null | undefined;
  price?: number | undefined;
  is_available?: boolean | undefined;
}

export interface ListMenuItemsFilter {
  categoryId?: string | undefined;
  isAvailable?: boolean | undefined;
}

export interface DeleteMenuItemResult {
  id: string;
  image_url: string | null;
}
export interface SetImageResult {
  item: MenuItemResponse;
  previousImageUrl: string | null;
}
