<!-- app/components/ui/BaseTable.vue -->
<script setup lang="ts" generic="T extends Record<string, unknown>">
import { useTable } from "~/composables/useTable";

const {
  columns,
  rows,
  isLoading,
  sortBy,
  sortOrder,
  handleSort,
  handleRowClick,
} = useTable();

defineSlots<{
  [key: string]: (props: { value: unknown; row: T }) => unknown;
}>();
</script>

<template>
  <div
    class="bg-card border-primary/30 shadow-soft mx-auto w-full overflow-hidden rounded-2xl border 2xl:max-w-[90%]"
  >
    <div v-if="isLoading" class="text-text p-8 text-center font-medium">
      loading...
    </div>

    <div v-else-if="rows && rows.length > 0" class="w-full overflow-x-auto">
      <table class="text-fluid-xs w-full whitespace-nowrap">
        <thead class="bg-bg border-primary/30 text-primary border-b">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable && handleSort(col.key)"
              :class="[
                'p-fluid text-primary md:hover:text-text text-fluid-p text-center select-none',
                col.sortable
                  ? 'hover:bg-primary/30 cursor-pointer transition-colors'
                  : '',
              ]"
            >
              <div class="flex items-center justify-center gap-1">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable && sortBy === col.key">
                  {{ sortOrder === "ASC" ? "▲" : "▼" }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-primary/30 bg-card text-text divide-y">
          <tr
            v-for="(row, index) in rows"
            :key="String(row.id ?? index)"
            @click="handleRowClick(row)"
            class="hover:bg-bg text-text text-fluid-p cursor-pointer transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="p-fluid md:hover:text-primary text-center"
            >
              <slot
                :name="`cell-${col.key}`"
                :value="row[col.key]"
                :row="row as T"
              >
                {{ row[col.key] ?? "-" }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="text-fluid-xs text-text bg-primary/5 space-y-3 py-12 text-center"
    >
      <p class="text-main font-semibold">No data</p>
      <p class="text-text">جرب اضافة بيانات اولا</p>
    </div>
  </div>
</template>
