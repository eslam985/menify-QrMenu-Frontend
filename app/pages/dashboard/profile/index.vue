<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})


</script>

<!-- app/pages/dashboard/profile/index.vue -->
<template>
  <div class="w-full min-w-0 overflow-x-hidden">
    <!-- هيدر الملف الشخصي العلوي -->
    <DashboardProfileHeader />

    <!-- حاوية الفورمات الموزعة هندسياً بدقة -->
    <div
      class="max-w-6xl mx-auto my-section-fluid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-fluid items-start">
      <DashboardProfileInfoForm class="h-full" />
      <DashboardProfilePasswordForm class="h-full" />
      <DashboardProfileEmployeeInviteForm class="h-full" />
    </div>
    
    <DashboardProfileActiveSessionsList class="h-full" />
  </div>
</template>
