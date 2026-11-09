<!-- app/components/dashboard/DashboardSidebar.vue -->
<script setup lang="ts">
const { isMobileOpen, closeMobile } = useDashboardLayout();
const authStore = useAuthStore();
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    closeMobile();
  },
);

const handleLogout = async () => {
  await authStore.logout();
};

// 🌟 استخدام computed يضمن تحديث اسم المطعم واسم المستخدم وفلترة الروابط حسب الصلاحية فوراً
const visibleNavLinks = computed(() => {
  const restaurantName = authStore.user?.restaurant_name
    ? `${authStore.user.restaurant_name} Details`
    : "Restaurant Details";
  const restaurantSlug = authStore.user?.restaurant_slug || "";
  const userName = authStore.user?.username + "profile" || "Profile";

  const allLinks = [
    {
      label: "الرئيسية",
      path: "/dashboard",
      iconName: "lucide:home",
      show: true,
    },
    {
      label: restaurantName,
      path: `/dashboard/${restaurantSlug}`,
      iconName: "lucide:info",
      show: authStore.isEditorAndAbove,
    },
    {
      label: "التصنيفات",
      path: "/dashboard/categories",
      iconName: "lucide:list-checks",
      show: true,
    },
    {
      label: "الأصناف",
      path: "/dashboard/items",
      iconName: "lucide:utensils",
      show: true,
    },
    {
      label: "العروض",
      path: "/dashboard/offers",
      iconName: "lucide:tag",
      show: true,
    },
    {
      label: "رمز الـ QR",
      path: "/dashboard/qr",
      iconName: "lucide:qr-code",
      show: true,
    },
    {
      label: userName,
      path: "/dashboard/profile",
      iconName: "lucide:user",
      show: true,
    },
    {
      label: "الموظفين",
      path: "/dashboard/staff",
      iconName: "lucide:users",
      show: authStore.isAdmin,
    },
  ];

  return allLinks.filter((item) => item.show);
});
</script>

<template>
  <div>
    <div
      v-if="isMobileOpen"
      @click="closeMobile"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity md:hidden"
    ></div>

    <aside
      :class="[
        'bg-card border-primary/10 p-fluid fixed inset-y-0 right-0 z-50 flex h-full w-64 shrink-0 flex-col justify-between border-l transition-transform duration-300 ease-in-out md:static',
        isMobileOpen
          ? 'translate-x-0 shadow-2xl'
          : 'translate-x-full md:translate-x-0',
      ]"
    >
      <div>
        <!-- Logo & Title -->
        <div class="mb-8 flex items-center justify-between">
          <div class="gap-fluid flex items-center">
            <div
              class="bg-bg text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
            >
              M
            </div>
            <div>
              <h2 class="text-primary text-fluid-sm font-bold">
                {{ authStore.user?.restaurant_name + " " + "Dashboard" }}
              </h2>
              <p class="text-text/60 text-[10px]">لوحة التحكم الإدارية</p>
            </div>
          </div>
          <button
            @click="closeMobile"
            class="text-text/60 hover:text-primary cursor-pointer p-1 md:hidden"
          >
            ✕
          </button>
        </div>

        <!-- Navigation Links -->
        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2">
          <NuxtLink
            v-for="con in visibleNavLinks"
            :key="con.path"
            :to="con.path"
            class="gap-fluid px-fluid text-fluid-sm hover:bg-primary/10 text-text/80 hover:text-primary flex items-center rounded-xl py-3 font-medium transition"
            active-class="bg-bg text-primary! hover:text-text!"
          >
            <Icon :name="con.iconName" class="h-5 w-5" />
            {{ con.label }}
          </NuxtLink>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="border-primary/10 flex flex-col gap-4 border-t pt-6">
        <div class="gap-fluid flex items-center">
          <div
            class="bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          >
            {{ authStore.user?.username?.[0]?.toUpperCase() || "A" }}
          </div>
          <div class="overflow-hidden">
            <p class="truncate text-xs font-bold">
              {{ authStore.user?.username || "مشرف النظام" }}
            </p>
            <p class="text-text/60 truncate text-[10px]">
              {{ authStore.user?.email || "" }}
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full cursor-pointer rounded-xl bg-red-500/10 py-2.5 text-center text-xs font-bold text-red-500 transition hover:bg-red-500/20"
        >
          تسجيل الخروج
        </button>
      </div>
    </aside>
  </div>
</template>
