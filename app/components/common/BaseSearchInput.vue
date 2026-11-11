<!-- app/components/common/BaseSearchInput.vue -->
<script setup lang="ts">
import { useCategorySearch } from "~/composables/useCategorySearch";

const { searchQuery, setSearchQuery } = useCategorySearch();

const route = useRoute();

const currentSection = computed(() => {
  const parts = route.path.split("/");

  const cleanParts = parts.filter(Boolean);
  return cleanParts[cleanParts.length - 1];
});
</script>

<template>
  <div class="relative w-full sm:w-72">
    <span
      class="text-primary text-fluid-sm pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
    >
      <Icon name="lucide:search"></Icon>
    </span>
    <input
      :value="searchQuery"
      @input="setSearchQuery(($event.target as HTMLInputElement).value)"
      type="text"
      :placeholder="`بحث سريع في الـ ${currentSection}`"
      class="bg-card border-primary/10 text-text focus:border-primary text-fluid-sm p-section-fluid w-full rounded-xl border py-2.5 shadow-xs transition focus:outline-none"
    />
    <button
      v-if="searchQuery"
      @click="setSearchQuery('')"
      class="text-text/40 hover:text-text text-fluid-xs absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
    >
      ✕
    </button>
  </div>
</template>
