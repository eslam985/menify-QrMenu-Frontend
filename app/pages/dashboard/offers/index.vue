<!-- app/pages/dashboard/offers/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

import { useOfferState } from "~/composables/offer/useOfferState";
const { loadOfferData, offerStore } = useOfferState();

onMounted(async () => {
  if (offerStore.offers?.length < 1) {
    await loadOfferData();
  }
});
</script>

<template>
  <div>
    <DashboardOffersOfferHeader />
    <DashboardOffersOfferTable />
  </div>
</template>
