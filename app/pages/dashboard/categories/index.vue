<!-- app/pages/dashboard/categories/index.vue -->
<script setup lang="ts">
import { useCategoryStore } from '~/stores/category'
import CategoryHeader from '~/components/dashboard/categories/CategoryHeader.vue'
import CategoryTable from '~/components/dashboard/categories/CategoryTable.vue'
import CategoryModal from '~/components/dashboard/categories/CategoryModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.fetchCategories()
})
</script>

<template>
  <div>
    <!-- هيدر التصنيفات المنفصل (يحتوي على البحث، زر التحديث، وزر الإضافة) -->
    <CategoryHeader />

    <!-- جدول عرض التصنيفات (مع دعم التصفية المباشرة) -->
    <CategoryTable />

    <!-- مودال إضافة تصنيف -->
    <CategoryModal />
  </div>
</template>