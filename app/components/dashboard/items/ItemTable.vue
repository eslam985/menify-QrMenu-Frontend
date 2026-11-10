<!-- app/components/dashboard/items/ItemTable.vue -->
<script setup lang="ts">
import { useItemModal } from "~/composables/useItemModal";
import { useItemSearch } from "~/composables/useItemSearch";
import { useTable } from "~/composables/useTable";

const { searchQuery, selectedCategoryFilter } = useItemSearch();
const { setTableConfig } = useTable();
const { openModal } = useItemModal();

const publicMenuStore = usePublicMenuStore();
const categoryStore = useCategoryStore();
const itemStore = useItemStore();
const authStore = useAuthStore();

const getCategoryName = (categoryId: string) => {
  const cat = categoryStore.categories.find((c) => c.id === categoryId);
  return cat ? cat.name : "—";
};

const filteredItems = computed(() => {
  let result = itemStore.items;

  if (selectedCategoryFilter.value) {
    result = result.filter(
      (item) => item.category_id === selectedCategoryFilter.value,
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();

    result = result.filter((item) => {
      const category = categoryStore.categories.find(
        (c) => c.id === item.category_id,
      );

      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = item.description
        ? item.description.toLowerCase().includes(query)
        : false;
      const categoryNameMatch = category
        ? category.name.toLowerCase().includes(query)
        : false;
      const categorySectionMatch = category
        ? category.section.toLowerCase().includes(query)
        : false;

      return (
        titleMatch || descMatch || categoryNameMatch || categorySectionMatch
      );
    });
  }

  return result;
});

const tableColumns = [
  { key: "image_url", label: "الصورة" },
  { key: "title", label: "اسم الصنف" },
  { key: "category", label: "التصنيف" },
  { key: "description", label: "الوصف" },
  { key: "price", label: "السعر" },
  { key: "is_available", label: "حالة التوفر" },
  { key: "display_order", label: "الترتيب" },
  { key: "created_at", label: "تاريخ الإضافة" },
  { key: "updated_at", label: "آخر تحديث" },
  { key: "actions", label: "الإجراءات" },
];

watchEffect(() => {
  setTableConfig(tableColumns, filteredItems.value, itemStore.isLoading);
});
</script>

<template>
  <UiBaseTable>
    <template #cell-image_url="{ row }">
      <div class="flex items-center justify-center">
        <img
          v-if="row.image_url"
          :src="row.image_url as string"
          :alt="row.title as string"
          class="border-primary/10 h-10 w-10 rounded-xl border object-cover shadow-xs"
        />

        <div
          v-else
          class="bg-primary/5 border-primary/10 text-text/40 flex h-10 w-10 items-center justify-center rounded-xl border"
        >
          <Icon name="lucide:image" class="h-5 w-5" />
        </div>
      </div>
    </template>

    <template #cell-created_at="{ value }">
      <span class="text-text/60 text-xs">{{
        formatDate(String(value ?? ""))
      }}</span>
    </template>

    <template #cell-category="{ row }">
      <span
        class="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-semibold"
      >
        {{ getCategoryName(row.category_id as string) }}
      </span>
    </template>

    <template #cell-price="{ row }">
      <span class="text-primary font-bold">
        {{ row.price + (publicMenuStore.restaurant?.currency ?? "ج.م") }}
      </span>
    </template>

    <template #cell-is_available="{ row }">
      <button
        @click="
          itemStore.toggleAvailability(
            row.id as string,
            row.is_available as boolean,
          )
        "
        :class="[
          'cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition',
          row.is_available
            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
        ]"
      >
        {{ row.is_available ? "متوفر" : "غير متوفر" }}
      </button>
    </template>

    <template #cell-updated_at="{ row }">
      <span class="text-text/60 text-xs">{{
        formatDate(row.updated_at as string)
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-2">
        <button
          type="button"
          @click="openModal(row)"
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-95"
        >
          تعديل
        </button>
        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="itemStore.removeItem(row.id as string)"
          :disabled="itemStore.isLoading"
          class="cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500/10 active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
