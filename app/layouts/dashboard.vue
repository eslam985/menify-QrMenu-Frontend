<!-- app/layouts/dashboard.vue -->

<template>
  <div class="bg-bg text-text flex min-h-screen w-full items-stretch" dir="rtl">
    <DashboardSidebar />

    <div class="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
      <DashboardHeader />

      <main class="px-fluid my-section-fluid flex-1 overflow-y-auto">
        <CommonNotificationAlert />
        <slot />
      </main>
    </div>

    <CommonCustomConfirmModal />
  </div>
</template>
