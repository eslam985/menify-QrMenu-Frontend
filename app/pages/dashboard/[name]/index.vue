<!-- app/components/dashboard/restaurant/RestaurantForm.vue -->
<script setup lang="ts">
import { RolesList } from "~/stores/auth";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
  requiredRole: RolesList.Admin,
});

import { useForm, type FormField } from "~/composables/useForm";
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

const restaurantFieldsConfig: FormField[] = [
  {
    column: "name",
    value: "",
    label: "اسم المطعم او الكافية",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "phone",
    value: "",
    label: "رقم الهاتف",
    required: true,
    type: "tel",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "whatsapp",
    value: "",
    label: "رقم واتساب",
    required: false,
    type: "tel",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "currency",
    value: "",
    label: "العملة مثل (EGP | جنيه)",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "address",
    value: "",
    label: "عنوان المطعم او الكافية",
    required: false,
    type: "text",
    colspan: "col-span-3 md:col-span-2",
  },
  {
    column: "maps_url",
    value: "",
    label: "رابط عنوان المكان (GPS)",
    required: false,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "instagram_url",
    value: "",
    label: "رابط انستجرام",
    required: false,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "facebook_url",
    value: "",
    label: "رابط فيسبوك",
    required: false,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
  },
  {
    column: "timezone",
    value: "",
    label: "المنطقة او البلد",
    required: false,
    type: "text",
    colspan: "col-span-3 md:col-span-1",
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

const handleRestaurantSubmit = async () => {
  handleSubmit({
    formDataPayload: formDataPayload.value,
    isSubmitting,
    apiCall: () => restaurantStore.updateRestaurant(formDataPayload.value),
  });
};

onMounted(async () => {
  if (
    !restaurantStore.restaurant ||
    Object.keys(restaurantStore.restaurant).length < 1
  ) {
    await restaurantStore.fetchRestaurant();
  }

  const restaurantData = restaurantStore.restaurant;

  if (restaurantData) {
    setFormConfig(
      restaurantFieldsConfig,
      handleRestaurantSubmit,
      restaurantData,
    );

    if (restaurantData.working_hours) {
      setWorkingHoursConfig(restaurantData.working_hours);
    }
  }
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
    <UiBaseForm />
  </div>
</template>
