<!-- app/layouts/dashboard.vue -->

<template>
  <!-- 🌟 أضفنا items-stretch لضمان تمدد السايد بار لآخر عنصر طولياً في الصفحة تلقائياً -->
  <div class="min-h-screen w-full bg-bg text-text flex items-stretch" dir="rtl">

    <!-- القائمة الجانبية (ستتمدد تلقائياً الآن لآخر الصفحة) -->
    <DashboardSidebar />

    <!-- محتوى الصفحة الرئيسي والهيدر العلوي -->
    <div class="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
      <DashboardHeader />

      <main class="flex-1 p-fluid overflow-y-auto">
        <CommonNotificationAlert />
        <slot />
      </main>
    </div>

    <!-- نافذة التأكيد العامة -->
    <CommonCustomConfirmModal />
  </div>
</template>
