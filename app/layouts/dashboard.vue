<!-- app/layouts/dashboard.vue -->

<template>
  <!-- 🌟 أضفنا items-stretch لضمان تمدد السايد بار لآخر عنصر طولياً في الصفحة تلقائياً -->
  <div class="bg-bg text-text flex min-h-screen w-full items-stretch" dir="rtl">
    <!-- القائمة الجانبية (ستتمدد تلقائياً الآن لآخر الصفحة) -->
    <DashboardSidebar />

    <!-- محتوى الصفحة الرئيسي والهيدر العلوي -->
    <div class="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
      <DashboardHeader />

      <main class="px-fluid my-section-fluid flex-1 overflow-y-auto">
        <CommonNotificationAlert />
        <slot />
      </main>
    </div>

    <!-- نافذة التأكيد العامة -->
    <CommonCustomConfirmModal />
  </div>
</template>
