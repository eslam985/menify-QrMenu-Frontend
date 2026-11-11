<!-- app/components/dashboard/DashboardMobileHeader.vue -->
<script setup lang="ts">
import { useDashboardLayout } from "~/composables/useDashboardLayout";
const authStore = useAuthStore();
const { toggleMobile } = useDashboardLayout();
</script>

<template>
  <header
    class="bg-card border-primary/10 p-fluid flex shrink-0 items-center justify-between border-b md:hidden"
  >
    <button
      @click="toggleMobile"
      class="bg-primary/10 text-primary text-fluid-sm flex cursor-pointer items-center gap-2 rounded-xl p-2 font-bold focus:outline-none"
    >
      <span>☰ القائمة</span>
    </button>
    <span class="text-primary text-fluid-sm font-bold">{{
      authStore.user?.restaurant_name + " " + "Dashboard"
    }}</span>
  </header>
</template>
