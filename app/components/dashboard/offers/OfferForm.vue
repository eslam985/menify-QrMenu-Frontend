<!-- app/components/dashboard/offers/OfferForm.vue -->
<script setup lang="ts">
import type {
  CreateOfferType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";
import { type FormField } from "~/composables/useForm";

import { useSubmitstate } from "#imports";
import { useOfferState } from "@/composables/offer/useOfferState";
import type { OfferResponse } from "~/types/dataType/offerType";

const { handleSubmit } = useSubmitstate();
const formInstance = useForm();

const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;
provide("current_form_instance", formInstance);

const {
  categoryStore,
  itemStore,
  items,
  startsAt,
  endsAt,
  isActive,
  errorMessage,
  addMenuItemToOffer,
  addCustomItemToOffer,
  removeItemFromOffer,
  offerStore,
  loadOfferData,
  router,
  id,
  buildOfferPayload,
  populateOfferData,
} = useOfferState();

const isEditMode = computed(() => Boolean(id.value));

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

const handleSubmitOffer = async () => {
  errorMessage.value = "";

  if (isSubmitting.value || offerStore.isLoading) return;

  const payload = buildOfferPayload(formDataPayload.value);

  handleSubmit({
    formDataPayload: payload,
    isSubmitting,
    apiCall: () => {
      return isEditMode.value && id.value
        ? offerStore.updateOffer(id.value, payload as UpdateOfferType["body"])
        : offerStore.addOffer(payload as CreateOfferType["body"]);
    },
    onSuccess: (success) => {
      if (success) {
        resetForm();
        router.push("/dashboard/offers");
      }
    },
  });
};

const loadData = async () => {
  type initialValuesType = {
    title: string;
    offer_price: string | number;
    description: string;
  }  
  const tasks: Promise<unknown>[] = [];

  if (categoryStore.categoriesCount < 1)
    tasks.push(categoryStore.fetchCategories());

  if (itemStore.items?.length < 1) tasks.push(itemStore.fetchItems());

  if (tasks.length > 0) await Promise.all(tasks);

  if (isEditMode.value && id.value) {
    let targetOffer: OfferResponse | undefined = offerStore.offers.find((o) => o.id === id.value);

    if (!targetOffer) {
      await loadOfferData();
      targetOffer = offerStore.offers.find((o) => o.id === id.value);
    }

    if (targetOffer) {
      const initialValues: initialValuesType = populateOfferData(targetOffer);
      
      setFormConfig(offerFieldsConfig, handleSubmitOffer, initialValues);
    }
  } else {
    resetForm();
    setFormConfig(offerFieldsConfig, handleSubmitOffer);
  }
};

onMounted(async () => {
  console.log("isEditMode.value: ", isEditMode.value);
  await loadData();
});
</script>

<template>
  <div class="mx-auto max-w-4xl pb-12">
    <div class="mb-section-fluid flex items-center justify-between">
      <div>
        <h1 class="text-fluid-h3 text-primary font-bold">
          {{ isEditMode ? "تعديل العرض" : "إضافة عرض جديد" }}
        </h1>
        <p class="text-text/60 text-fluid-xs mt-1">
          قم بملء البيانات وتحديد بنود العرض بدقة
        </p>
      </div>
      <NuxtLink
        to="/dashboard/offers"
        class="bg-card border-primary/10 text-text hover:bg-primary/5 px-fluid text-fluid-xs rounded-xl border py-2 font-bold transition"
      >
        ← العودة للعروض
      </NuxtLink>
    </div>

    <div
      class="bg-card rounded-card border-primary/10 p-section-fluid border shadow-lg md:p-8"
    >
      <UiBaseForm>
        <template #extra-fields>
          <div class="gap-section-fluid mt-2 flex flex-col">
            <div class="gap-fluid grid grid-cols-1 items-end md:grid-cols-3">
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
                class="mb-fluid gap-fluid flex flex-wrap items-center justify-between"
              >
                <div>
                  <h3 class="text-primary text-fluid-sm font-bold">
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
                    class="bg-primary/10 text-primary hover:bg-primary/20 px-fluid text-fluid-xs cursor-pointer rounded-xl py-1.5 font-bold transition"
                  >
                    + صنف من المنيو
                  </button>
                  <button
                    type="button"
                    @click="addCustomItemToOffer"
                    class="bg-primary/10 text-primary hover:bg-primary/20 px-fluid text-fluid-xs cursor-pointer rounded-xl py-1.5 font-bold transition"
                  >
                    + نص مخصص
                  </button>
                </div>
              </div>

              <div
                v-if="items.length === 0"
                class="bg-bg border-primary/20 text-text/40 py-section-fluid text-fluid-xs rounded-2xl border border-dashed text-center"
              >
                لا توجد بنود مضافة لهذا العرض بعد. استخدم الأزرار بالأعلى لإضافة
                محتويات العرض.
              </div>

              <div class="gap-fluid flex flex-col">
                <div
                  v-for="(item, index) in items"
                  :key="index"
                  class="bg-bg border-primary/10 gap-fluid p-fluid flex flex-col items-center rounded-2xl border shadow-2xs md:flex-row"
                >
                  <template v-if="'menu_item_id' in item">
                    <div
                      class="gap-fluid grid w-full flex-1 grid-cols-1 md:grid-cols-2"
                    >
                      <select
                        v-model="item.selected_category_id"
                        class="bg-card border-primary/10 text-text focus:border-primary p-fluid text-fluid-xs w-full rounded-xl border focus:outline-none"
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
                        class="bg-card border-primary/10 text-text focus:border-primary p-fluid text-fluid-xs w-full rounded-xl border focus:outline-none"
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
                        class="bg-card border-primary/10 text-text focus:border-primary p-fluid text-fluid-xs w-full rounded-xl border focus:outline-none"
                      />
                    </div>
                  </template>

                  <div
                    class="gap-fluid flex w-full items-center justify-between md:w-auto"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-text/70 text-fluid-xs font-bold"
                        >الكمية:</span
                      >
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        max="99"
                        required
                        class="bg-card border-primary/10 text-text focus:border-primary p-fluid text-fluid-xs w-20 rounded-xl border text-center font-bold focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      @click="removeItemFromOffer(index)"
                      class="bg-danger/10 p-fluid text-fluid-xs text-danger hover:bg-danger/20 cursor-pointer rounded-xl transition"
                    >
                      <Icon name="lucide:trash-2" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p
              v-if="errorMessage"
              class="bg-danger/10 p-fluid text-fluid-xs text-danger rounded-xl"
            >
              {{ errorMessage }}
            </p>
          </div>
        </template>

        <template #actions>
          <NuxtLink
            to="/dashboard/offers"
            class="bg-bg border-primary/10 text-text hover:bg-primary/5 px-fluid text-fluid-xs rounded-xl border py-2.5 font-bold transition"
          >
            إلغاء
          </NuxtLink>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
