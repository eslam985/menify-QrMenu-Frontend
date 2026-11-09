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
    <!-- هيدر الملف الشخصي العلوي -->
    <DashboardProfileHeader />
    <!-- مرساة ثابتة دائماً في الـ DOM ليقفز إليها المتصفح فوراً دون انتظار رندرة الفورم -->

    <!-- حاوية الفورمات الموزعة هندسياً بدقة عبر الـ Grid -->
    <div
      class="my-section-fluid gap-fluid grid grid-cols-1 items-start sm:grid-cols-2"
    >
      <DashboardProfileInfoForm class="h-full" />
      <DashboardProfilePasswordForm class="h-full" />
    </div>

    <!-- جدول الجلسات النشطة في الأسفل -->
    <div class="">
      <DashboardProfileActiveSessionsList />
    </div>
  </div>
</template>
