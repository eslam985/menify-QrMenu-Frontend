<!-- app/components/dashboard/offers/OfferForm.vue -->
<script setup lang="ts">
import type {
  CreateOfferType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";
import type { OfferResponse } from "@/types/dataType/offerType";
import { useForm, type FormField } from "~/composables/useForm";
const props = defineProps<{
  offerId?: string | null;
}>();

const router = useRouter();
const categoryStore = useCategoryStore();
const offerStore = useOfferStore();
const itemStore = useItemStore();

const isEditMode = computed(() => Boolean(props.offerId));

const formInstance = useForm();
const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;
provide("current_form_instance", formInstance);

const startsAt = ref("");
const endsAt = ref("");
const isActive = ref(true);
const errorMessage = ref("");
const items = ref<
  {
    menu_item_id?: string;
    custom_label?: string;
    selected_category_id?: string;
    quantity: number;
  }[]
>([]);

const offerFieldsConfig: FormField[] = [
  {
    column: "title",
    value: "",
    label: "عنوان العرض (مثال: عرض الويك إند الكبير)",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-2",
  },
  {
    column: "offer_price",
    value: "",
    label: "سعر العرض (ج.م) - اختياري",
    required: false,
    type: "number",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "description",
    value: "",
    label: "تفاصيل ووصف العرض",
    required: false,
    type: "textarea",
    colspan: "col-span-3",
  },
];

const addMenuItemToOffer = () => {
  items.value.push({ menu_item_id: "", selected_category_id: "", quantity: 1 });
};

const addCustomItemToOffer = () => {
  items.value.push({ custom_label: "", quantity: 1 });
};

const removeItemFromOffer = (index: number) => {
  items.value.splice(index, 1);
};

const populateOfferData = (offer: OfferResponse) => {
  startsAt.value = offer.starts_at
    ? new Date(offer.starts_at).toISOString().slice(0, 16)
    : "";
  endsAt.value = offer.ends_at
    ? new Date(offer.ends_at).toISOString().slice(0, 16)
    : "";
  isActive.value = offer.is_active ?? true;
  items.value = offer.items ? JSON.parse(JSON.stringify(offer.items)) : [];

  setFormConfig(offerFieldsConfig, handleSubmit, {
    title: offer.title || "",
    offer_price: offer.offer_price ?? "",
    description: offer.description || "",
  });
};

const handleSubmit = async () => {
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    const rawPrice = formDataPayload.value.offer_price;

    const payload = {
      title: formDataPayload.value.title,
      description: formDataPayload.value.description || null,
      offer_price:
        rawPrice !== "" && rawPrice !== null ? Number(rawPrice) : null,
      ends_at: endsAt.value
        ? new Date(endsAt.value).toISOString()
        : new Date(Date.now() + 86400000).toISOString(),
      starts_at: startsAt.value
        ? new Date(startsAt.value).toISOString()
        : undefined,
      is_active: isActive.value,
      items: items.value
        .map((i) => {
          if ("menu_item_id" in i) {
            return { menu_item_id: i.menu_item_id, quantity: i.quantity };
          }
          return { custom_label: i.custom_label, quantity: i.quantity };
        })
        .filter((i) => i.menu_item_id || i.custom_label),
    };

    let success = false;
    if (isEditMode.value && props.offerId) {
      success = await offerStore.updateOffer(
        props.offerId,
        payload as UpdateOfferType["body"],
      );
    } else {
      success = await offerStore.addOffer(payload as CreateOfferType["body"]);
    }

    if (success !== false) {
      resetForm();
      router.push("/dashboard/offers");
    }
  } catch (err: unknown) {
    const error = err as { data?: { message?: string } };
    errorMessage.value = error?.data?.message || "فشل حفظ العرض";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  const tasks: Promise<unknown>[] = [];

  if (categoryStore.categoriesCount < 1)
    tasks.push(categoryStore.fetchCategories());
  if (itemStore.items?.length < 1) tasks.push(itemStore.fetchItems());
  if (tasks.length > 0) await Promise.all(tasks);

  if (isEditMode.value && props.offerId) {
    let targetOffer = offerStore.offers.find((o) => o.id === props.offerId);

    if (!targetOffer) {
      await offerStore.fetchOffers();
      targetOffer = offerStore.offers.find((o) => o.id === props.offerId);
    }

    if (targetOffer) populateOfferData(targetOffer);
  } else {
    resetForm();
    setFormConfig(offerFieldsConfig, handleSubmit);
  }
});
</script>

<template>
  <div class="mx-auto max-w-4xl pb-12">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-fluid-h3 text-primary font-bold">
          {{ isEditMode ? "تعديل العرض" : "إضافة عرض جديد" }}
        </h1>
        <p class="text-text/60 mt-1 text-xs">
          قم بملء البيانات وتحديد بنود العرض بدقة
        </p>
      </div>
      <NuxtLink
        to="/dashboard/offers"
        class="bg-card border-primary/10 text-text hover:bg-primary/5 rounded-xl border px-4 py-2 text-xs font-bold transition"
      >
        ← العودة للعروض
      </NuxtLink>
    </div>

    <div
      class="bg-card rounded-card border-primary/10 border p-6 shadow-lg md:p-8"
    >
      <UiBaseForm>
        <template #extra-fields>
          <div class="mt-2 flex flex-col gap-6">
            <div class="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
              <div>
                <label
                  class="text-fluid-xs text-primary mb-1.5 block font-medium"
                  >يبدأ في (اختياري)</label
                >
                <input
                  v-model="startsAt"
                  type="datetime-local"
                  class="p-fluid bg-bg border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full rounded-xl border transition-colors focus:outline-none"
                />
              </div>

              <div>
                <label
                  class="text-fluid-xs text-primary mb-1.5 block font-medium"
                >
                  ينتهي في <span class="text-denger">*</span>
                </label>
                <input
                  v-model="endsAt"
                  type="datetime-local"
                  required
                  class="p-fluid bg-bg border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full rounded-xl border transition-colors focus:outline-none"
                />
              </div>

              <div class="flex items-center gap-2.5 pb-3">
                <input
                  v-model="isActive"
                  type="checkbox"
                  id="is_active"
                  class="accent-primary border-primary/20 h-4 w-4 cursor-pointer rounded"
                />
                <label
                  for="is_active"
                  class="text-fluid-xs text-text cursor-pointer font-bold select-none"
                >
                  العرض نشط حالياً للعملاء
                </label>
              </div>
            </div>

            <div class="border-primary/10 border-t pt-6">
              <div
                class="mb-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <h3 class="text-primary text-sm font-bold">
                    بنود ومكونات العرض
                  </h3>
                  <p class="text-text/60 text-[11px]">
                    أضف الأصناف المرتبطة من القائمة أو نصوص مخصصة
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="addMenuItemToOffer"
                    class="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition"
                  >
                    + صنف من المنيو
                  </button>
                  <button
                    type="button"
                    @click="addCustomItemToOffer"
                    class="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition"
                  >
                    + نص مخصص
                  </button>
                </div>
              </div>

              <div
                v-if="items.length === 0"
                class="bg-bg border-primary/20 text-text/40 rounded-2xl border border-dashed py-8 text-center text-xs"
              >
                لا توجد بنود مضافة لهذا العرض بعد. استخدم الأزرار بالأعلى لإضافة
                محتويات العرض.
              </div>

              <div class="flex flex-col gap-3">
                <div
                  v-for="(item, index) in items"
                  :key="index"
                  class="bg-bg border-primary/10 flex flex-col items-center gap-3 rounded-2xl border p-4 shadow-2xs md:flex-row"
                >
                  <template v-if="'menu_item_id' in item">
                    <div
                      class="grid w-full flex-1 grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      <select
                        v-model="item.selected_category_id"
                        class="bg-card border-primary/10 text-text focus:border-primary w-full rounded-xl border p-3 text-xs focus:outline-none"
                      >
                        <option value="">
                          جميع التصنيفات ({{ categoryStore.categories.length }})
                        </option>
                        <option
                          v-for="cat in categoryStore.categories"
                          :key="cat.id"
                          :value="cat.id"
                        >
                          {{ cat.name }} — ({{ cat.section }})
                        </option>
                      </select>

                      <select
                        v-model="item.menu_item_id"
                        required
                        class="bg-card border-primary/10 text-text focus:border-primary w-full rounded-xl border p-3 text-xs focus:outline-none"
                      >
                        <option value="" disabled>اختر الصنف المطلوب</option>
                        <option
                          v-for="menuItem in itemStore.items.filter(
                            (i) =>
                              !item.selected_category_id ||
                              i.category_id === item.selected_category_id,
                          )"
                          :key="menuItem.id"
                          :value="menuItem.id"
                        >
                          {{ menuItem.title }} — ({{ menuItem.price }} ج.م)
                        </option>
                      </select>
                    </div>
                  </template>

                  <template v-else>
                    <div class="w-full flex-1">
                      <input
                        v-model="item.custom_label"
                        type="text"
                        required
                        placeholder="مثال: مشروب غازي مجاني، توصيل مجاني..."
                        class="bg-card border-primary/10 text-text focus:border-primary w-full rounded-xl border p-3 text-xs focus:outline-none"
                      />
                    </div>
                  </template>

                  <div
                    class="flex w-full items-center justify-between gap-3 md:w-auto"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-text/70 text-xs font-bold"
                        >الكمية:</span
                      >
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        max="99"
                        required
                        class="bg-card border-primary/10 text-text focus:border-primary w-20 rounded-xl border p-3 text-center text-xs font-bold focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      @click="removeItemFromOffer(index)"
                      class="cursor-pointer rounded-xl bg-red-500/10 p-3 text-xs text-red-500 transition hover:bg-red-500/20"
                    >
                      <Icon name="lucide:trash-2" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p
              v-if="errorMessage"
              class="rounded-xl bg-red-500/10 p-3 text-xs text-red-500"
            >
              {{ errorMessage }}
            </p>
          </div>
        </template>

        <template #actions>
          <NuxtLink
            to="/dashboard/offers"
            class="bg-bg border-primary/10 text-text hover:bg-primary/5 rounded-xl border px-5 py-2.5 text-xs font-bold transition"
          >
            إلغاء
          </NuxtLink>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
