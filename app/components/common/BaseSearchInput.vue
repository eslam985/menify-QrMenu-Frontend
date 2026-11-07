<!-- app/components/common/BaseSearchInput.vue -->
<script setup lang="ts">
import { useCategorySearch } from '~/composables/useCategorySearch'

const { searchQuery, setSearchQuery } = useCategorySearch()

const route = useRoute()

// جلب آخر جزء من الرابط ديناميكياً
const currentSection = computed(() => {
  const parts = route.path.split('/')
  // دالة filter تضمن حذف أي فراغات إذا كان الرابط ينتهي بـ سلاش مائل /
  const cleanParts = parts.filter(Boolean)
  return cleanParts[cleanParts.length - 1]
  // إذا كنت في صفحة الأصناف سيطبع: items
// إذا كنت في صفحة التصنيفات سيطبع: categories
})


</script>

<template>
  <div class="relative w-full sm:w-72">
    <span class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-text/40 text-sm">
      🔍
    </span>
    <input :value="searchQuery" @input="setSearchQuery(($event.target as HTMLInputElement).value)" type="text"
      :placeholder='`بحث سريع في الـ ${currentSection}`'
      class="w-full pl-8 pr-10 py-2.5 rounded-xl bg-card border border-primary/10 text-text text-sm focus:outline-none focus:border-primary transition shadow-xs" />
    <button v-if="searchQuery" @click="setSearchQuery('')"
      class="absolute inset-y-0 left-0 flex items-center pl-3 text-text/40 hover:text-text text-xs cursor-pointer">
      ✕
    </button>
  </div>
</template>