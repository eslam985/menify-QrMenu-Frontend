<script setup lang="ts">

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

</script>


<!-- app/pages/dashboard/profile/index.vue -->
<template>
  <div class="max-w-6xl w-full mx-auto min-w-0 overflow-x-hidden flex flex-col gap-fluid">
    <!-- هيدر الملف الشخصي العلوي -->
    <DashboardProfileHeader />
    <!-- مرساة ثابتة دائماً في الـ DOM ليقفز إليها المتصفح فوراً دون انتظار رندرة الفورم -->

    <!-- حاوية الفورمات الموزعة هندسياً بدقة عبر الـ Grid -->
    <div class="my-section-fluid grid grid-cols-1 sm:grid-cols-2 gap-fluid items-start">
      <DashboardProfileInfoForm class="h-full" />
      <DashboardProfilePasswordForm class="h-full" />
    </div>

    <!-- جدول الجلسات النشطة في الأسفل -->
    <div class="">
      <DashboardProfileActiveSessionsList />
    </div>
  </div>
</template>
