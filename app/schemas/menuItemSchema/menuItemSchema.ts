import { z } from "zod";

const titleField = z
  .string({ error: "اسم الصنف مطلوب" })
  .trim()
  .min(1, "اسم الصنف مطلوب")
  .max(150, "اسم الصنف طويل جداً (الحد الأقصى 150 حرف)");

const descriptionField = z
  .string({ error: "الوصف يجب أن يكون نصاً" })
  .trim()
  .max(1000, "الوصف طويل جداً (الحد الأقصى 1000 حرف)")
  .transform((v) => (v === "" ? null : v))
  .nullable();

const priceField = z
  .number({ error: "السعر يجب أن يكون رقماً" })
  .min(1, "السعر لا يمكن أن يكون سالباً او صفر")
  .max(1_000_000, "السعر كبير جداً")
  .refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6, {
    message: "السعر يجب ألا يتجاوز خانتين عشريتين",
  });

const categoryIdField = z.uuid("معرّف التصنيف غير صالح");
const isAvailableField = z.boolean({
  error: "حالة التوفر يجب أن تكون true أو false",
});

const itemIdParams = z.object({
  itemId: z.uuid("معرّف الصنف غير صالح"),
});

const listMenuItemsSchema = z.object({
  query: z.strictObject({
    category_id: categoryIdField.optional(),
    is_available: z
      .enum(["true", "false"], {
        error: "is_available يجب أن تكون true أو false",
      })
      .transform((v) => v === "true")
      .optional(),
  }),
});

const createMenuItemSchema = z.object({
  body: z.strictObject({
    category_id: categoryIdField,
    title: titleField,
    description: descriptionField.optional(),
    price: priceField,
    is_available: isAvailableField.optional(),
  }),
});

const updateMenuItemSchema = z.object({
  params: itemIdParams,
  body: z
    .strictObject({
      category_id: categoryIdField.optional(),
      title: titleField.optional(),
      description: descriptionField.optional(),
      price: priceField.optional(),
      is_available: isAvailableField.optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: "يجب إرسال حقل واحد على الأقل للتحديث",
    }),
});

const setAvailabilitySchema = z.object({
  params: itemIdParams,
  body: z.strictObject({
    is_available: isAvailableField,
  }),
});

const itemIdSchema = z.object({
  params: itemIdParams,
});

const reorderMenuItemsSchema = z.object({
  body: z.strictObject({
    category_id: categoryIdField,
    ids: z
      .array(z.uuid("معرّف صنف غير صالح"), { error: "قائمة المعرّفات مطلوبة" })
      .min(1, "يجب إرسال صنف واحد على الأقل")
      .max(500, "عدد الأصناف كبير جداً")
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "المعرّفات يجب ألا تتكرر",
      }),
  }),
});

export {
  listMenuItemsSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  setAvailabilitySchema,
  itemIdSchema,
  reorderMenuItemsSchema,
  priceField,
};

export type ListMenuItemsType = z.infer<typeof listMenuItemsSchema>;
export type CreateMenuItemType = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemType = z.infer<typeof updateMenuItemSchema>;
export type SetAvailabilityType = z.infer<typeof setAvailabilitySchema>;
export type MenuItemIdType = z.infer<typeof itemIdSchema>;
export type ReorderMenuItemsType = z.infer<typeof reorderMenuItemsSchema>;
