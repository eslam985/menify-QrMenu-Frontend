<!-- app/components/dashboard/restaurant/RestaurantForm.vue -->
<script setup lang="ts">
import { RolesList } from "~/stores/auth";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
  requiredRole: RolesList.Admin,
});

import { useForm } from "~/composables/useForm";
import { restaurantFieldsConfig } from "~/constants/restaurantFormConfig";
import type { UpdateRestaurantType } from "~/schemas/restaurantSchema/restaurantSchema";
import type { PublicRestaurantInfo } from "~/types/dataType/publicMenuType";
const { handleSubmit } = useSubmitstate();

const restaurantStore = useRestaurantStore();

const formInstance = useForm();
const {
  setFormConfig,
  setWorkingHoursConfig,
  formDataPayload,
  isSubmitting,
  resetForm,
} = formInstance;

provide("current_form_instance", formInstance);

const addresses = ref<BranchAddress[]>([]);

const addAddress = () => {
  addresses.value.push({ branch_name: "", address: "" });
};

const removeAddress = (index: number) => {
  addresses.value.splice(index, 1);
};

const handleRestaurantSubmit = async () => {
  
  const address: string | null = stringifyAddresses(addresses.value);

  const payload: UpdateRestaurantType["body"] = {
    ...formDataPayload.value,
    address,
  };

  handleSubmit({
    formDataPayload: payload,
    isSubmitting,
    apiCall: () =>
      restaurantStore.updateRestaurant(payload),
  });
};

const loadData = async () => {
  const isNotData =
    !restaurantStore.restaurant ||
    Object.keys(restaurantStore.restaurant).length < 1;

  if (isNotData) await restaurantStore.fetchRestaurant();

  const restaurantData: PublicRestaurantInfo | null =
    restaurantStore.restaurant;

  if (!restaurantData) return;

  // Populate branch addresses on page load
  addresses.value = parseAddresses(restaurantData.address);

  setFormConfig(restaurantFieldsConfig, handleRestaurantSubmit, {
    ...restaurantData,
  });

  if (!restaurantData.working_hours) return;

  setWorkingHoursConfig({ ...restaurantData.working_hours });
};

onMounted(async () => {
  await loadData();
});

onUnmounted(() => {
  resetForm();
});
</script>

<template>
  <div
    v-if="restaurantStore.isLoading"
    class="p-fluid flex items-center justify-center"
  >
    <Icon name="lucide:loader-2" class="text-primary h-8 w-8 animate-spin" />
    <span class="text-text/60 mx-2">جاري تحميل بيانات المطعم...</span>
  </div>

  <div
    v-else-if="restaurantStore.restaurant?.slug"
    class="p-section-fluid bg-card rounded-card shadow-soft border-primary/5 mx-auto w-full max-w-6xl border"
  >
    <h3
      class="text-text md:hover:text-primary text-fluid-h3 mb-section-fluid border-primary/10 border-b pb-1.5"
    >
      بيانات
      <span class="text-primary md:hover:text-text">
        {{ restaurantStore.restaurant.name }}
      </span>
      الاساسية
    </h3>
    <UiBaseForm>
      <template #extra-fields>
        <div
          class="border-primary/10 pt-fluid mt-fluid flex flex-col gap-3 border-t"
        >
          <div class="flex items-center justify-between">
            <label class="text-fluid-xs text-primary font-bold">
              عناوين الفروع
            </label>
            <button
              type="button"
              @click="addAddress"
              class="bg-primary/10 text-primary hover:bg-primary/20 text-fluid-xs flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold transition-colors"
            >
              <Icon name="lucide:plus" class="h-4 w-4" />
              <span>إضافة فرع</span>
            </button>
          </div>

          <div
            v-if="addresses.length === 0"
            class="text-text/40 text-fluid-sm border-primary/10 rounded-xl border border-dashed py-4 text-center"
          >
            لا توجد عناوين مضافة. اضغط على "إضافة فرع" لإدخال عنوان.
          </div>

          <div
            v-for="(item, index) in addresses"
            :key="index"
            class="gap-fluid grid grid-cols-1 items-center sm:grid-cols-3"
          >
            <input
              type="text"
              v-model="item.branch_name"
              placeholder="اسم الفرع (مثال: فرع المعادي)"
              class="p-fluid bg-card border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full rounded-xl border transition-colors focus:outline-none"
            />

            <div class="flex items-center gap-2 sm:col-span-2">
              <input
                type="text"
                v-model="item.address"
                placeholder="العنوان بالتفصيل"
                required
                class="p-fluid bg-card border-primary/10 text-text/80 text-fluid-p focus:border-primary w-full rounded-xl border transition-colors focus:outline-none"
              />

              <button
                type="button"
                @click="removeAddress(index)"
                class="bg-denger/10 text-denger hover:bg-denger/20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
                title="حذف الفرع"
              >
                <Icon name="lucide:trash-2" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </UiBaseForm>
  </div>
</template>
