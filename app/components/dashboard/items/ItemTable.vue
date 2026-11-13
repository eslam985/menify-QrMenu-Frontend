<!-- app/components/dashboard/items/ItemTable.vue -->
<script setup lang="ts">
import { useItemState } from "@/composables/item/useItemState";
import { useTable } from "~/composables/useTable";
import { useItemModal } from "~/composables/item/useItemModal";
const { openItemModal } = useItemModal();
const { setTableConfig } = useTable();
const {
  itemStore,
  authStore,
  publicMenuStore,
  filteredItems,
  getCategoryName,
} = useItemState();

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
  ...( authStore.isEditorAndAbove ? [ { key: "actions", label: "الإجراءات" } ] : [] ),
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
      <span class="text-text/60 text-fluid-xs">{{
        formatDate(String(value ?? ""))
      }}</span>
    </template>

    <template #cell-category="{ row }">
      <span
        class="bg-primary/10 text-primary text-fluid-xs rounded-lg px-2.5 py-1 font-semibold"
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
          'px-fluid text-fluid-xs cursor-pointer rounded-full py-1 font-bold transition',
          row.is_available
            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            : 'bg-danger/10 text-danger hover:bg-danger/20',
        ]"
      >
        {{ row.is_available ? "متوفر" : "غير متوفر" }}
      </button>
    </template>

    <template #cell-updated_at="{ row }">
      <span class="text-text/60 text-fluid-xs">{{
        formatDate(row.updated_at as string)
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div
        v-if="authStore.isEditorAndAbove"
        class="flex items-center justify-center gap-2"
      >
        <button
          type="button"
          @click="
            openItemModal(row);
            itemStore.error = '';
          "
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary px-fluid text-fluid-xs cursor-pointer rounded-xl border py-1.5 font-medium active:scale-95"
        >
          تعديل
        </button>
        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="itemStore.removeItem(row.id as string)"
          :disabled="itemStore.isLoading"
          class="bg-danger/5 px-fluid text-fluid-xs text-danger hover:bg-danger/10 cursor-pointer rounded-xl border border-red-500/20 py-1.5 font-medium active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
