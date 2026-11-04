<!-- app/pages/dashboard/index.vue -->
<script setup lang="ts">

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const restaurantStore = useRestaurantStore()
const categories = useCategoryStore()
const authStore = useAuthStore()

const subscription_ends_at = computed(() => restaurantStore.subscription_ends_at)
const restaurantStatus = computed(() => restaurantStore.restaurantStatus)
const categoriesCount = computed(() => categories.categoriesCount)
const items_count = computed(() => categories.items_count)
// عدد الاقسام
const joinIn = computed(() => restaurantStore.joinIn)
// تاريخ الانضمام


const getRoleLabel = (role: number | null) => {
  switch (role) {
    case RolesList.Admin: return 'مدير عام (Admin)'
    case RolesList.Editor: return 'محرر (Editor)'
    case RolesList.User: return 'مستخدم (User)'
    default: return 'غير معروف'
  }
}

onMounted(async () => {
  await categories.fetchCategories()
  await restaurantStore.fetchRestaurant()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-primary">أهلاً بك، {{ authStore.user?.username || 'مشرف المطعم' }}
        👋</h1>
      <p class="text-xs text-text/60 mt-1">نظرة عامة على لوحة تحكم
        {{ authStore.user?.restaurant_name || 'مشرف المطعم' }} وإدارته بكفاءة</p>

    </div>

    <!-- Quick Cards -->
    <div class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-fluid mb-fluid">

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2">تاريخ الانضمام </h3>
        <p class="text-fluid-p font-black text-primary/50">
          {{ formatDate(joinIn ?? 'N/A') }}
        </p>
      </div>

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2">صلاحية الحساب</h3>
        <p class="text-fluid-p font-black text-primary">
          {{ getRoleLabel(authStore.userRole) }}
        </p>
      </div>

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2">حالة النظام والاشتراك</h3>
        <p class="text-fluid-p font-black text-green-600">{{ restaurantStatus }}</p>
      </div>

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2">تاريخ انتهاء الاشتراك</h3>
        <p class="text-fluid-p font-black text-green-600">
          {{ formatDate(subscription_ends_at ?? 'لم يتم التحديد بعد') }}
        </p>
      </div>

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2"> اجمالي التصنيفات</h3>
        <p class="text-fluid-p font-black text-primary">
          {{ categoriesCount }}
        </p>
      </div>

      <div class="p-fluid bg-card rounded-2xl border border-primary/10 shadow-soft">
        <h3 class="text-fluid-sm font-bold text-text/60 mb-2"> اجمالي الاصناف</h3>
        <p class="text-fluid-p font-black text-primary">
          {{ items_count }}
        </p>
      </div>
    </div>

    <MenuQRCodeGenerator />
  </div>
</template>