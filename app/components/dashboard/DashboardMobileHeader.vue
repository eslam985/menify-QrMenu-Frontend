<!-- app/components/dashboard/DashboardMobileHeader.vue -->
<script setup lang="ts">
import { useDashboardLayout } from "~/composables/useDashboardLayout";
const authStore = useAuthStore();
const { toggleMobile } = useDashboardLayout();
</script>

<template>
  <header
    class="bg-card border-primary/10 flex shrink-0 items-center justify-between border-b p-4 md:hidden"
  >
    <button
      @click="toggleMobile"
      class="bg-primary/10 text-primary flex cursor-pointer items-center gap-2 rounded-xl p-2 text-sm font-bold focus:outline-none"
    >
      <span>☰ القائمة</span>
    </button>
    <span class="text-primary text-sm font-bold">{{
      authStore.user?.restaurant_name + " " + "Dashboard"
    }}</span>
  </header>
</template>
