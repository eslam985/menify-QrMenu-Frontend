<!-- app/components/dashboard/DashboardHeader.vue -->
<script setup lang="ts">
import { useDashboardLayout } from "~/composables/useDashboardLayout";

const { toggleMobile } = useDashboardLayout();
const authStore = useAuthStore();
</script>

<template>
  <header
    class="border-primary/15 p-fluid bg-card sticky top-0 z-30 flex w-full shrink-0 items-center justify-between border-b shadow-xs"
  >
    <div class="gap-fluid flex items-center">
      <button
        @click="toggleMobile"
        class="bg-primary/10 text-primary hover:bg-primary/20 text-fluid-sm flex cursor-pointer items-center justify-center rounded-xl p-2.5 font-bold transition focus:outline-none md:hidden"
        aria-label="فتح القائمة"
      >
        ☰
      </button>

      <div class="gap-fluid flex items-center">
        <div
          class="bg-bg text-primary shadow-glow text-fluid-p flex h-9 w-9 items-center justify-center rounded-xl font-black"
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
    </div>

    <div class="gap-fluid flex items-center">
      <div class="hidden flex-col items-end sm:flex">
        <NuxtLink
          to="/dashboard/profile"
          class="text-primary text-fluid-xs font-bold"
          >{{ authStore.user?.username || "المشرف" }}</NuxtLink
        >
        <span class="text-text/60 text-fluid-xs">{{
          authStore.user?.email || ""
        }}</span>
      </div>

      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>
