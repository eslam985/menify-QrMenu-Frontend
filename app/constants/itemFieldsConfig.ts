import type { FormField } from "~/composables/useForm";
import type { CategoryWithCountResponse } from "@/types/dataType/categoryType";

/**
 * Generates the form fields configuration for creating or editing a menu item.
 *
 * @param categories - The list of available categories for the select dropdown
 * @returns An array of `FormField` definitions
 */
export const getItemFieldsConfig = (
  categories: CategoryWithCountResponse[],
): FormField[] => [
  {
    column: "title",
    value: "",
    label: "اسم الصنف",
    required: true,
    type: "text",
    colspan: "col-span-3",
  },
  {
    column: "category_id",
    value: categories[0]?.id || "",
    label: "التصنيف",
    required: true,
    type: "select",
    colspan: "col-span-1 sm:col-span-1.5",
    options: categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
  },
  {
    column: "price",
    value: 0,
    label: "السعر (ج.م)",
    required: true,
    type: "number",
    colspan: "col-span-1 sm:col-span-1.5",
  },
  {
    column: "description",
    value: "",
    label: "الوصف",
    required: false,
    type: "textarea",
    colspan: "col-span-3",
  },
];
