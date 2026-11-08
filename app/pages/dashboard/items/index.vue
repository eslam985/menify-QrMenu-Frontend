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

const loadItemsData = async () => {
  const categoryPromise =
    categoryStore.categoriesCount < 1 ? categoryStore.fetchCategories() : Promise.resolve()

  await Promise.all([categoryPromise, itemStore.fetchItems()])
}

onMounted(async () => {
  if (itemStore.items?.length < 1) {
    loadItemsData()
  }
})
</script>

<template>
  <div>
    <ItemHeader />
    <ItemTable />
    <ItemModal />
  </div>
</template>