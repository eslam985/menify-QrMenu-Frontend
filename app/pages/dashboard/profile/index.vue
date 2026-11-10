<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const userStore = useUserStore();

onMounted(async () => {
  if (userStore.sessions?.length < 1) {
    await userStore.getSessionsByUserId({});
  }
});
</script>

<!-- app/pages/dashboard/profile/index.vue -->
<template>
  <div
    class="gap-fluid mx-auto flex w-full max-w-6xl min-w-0 flex-col overflow-x-hidden"
  >
    <DashboardProfileHeader />

    <div
      class="my-section-fluid gap-fluid grid grid-cols-1 items-start sm:grid-cols-2"
    >
      <DashboardProfileInfoForm class="h-full" />
      <DashboardProfilePasswordForm class="h-full" />
    </div>

    <div class="">
      <DashboardProfileActiveSessionsList />
    </div>
  </div>
</template>
