import { z } from "zod";

const nameField = z
  .string({ error: "اسم التصنيف مطلوب" })
  .trim()
  .min(1, "اسم التصنيف مطلوب")
  .max(100, "اسم التصنيف طويل جداً (الحد الأقصى 100 حرف)");

const displayOrderField = z
  .number({ error: "ترتيب العرض يجب أن يكون رقماً" })
  .int("ترتيب العرض يجب أن يكون رقماً صحيحاً")
  .min(0, "ترتيب العرض لا يمكن أن يكون سالباً")
  .max(10_000);

const sectionField = z.enum(["food", "drinks", "desserts", "shisha", "other"], {
  error: "القسم يجب أن يكون food أو shisha او drinks أو desserts أو other",
});

const categoryIdParams = z.object({
  categoryId: z.uuid("معرّف التصنيف غير صالح"),
});

const categoryIdSchema = z.object({
  params: categoryIdParams,
});

const createCategorySchema = z.strictObject({
  name: nameField,
  section: sectionField.default("food"),
  display_order: displayOrderField.optional(),
});

const updateCategorySchema = z
  .strictObject({
    name: nameField.optional(),
    display_order: displayOrderField.optional(),
    section: sectionField.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "يجب إرسال حقل واحد على الأقل للتحديث",
  });

const reorderCategoriesSchema = z.strictObject({
  ids: z
    .array(z.uuid("معرّف تصنيف غير صالح"), {
      error: "قائمة المعرّفات مطلوبة",
    })
    .min(1, "يجب إرسال تصنيف واحد على الأقل")
    .max(200, "عدد التصنيفات كبير جداً")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "المعرّفات يجب ألا تتكرر",
    }),
});

export {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  reorderCategoriesSchema,
  nameField as categoryNameField,
};

export type CreateCategoryType = z.infer<typeof createCategorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;
export type CategoryIdType = z.infer<typeof categoryIdSchema>;
export type ReorderCategoriesType = z.infer<typeof reorderCategoriesSchema>;
