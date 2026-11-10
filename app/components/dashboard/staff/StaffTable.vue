<!-- app/components/dashboard/categories/CategoryTable.vue -->
<script setup lang="ts">
import { useCategorySearch } from "~/composables/useCategorySearch";
import { useTable } from "~/composables/useTable";
import type { UserResponse } from "~/types/userType/userType";

const staffStore = useStaffStore();
const authStore = useAuthStore();

const { searchQuery } = useCategorySearch();
const { setTableConfig } = useTable();
const DEFAULT_AVATAR: string =
  "https://res.cloudinary.com/dbahqgo8j/image/upload/blogger/iaeclevshfanh5j6x9ew.webp";

onMounted(async () => {
  if (staffStore.staff?.length < 1) {
    await staffStore.getStaff();
  }
});

const filteredEmployee = computed(() => {
  if (!searchQuery.value) return staffStore.staff;

  const query = searchQuery.value.toLowerCase().trim();

  return staffStore.staff.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query),
  );
});

const tableColumns = [
  { key: "avatar_url", label: "الصورة" },
  { key: "username", label: "اسم الموظف" },
  { key: "email", label: "الايميل" },
  { key: "roles", label: "الدور / الصلاحية" },
  { key: "created_at", label: "تاريخ الانضمام" },
  { key: "updated_at", label: "آخر تعديل" },
  { key: "actions", label: "الإجراءات" },
];

watchEffect(() => {
  setTableConfig(tableColumns, filteredEmployee.value, staffStore.isLoading);
});

const handleDelete = async (staffId: string) => {
  if (!staffId) return;
  await staffStore.deleteStaff(staffId);
};

const role = (role: string): "Admin" | "Editor" | "User" | "N/A" => {
  if (!role) return "N/A";

  if (role === "5150") return "Admin";
  if (role === "1984") return "Editor";
  if (role === "2001") return "User";

  return "N/A";
};
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
          class="bg-bg text-success border-primary/10 rounded-full border px-3 py-1 text-xs font-semibold"
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
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95"
        >
          تعديل
        </NuxtLink>

        <button
          type="button"
          @click="handleDelete((row as unknown as UserResponse).id)"
          :disabled="staffStore.isLoading"
          class="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500/10 active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
