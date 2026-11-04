<!-- app/components/dashboard/DashboardMobileHeader.vue -->
<script setup lang="ts">
import { useDashboardLayout } from '~/composables/useDashboardLayout'
const authStore = useAuthStore()
const { toggleMobile } = useDashboardLayout()
</script>

<template>
  <header class="md:hidden flex items-center justify-between p-4 bg-card border-b border-primary/10 shrink-0">
    <button 
      @click="toggleMobile" 
      class="p-2 rounded-xl bg-primary/10 text-primary font-bold text-sm focus:outline-none flex items-center gap-2 cursor-pointer"
    >
      <span>☰ القائمة</span>
    </button>
    <span class="font-bold text-primary text-sm">{{ authStore.user?.restaurant_name + ' ' + 'Dashboard' }}</span>
  </header>
</template>