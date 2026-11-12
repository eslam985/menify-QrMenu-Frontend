<!-- app/pages/dashboard/offers/[id].vue -->
<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

import { useOfferState } from "~/composables/offer/useOfferState";
const { id } = useOfferState();
</script>

<template>
  <DashboardOffersOfferForm :offer-id="id" />
</template>
