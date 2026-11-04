<!-- app/pages/dashboard/offers/index.vue -->
<script setup lang="ts">
import { useOfferStore } from '~/stores/offer'
import OfferHeader from '~/components/dashboard/offers/OfferHeader.vue'
import OfferTable from '~/components/dashboard/offers/OfferTable.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const offerStore = useOfferStore()

onMounted(async () => {
  await offerStore.fetchOffers()
})
</script>

<template>
  <div>
    <OfferHeader />
    <OfferTable />
  </div>
</template>