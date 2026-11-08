<!-- app/pages/dashboard/offers/[id].vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const route = useRoute()
const offerId = computed(() => (route.params.id !== 'new' ? (route.params.id as string) : null))
</script>

<template>
  <DashboardOffersOfferForm :offer-id="offerId" />
</template>
