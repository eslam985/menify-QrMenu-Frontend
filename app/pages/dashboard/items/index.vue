<!-- app/pages/dashboard/items/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
import { useItemState } from "~/composables/item/useItemState";
const { itemStore, loadItemsData } = useItemState();

onMounted(async () => {
  if (itemStore.items?.length < 1) {
    loadItemsData();
  }
});
</script>

<template>
  <div>
    <DashboardItemsItemHeader />
    <DashboardItemsItemTable />
    <DashboardItemsItemModal />
  </div>
</template>
