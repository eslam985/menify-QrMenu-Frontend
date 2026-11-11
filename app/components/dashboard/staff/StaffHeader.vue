<!-- /tabloz/frontend/app/components/dashboard/staff/StaffHeader.vue -->
<script setup lang="ts">
const staffStore = useStaffStore();
const notiStore = useNotificationStore();

const handleRefresh = async () => {
  const isSuccess = await staffStore.getStaff();

  if (isSuccess) notiStore.show("تم تحديث البيانات بنجاح", "success");
};
</script>

<template>
  <div
    class="gap-fluid mb-section-fluid mx-auto flex w-full flex-col items-start justify-between lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <div class="w-full md:max-w-[40%]">
      <div class="gap-fluid flex">
        <Icon
          name="lucide:user-plus"
          class="text-primary h-5 w-5 self-center"
        />
        <h1 class="text-fluid-h3 text-text md:hover:text-primary font-bold">
          إدارة الموظفين
        </h1>
      </div>
      <p
        class="text-text/60 border-primary/10 text-fluid-xs mt-1 border-b pb-3"
      >
        تحكم في عرض الموظفين وصلاحيتهم
      </p>
    </div>

    <div class="gap-fluid flex w-full flex-wrap items-center md:w-auto">
      <CommonBaseSearchInput />

      <button
        @click="handleRefresh"
        :disabled="staffStore.isLoading"
        class="p-section-fluid bg-card border-primary/10 text-text hover:text-primary md:hover:bg-primary/5 flex cursor-pointer items-center justify-center rounded-xl border py-2.5 shadow-xs transition disabled:opacity-50"
        title="تحديث البيانات"
      >
        <Icon
          name="lucide:refresh-cw"
          class="text-primary h-5 w-5"
          :class="{ 'animate-spin': staffStore.isLoading }"
        />
      </button>

      <NuxtLink
        href="/dashboard/staff/new-employee"
        class="btn-primary flex justify-between gap-1"
      >
        <span>إضافة موظف جديد</span>
        <Icon name="lucide:plus" class="h-4 w-4 self-center" />
      </NuxtLink>
    </div>
  </div>
</template>
