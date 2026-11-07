<!-- app/components/dashboard/DashboardHeader.vue -->
<script setup lang="ts">
import { useDashboardLayout } from '~/composables/useDashboardLayout'
import { useAuthStore } from '~/stores/auth'

const { toggleMobile } = useDashboardLayout()
const authStore = useAuthStore()
</script>

<template>
  <header
    class="w-full mb-section-fluid border-b border-primary/15 p-fluid flex items-center justify-between bg-card shrink-0 sticky top-0 z-30 shadow-xs">
    <!-- يمين الهيدر: زر القائمة للموبايل + الشعار والعنوان -->
    <div class="flex items-center gap-4">
      <button @click="toggleMobile"
        class="md:hidden p-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm focus:outline-none flex items-center justify-center cursor-pointer hover:bg-primary/20 transition"
        aria-label="فتح القائمة">
        ☰
      </button>

      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl bg-bg text-primary flex items-center justify-center font-black text-lg shadow-glow">
          M
        </div>
        <div>
          <h2 class="text-sm font-bold text-primary">{{ authStore.user?.restaurant_name + ' ' + 'Dashboard' }}</h2>
          <p class="text-[10px] text-text/60">لوحة التحكم الإدارية</p>
        </div>
      </div>
    </div>

    <!-- يسار الهيدر: تبديل الثيم + معلومات المشرف -->
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex flex-col items-end">
        <NuxtLink to="/dashboard/profile" class="text-xs font-bold text-primary">{{ authStore.user?.username || 'المشرف' }}</NuxtLink>
        <span class="text-[10px] text-text/60">{{ authStore.user?.email || '' }}</span>
      </div>

      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>