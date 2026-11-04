<!-- app/components/ui/BaseTable.vue -->
<script setup lang="ts">
import { useTable } from '~/composables/useTable'

const { columns, rows, isLoading, sortBy, sortOrder, handleSort, handleRowClick } = useTable()

// تعريف الـ slots ليتعرف عليها المحرر فوراً
defineSlots<{
  [key: string]: (props: { value: any; row: any }) => any
}>()
</script>

<template>
  <div class="bg-card border border-primary/30 rounded-2xl shadow-soft overflow-hidden">
    <!-- loading -->
    <div v-if="isLoading" class="p-8 text-center text-text font-medium">
      loading...
    </div>

    <!-- table -->
    <div v-else-if="rows && rows.length > 0" class="w-full overflow-x-auto">
      <table class="w-full text-fluid-xs whitespace-nowrap">
        <thead class="bg-bg border-b border-primary/30 text-primary">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable && handleSort(col.key)"
              :class="[
                'p-fluid text-center select-none text-primary md:hover:text-text text-fluid-p ',
                col.sortable ? 'cursor-pointer hover:bg-primary/30 transition-colors' : '',
              ]"
            >
              <div class="flex items-center gap-1 justify-center">
                <span>{{ col.label }}</span>
                <span v-if="col.sortable && sortBy === col.key">
                  {{ sortOrder === 'ASC' ? '▲' : '▼' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary/30 bg-card text-text">
          <tr
            v-for="(row, index) in rows"
            :key="row.id || index"
            @click="handleRowClick(row)"
            class="hover:bg-bg transition-colors text-text text-fluid-p cursor-pointer"
          >
            <td v-for="col in columns" :key="col.key" class="p-fluid text-center md:hover:text-primary">
              <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
                {{ row[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- no data -->
    <div v-else class="text-fluid-xs text-text py-12 text-center bg-primary/5 space-y-3">
      <p class="font-semibold text-main">No data</p>
      <p class="text-text">جرب اضافة بيانات اولا</p>
    </div>
  </div>
</template>