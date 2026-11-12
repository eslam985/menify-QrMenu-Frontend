<!-- app/components/dashboard/categories/CategoryTable.vue -->
<script setup lang="ts">
import type { UserResponse } from "~/types/userType/userType";

import { useStaffState } from "~/composables/staff/useStaffState";
import { useTable } from "~/composables/useTable";

const {
  filteredEmployee,
  DEFAULT_AVATAR,
  staffStore,
  authStore,
  role,
  loadData,
  handleDelete,
} = useStaffState();
const { setTableConfig } = useTable();

const tableColumns = [
  { key: "avatar_url", label: "الصورة" },
  { key: "username", label: "اسم الموظف" },
  { key: "email", label: "الايميل" },
  { key: "roles", label: "الدور / الصلاحية" },
  { key: "created_at", label: "تاريخ الانضمام" },
  { key: "updated_at", label: "آخر تعديل" },
  { key: "actions", label: "الإجراءات" },
];

onMounted(() => {
  if (staffStore.staff?.length < 1) {
    loadData();
  }
});

watchEffect(() => {
  setTableConfig(tableColumns, filteredEmployee.value, staffStore.isLoading);
});
</script>

<template>
  <UiBaseTable class="my-section-fluid">
    <template #cell-avatar_url="{ row }">
      <img
        :src="(row.avatar_url as UserResponse['avatar_url']) ?? DEFAULT_AVATAR"
        alt="صور الموظف"
        class="h-20 w-20 rounded-full"
      />
    </template>

    <template #cell-roles="{ row }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{
        role((row as unknown as UserResponse).roles)
      }}</span>
    </template>

    <template #cell-updated_at="{ row }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{
        formatDate((row as unknown as UserResponse).updated_at)
      }}</span>
    </template>

    <template #cell-created_at="{ row }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{
        formatDate((row as unknown as UserResponse).created_at)
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div
        v-if="row.id === authStore.user?.id || row.roles === '5150'"
        class="flex items-center justify-center"
      >
        <span
          class="bg-bg text-success border-primary/10 px-fluid text-fluid-xs rounded-full border py-1 font-semibold"
        >
          Admin
        </span>
      </div>

      <div
        v-else-if="authStore.isAdmin"
        class="flex items-center justify-center gap-2"
      >
        <NuxtLink
          :to="`/dashboard/staff/edit-employee/${row.id}`"
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary px-fluid text-fluid-xs cursor-pointer rounded-xl border py-1.5 font-medium active:scale-95"
        >
          تعديل
        </NuxtLink>

        <button
          type="button"
          @click="handleDelete((row as unknown as UserResponse).id)"
          :disabled="staffStore.isLoading"
          class="bg-danger/5 px-fluid text-fluid-xs text-danger hover:bg-danger/10 cursor-pointer rounded-xl border border-red-500/20 py-1.5 font-medium active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
