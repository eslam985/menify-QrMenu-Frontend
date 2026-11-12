<!-- app/pages/dashboard/categories/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

import { useCategoryState } from "~/composables/category/useCategoryState";
const { loadCategoreData } = useCategoryState();

const categoryStore = useCategoryStore();

onMounted(async () => {
  if (categoryStore.categoriesCount < 1) {
    loadCategoreData();
  }
});
</script>

<template>
  <div>
    <DashboardCategoriesCategoryHeader />

    <DashboardCategoriesCategoryTable />

    <DashboardCategoriesCategoryModal />
  </div>
</template>
