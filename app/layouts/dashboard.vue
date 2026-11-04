<!-- app/layouts/dashboard.vue -->
<script setup lang="ts">
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import NotificationAlert from '~/components/common/NotificationAlert.vue'
import CustomConfirmModal from '~/components/common/CustomConfirmModal.vue'
</script>

<template>
  <div class="min-h-screen bg-bg text-text flex rtl overflow-x-hidden w-full" dir="rtl">
    <!-- القائمة الجانبية -->
    <DashboardSidebar />

    <!-- محتوى الصفحة الرئيسي والهيدر العلوي -->
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardHeader />

      <main class="flex-1 p-fluid md:p-fluid overflow-y-auto">
        <NotificationAlert />
        <slot />
      </main>
    </div>

    <!-- نافذة التأكيد العامة -->
    <CustomConfirmModal />
  </div>
</template>