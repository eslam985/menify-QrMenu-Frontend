<!-- app/components/dashboard/categories/CategoryTable.vue -->
<script setup lang="ts">
import { useCategorySearch } from "~/composables/useCategorySearch";
import { useTable } from "~/composables/useTable";

const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const { searchQuery } = useCategorySearch();
const { openModal } = useCategoryModal();
const { setTableConfig } = useTable();

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories;

  const query = searchQuery.value.toLowerCase().trim();

  return categoryStore.categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(query) ||
      cat.section.toLowerCase().includes(query),
  );
});

const tableColumns = [
  { key: "name", label: "اسم التصنيف" },
  { key: "section", label: "القسم (Section)" },
  { key: "items_count", label: "عدد الأصناف" },
  { key: "display_order", label: "الترتيب" },
  { key: "updated_at", label: "آخر تحديث" },
  { key: "created_at", label: "تاريخ الانشاء" },
  { key: "actions", label: "الإجراءات" },
];

watchEffect(() => {
  setTableConfig(
    tableColumns,
    filteredCategories.value,
    categoryStore.isLoading,
  );
});

const handleDelete = async (categoryId: string) => {
  if (!categoryId) return;
  await categoryStore.removeCategory(categoryId);
};
</script>

<template>
  <UiBaseTable>
    <template #cell-updated_at="{ value }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{
        formatDate(String(value ?? ""))
      }}</span>
    </template>
    <template #cell-created_at="{ value }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{
        formatDate(String(value ?? ""))
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          @click="openModal(row)"
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary text-fluid-xs px-fluid cursor-pointer rounded-xl border py-1.5 font-medium active:scale-95"
        >
          تعديل
        </button>

        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="handleDelete(row.id as string)"
          :disabled="categoryStore.isLoading"
          class="bg-danger/5 text-fluid-xs hover:bg-danger/10 px-fluid text-danger cursor-pointer rounded-xl border border-red-500/20 py-1.5 font-medium active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
