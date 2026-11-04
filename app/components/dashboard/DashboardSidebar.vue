<!-- app/components/dashboard/DashboardSidebar.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useDashboardLayout } from '~/composables/useDashboardLayout'

const authStore = useAuthStore()
const { isMobileOpen, closeMobile } = useDashboardLayout()
const route = useRoute()

// إغلاق القائمة تلقائياً عند التنقل بين الصفحات في الموبايل
watch(() => route.fullPath, () => {
  closeMobile()
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <div>
    <!-- خلفية مظلمة للموبايل -->
    <div v-if="isMobileOpen" @click="closeMobile"
      class="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"></div>

    <aside :class="[
      'fixed md:static inset-y-0 right-0 z-50 w-64 min-h-screen bg-card border-l border-primary/10 flex flex-col justify-between p-fluid transition-transform duration-300 ease-in-out shrink-0',
      isMobileOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'
    ]">
      <div>
        <!-- Logo & Title -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-fluid">
            <div
              class="w-10 h-10 rounded-xl  bg-bg text-primary flex items-center justify-center font-bold text-xl shrink-0">
              M
            </div>
            <div>
              <h2 class="font-bold text-primary text-fluid-sm">{{ authStore.user?.restaurant_name + ' ' + 'Dashboard' }}</h2>
              <p class="text-[10px] text-text/60">لوحة التحكم الإدارية</p>
            </div>
          </div>
          <button @click="closeMobile" class="md:hidden text-text/60 hover:text-primary p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-2">
          <NuxtLink to="/dashboard"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:home" class="w-5 h-5" />
            الرئيسية
          </NuxtLink>

          <NuxtLink to="/dashboard/categories"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:folder-kanban" class="w-5 h-5" />
            التصنيفات
          </NuxtLink>

          <NuxtLink to="/dashboard/items"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:utensils" class="w-5 h-5" />
            الأصناف
          </NuxtLink>

          <NuxtLink to="/dashboard/offers"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:tag" class="w-5 h-5" />
            العروض
          </NuxtLink>

          <NuxtLink to="/dashboard/qr"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:qr-code" class="w-5 h-5" />
            رمز الـ QR
          </NuxtLink>

          <NuxtLink 
            v-if="authStore.isAdmin" 
            :to="`/dashboard/${ authStore.user?.restaurant_slug}`"
            class="flex items-center gap-fluid px-fluid py-3 rounded-xl text-fluid-sm font-medium transition hover:bg-primary/10 text-text/80 hover:text-primary"
            active-class="bg-bg text-primary! hover:text-text!">
            <Icon name="lucide:home" class="w-5 h-5" />
            {{ authStore.user?.restaurant_name + ' ' + 'Details'}}
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