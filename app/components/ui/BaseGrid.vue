<!-- app/components/ui/BaseGrid.vue -->
<script setup lang="ts" generic="T extends Record<string, unknown>">
defineProps<{
  rows?: T[];
  isLoading?: boolean;
}>();

defineSlots<{
  card: (props: { row: T }) => unknown;
}>();
</script>

<template>
  <div class="relative w-full">
    <div
      v-if="isLoading"
      class="text-text/60 flex flex-col items-center justify-center gap-3 py-20"
    >
      loading...
    </div>

    <div
      v-else-if="!rows || !rows.length"
      class="text-text/60 border-primary/20 text-fluid-p rounded-2xl border border-dashed py-20 text-center"
    >
      لا توجد بيانات لعرضها
    </div>

    <div
      v-else
      class="gap-fluid-gap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      <div
        v-for="(row, index) in rows"
        :key="String(row.id ?? index)"
        class="bg-card border-primary/10 shadow-soft hover:border-primary/40 group flex max-h-[400px] flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-md"
      >
        <slot name="card" :row="row"></slot>
      </div>
    </div>
  </div>
</template>
