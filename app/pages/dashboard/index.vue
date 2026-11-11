<!-- app/pages/dashboard/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const restaurantStore = useRestaurantStore();
const categoryStore = useCategoryStore();
const offerStore = useOfferStore();
const staffStore = useStaffStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const subscription_ends_at = computed(
  () => restaurantStore.subscription_ends_at,
);
const offersIsNotActiveCount = computed(
  () => offerStore.offersIsNotActiveCount,
);
const offersIsActiveCount = computed(() => offerStore.offersIsActiveCount);
const restaurantStatus = computed(() => restaurantStore.restaurantStatus);
const categoriesCount = computed(() => categoryStore.categoriesCount);
const items_count = computed(() => categoryStore.items_count);
const editorsCount = computed(() => staffStore.editorsCount);
const offersCount = computed(() => offerStore.offersCount);
const adminsCount = computed(() => staffStore.adminsCount);
const usersCount = computed(() => staffStore.usersCount);
const staffCount = computed(() => staffStore.staffCount);
const joinIn = computed(() => restaurantStore.joinIn);
const isAdmin = computed(() => authStore.isAdmin);

const getRoleLabel = (role: number | null) => {
  switch (role) {
    case RolesList.Admin:
      return "مدير عام (Admin)";
    case RolesList.Editor:
      return "محرر (Editor)";
    case RolesList.User:
      return "مستخدم (User)";
    default:
      return "غير معروف";
  }
};

onMounted(async () => {
  const keysRestaurantCount = restaurantStore.restaurant
    ? Object.keys(restaurantStore.restaurant)?.length
    : null;

  if ((keysRestaurantCount && keysRestaurantCount < 1) || !keysRestaurantCount)
    await restaurantStore.fetchRestaurant();
  if (categoriesCount.value < 1) await categoryStore.fetchCategories();
  if (offersCount.value < 1) await offerStore.fetchOffers();
  if (staffCount.value < 1 && isAdmin.value) await staffStore.getStaff();
  if (!authStore.user || Object.keys(authStore.user).length < 1)
    await userStore.findUserById();
});

const visibleCards = computed(() => {
  const allCards = [
    {
      value: formatDate(joinIn.value ?? "N/A"),
      label: `تاريخ انضمام ${authStore.user?.restaurant_name || ""}`,
      class: "text-text/80",
      show: true,
    },
    {
      value: getRoleLabel(authStore.userRole),
      label: "صلاحية الحساب",
      class: "text-text",
      show: true,
    },
    {
      value: restaurantStatus.value ?? "N/A",
      label: "حالة النظام والاشتراك",
      class: "text-success",
      show: true,
    },
    {
      value: formatDate(subscription_ends_at.value ?? "لم يتم التحديد بعد"),
      label: "تاريخ انتهاء الاشتراك",
      class: "text-success/80",
      show: true,
    },
    { value: categoriesCount.value, label: "اجمالي التصنيفات", show: true },
    { value: items_count.value, label: "اجمالي الاصناف", show: true },
    { value: offersCount.value, label: "اجمالي العروض", show: true },
    {
      value: offersIsActiveCount.value,
      label: "اجمالي العروض النشطة",
      show: true,
    },
    {
      value: offersIsNotActiveCount.value,
      label: "اجمالي العروض الغير نشطة",
      show: true,
    },
    { value: staffCount.value, label: "اجمالي الاعضاء", show: isAdmin.value },
    { value: adminsCount.value, label: "اجمالي المشرفون", show: isAdmin.value },
    {
      value: editorsCount.value,
      label: "اجمالي المحررين",
      show: isAdmin.value,
    },
    {
      value: usersCount.value,
      label: "اجمالي المستخدمين (ذو الادني صلاحية)",
      show: isAdmin.value,
    },
  ];

  return allCards.filter((card) => card.show);
});
</script>

<template>
  <div class="mx-auto w-full 2xl:max-w-[90%]">
    <div class="mb-section-fluid">
      <h1 class="text-primary text-fluid-p font-bold">
        أهلاً بك، {{ authStore.user?.username || "مشرف المطعم" }} 👋
      </h1>
      <p class="text-text/60 text-fluid-xs mt-1">
        نظرة عامة على لوحة تحكم
        {{ authStore.user?.restaurant_name || "مشرف المطعم" }} وإدارته بكفاءة
      </p>
    </div>

    <div
      class="xs:grid-cols-2 gap-fluid mb-section-fluid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
    >
      <div
        v-for="(con, index) in visibleCards"
        :key="index"
        class="p-fluid bg-card border-primary/10 shadow-soft rounded-2xl border"
      >
        <h3 class="text-fluid-sm text-text/60 mb-2 font-bold">
          {{ con.label }}
        </h3>
        <p class="text-fluid-p text-primary font-black" :class="con.class">
          {{ con.value }}
        </p>
      </div>
    </div>

    <MenuQRCodeGenerator />
  </div>
</template>
