<!-- app/components/dashboard/DashboardSidebar.vue -->
<script setup lang="ts">
const { isMobileOpen, closeMobile } = useDashboardLayout()
const authStore = useAuthStore()
const route = useRoute()

watch(() => route.fullPath, () => {
  closeMobile()
})

const handleLogout = async () => {
  await authStore.logout()
}

// 🌟 استخدام computed يضمن تحديث اسم المطعم واسم المستخدم وفلترة الروابط حسب الصلاحية فوراً
const visibleNavLinks = computed(() => {
  const restaurantName = authStore.user?.restaurant_name ? `${authStore.user.restaurant_name} Details` : 'Restaurant Details'
  const restaurantSlug = authStore.user?.restaurant_slug || ''
  const userName = authStore.user?.username || 'Profile'

  const allLinks = [
    { label: 'الرئيسية', path: '/dashboard', iconName: 'lucide:home', show: true },
    { label: restaurantName, path: `/dashboard/${restaurantSlug}`, iconName: 'lucide:info', show: authStore.isEditorAndAbove },
    { label: 'التصنيفات', path: '/dashboard/categories', iconName: 'lucide:list-checks', show: true },
    { label: 'الأصناف', path: '/dashboard/items', iconName: 'lucide:utensils', show: true },
    { label: 'العروض', path: '/dashboard/offers', iconName: 'lucide:tag', show: true },
    { label: 'رمز الـ QR', path: '/dashboard/qr', iconName: 'lucide:qr-code', show: true },
    { label: userName, path: '/dashboard/profile', iconName: 'lucide:user', show: true },
    { label: 'الموظفين', path: '/dashboard/staff', iconName: 'lucide:users', show: authStore.isAdmin },
  ]

  return allLinks.filter((item) => item.show)
})
</script>


<template>
  <div>
    <div v-if="isMobileOpen" @click="closeMobile"
      class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"></div>

    <aside :class="[
      'fixed md:static inset-y-0 right-0 z-50 w-64 h-full bg-card border-l border-primary/10 flex flex-col justify-between p-fluid transition-transform duration-300 ease-in-out shrink-0',
      isMobileOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
    ]">
      <div>
        <!-- Logo & Title -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-fluid">
            <div
              class="w-10 h-10 rounded-xl bg-bg text-primary flex items-center justify-center font-bold text-xl shrink-0">
              M
            </div>
            <div>
              <h2 class="font-bold text-primary text-fluid-sm">
                {{ authStore.user?.restaurant_name + ' ' + 'Dashboard' }}
              </h2>
              <p class="text-[10px] text-text/60">لوحة التحكم الإدارية</p>
            </div>
          </div>
          <button @click="closeMobile" class="md:hidden text-text/60 hover:text-primary p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Navigation Links -->
        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2">
          <NuxtLink v-for="con in visibleNavLinks" :key="con.path" :to="con.path"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon :name="con.iconName" class="w-5 h-5" />
            {{ con.label }}
          </NuxtLink>
        </nav>

      </div>

      <!-- User Profile & Logout -->
      <div class="pt-6 border-t border-primary/10 flex flex-col gap-4">
        <div class="flex items-center gap-fluid">
          <div
            class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
            {{ authStore.user?.username?.[0]?.toUpperCase() || 'A' }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold truncate">{{ authStore.user?.username || 'مشرف النظام' }}</p>
            <p class="text-[10px] text-text/60 truncate">{{ authStore.user?.email || '' }}</p>
          </div>
        </div>
        <button @click="handleLogout"
          class="w-full py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs hover:bg-red-500/20 transition cursor-pointer text-center">
          تسجيل الخروج
        </button>
      </div>
    </aside>
  </div>

</template>