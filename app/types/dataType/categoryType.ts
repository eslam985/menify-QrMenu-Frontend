export type CategorySection =
  "food" | "drinks" | "desserts" | "shisha" | "other";

export interface CategoryResponse {
  id: string;
  name: string;
  section: CategorySection;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  restaurantId: string;
  name: string;
  section: CategorySection;
  displayOrder?: number | undefined;
}

export interface UpdateCategoryInput {
  name?: string | undefined;
  section?: CategorySection | undefined;
  display_order?: number | undefined;
}

export interface CategoryWithCountResponse extends CategoryResponse {
  items_count: number;
}

export interface DeleteCategoryResult {
  id: string;
  deleted_items: number;
}
