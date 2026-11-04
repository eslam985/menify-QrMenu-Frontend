<!-- app/pages/dashboard/items/index.vue -->
<script setup lang="ts">
import { useItemStore } from '~/stores/item'
import { useCategoryStore } from '~/stores/category'
import ItemHeader from '~/components/dashboard/items/ItemHeader.vue'
import ItemTable from '~/components/dashboard/items/ItemTable.vue'
import ItemModal from '~/components/dashboard/items/ItemModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const itemStore = useItemStore()
const categoryStore = useCategoryStore()

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    itemStore.fetchItems()
  ])
})
</script>

<template>
  <div>
    <ItemHeader />
    <ItemTable />
    <ItemModal />
  </div>
</template>