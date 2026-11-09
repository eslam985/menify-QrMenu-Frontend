<!-- app/components/common/BaseSearchInput.vue -->
<script setup lang="ts">
import { useCategorySearch } from "~/composables/useCategorySearch";

const { searchQuery, setSearchQuery } = useCategorySearch();

const route = useRoute();

// جلب آخر جزء من الرابط ديناميكياً
const currentSection = computed(() => {
  const parts = route.path.split("/");
  // دالة filter تضمن حذف أي فراغات إذا كان الرابط ينتهي بـ سلاش مائل /
  const cleanParts = parts.filter(Boolean);
  return cleanParts[cleanParts.length - 1];
  // إذا كنت في صفحة الأصناف سيطبع: items
  // إذا كنت في صفحة التصنيفات سيطبع: categories
});
</script>

<template>
  <div class="relative w-full sm:w-72">
    <span
      class="text-text/40 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm"
    >
      🔍
    </span>
    <input
      :value="searchQuery"
      @input="setSearchQuery(($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="`بحث سريع في الـ ${currentSection}`"
      class="bg-card border-primary/10 text-text focus:border-primary w-full rounded-xl border py-2.5 pr-10 pl-8 text-sm shadow-xs transition focus:outline-none"
    />
    <button
      v-if="searchQuery"
      @click="setSearchQuery('')"
      class="text-text/40 hover:text-text absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3 text-xs"
    >
      ✕
    </button>
  </div>
</template>
