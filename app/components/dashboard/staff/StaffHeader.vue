<!-- /Menify/frontend/app/components/dashboard/staff/StaffHeader.vue -->
<script setup lang="ts">
const staffStore = useStaffStore()
const notiStore = useNotificationStore()

const handleRefresh = async () => {
  try {
    await staffStore.getStaff()
    notiStore.show('تم تحديث البيانات بنجاح', 'success')
  } catch (err: any) {
    notiStore.show('فشل تحديث البيانات', 'error')
  }
}


</script>

<template>
  <div class="w-full 2xl:max-w-[90%] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-fluid mb-section-fluid">
    <div class="w-full md:max-w-[40%]">
      <div class="flex gap-fluid">
        <Icon name="lucide:user-plus" class="w-5 h-5 text-primary self-center" />
        <h1 class="text-fluid-h3 font-bold text-text md:hover:text-primary">إدارة الموظفين</h1>
      </div>
      <p class="text-xs text-text/60 mt-1 border-b border-primary/10 pb-3">تحكم في عرض الموظفين وصلاحيتهم</p>
    </div>

    <!-- أداة البحث وأزرار التحكم -->
    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <CommonBaseSearchInput />

      <button @click="handleRefresh" :disabled="staffStore.isLoading"
        class="p-section-fluid py-2.5 rounded-xl bg-card border border-primary/10 text-text hover:text-primary transition cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50 md:hover:bg-primary/5"
        title="تحديث البيانات">
        <Icon name="lucide:refresh-cw" class="w-5 h-5 text-primary" :class="{ 'animate-spin': staffStore.isLoading }" />
      </button>

      <NuxtLink href="/dashboard/staff/new-employee" class="btn-primary">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>إضافة موظف جديد</span>
      </NuxtLink>
    </div>
  </div>
</template>