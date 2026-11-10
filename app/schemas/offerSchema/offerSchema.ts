import { z } from "zod";
import { priceField } from "@/schemas/menuItemSchema/menuItemSchema.js";

const titleField = z
  .string({ error: "عنوان العرض مطلوب" })
  .trim()
  .min(1, "عنوان العرض مطلوب")
  .max(150, "العنوان طويل جداً");

const descriptionField = z
  .string()
  .trim()
  .max(1000, "الوصف طويل جداً (الحد الأقصى 1000)")
  .transform((v) => (v === "" ? null : v))
  .nullable();

const dateField = z.iso.datetime({
  offset: true,
  error: "التاريخ بصيغة ISO مع المنطقة الزمنية",
});

const quantityField = z.number().int().min(1).max(99).default(1);

const offerItemField = z.union([
  z.strictObject({
    menu_item_id: z.uuid("معرّف الصنف غير صالح"),
    quantity: quantityField,
  }),
  z.strictObject({
    custom_label: z
      .string()
      .trim()
      .min(1, "النص مطلوب")
      .max(150, "النص طويل جداً"),
    quantity: quantityField,
  }),
]);

const itemsField = z
  .array(offerItemField)
  .max(20, "الحد الأقصى 20 بنداً في العرض")
  .refine(
    (items) => {
      const ids = items.flatMap((i) =>
        "menu_item_id" in i ? [i.menu_item_id] : [],
      );
      return new Set(ids).size === ids.length;
    },
    { message: "لا يمكن تكرار نفس الصنف، استخدم الكمية" },
  );

const offerIdParams = z.object({ offerId: z.uuid("معرّف العرض غير صالح") });

const status = z.enum(["active", "upcoming", "expired", "paused"]).optional();

const listOffersSchema = z.object({
  query: z.strictObject({
    status: status,
  }),
});

const createOfferSchema = z.object({
  body: z
    .strictObject({
      title: titleField,
      description: descriptionField.optional(),
      offer_price: priceField.nullable().optional(),
      starts_at: dateField.optional(),
      ends_at: dateField,
      is_active: z.boolean().optional(),
      items: itemsField.optional(),
      status: status,
    })
    .refine((d) => new Date(d.ends_at) > new Date(d.starts_at ?? Date.now()), {
      message: "تاريخ انتهاء العرض يجب أن يكون بعد تاريخ البداية وبعد الآن",
      path: ["ends_at"],
    }),
});

const updateOfferSchema = z.object({
  params: offerIdParams,
  body: z
    .strictObject({
      title: titleField,
      description: descriptionField,
      offer_price: priceField.nullable(),
      starts_at: dateField,
      ends_at: dateField,
      is_active: z.boolean(),
      items: itemsField,
    })
    .partial()
    .refine((d) => Object.keys(d).length > 0, {
      message: "يجب إرسال حقل واحد على الأقل للتحديث",
    })
    .refine(
      (d) =>
        !d.starts_at ||
        !d.ends_at ||
        new Date(d.ends_at) > new Date(d.starts_at),
      {
        message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية",
        path: ["ends_at"],
      },
    ),
});

const offerIdSchema = z.object({ params: offerIdParams });

export {
  listOffersSchema,
  createOfferSchema,
  updateOfferSchema,
  offerIdSchema,
};

export type ListOffersType = z.infer<typeof listOffersSchema>;
export type CreateOfferType = z.infer<typeof createOfferSchema>;
export type UpdateOfferType = z.infer<typeof updateOfferSchema>;
export type OfferIdType = z.infer<typeof offerIdSchema>;
