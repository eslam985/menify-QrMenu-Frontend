<!-- app/components/dashboard/categories/CategoryTable.vue -->
<script setup lang="ts">
import { useCategorySearch } from '~/composables/useCategorySearch'
import { useCategoryStore } from '~/stores/category'
import { useTable } from '~/composables/useTable'
import { useAuthStore } from '~/stores/auth'

const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const { searchQuery } = useCategorySearch()
const { openModal } = useCategoryModal()
const { setTableConfig } = useTable()

const filteredCategories = computed(() => {

  if (!searchQuery.value) return categoryStore.categories

  const query = searchQuery.value.toLowerCase().trim()

  return categoryStore.categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(query) ||
      cat.section.toLowerCase().includes(query)
  )
})

// تحديث إعدادات الجدول في الـ Composable عند تغير البيانات
const tableColumns = [
  { key: 'name', label: 'اسم التصنيف' },
  { key: 'section', label: 'القسم (Section)' },
  { key: 'items_count', label: 'عدد الأصناف' },
  { key: 'display_order', label: 'الترتيب' },
  { key: 'updated_at', label: 'آخر تحديث' },
  { key: 'created_at', label: 'تاريخ الانشاء' },
  { key: 'actions', label: 'الإجراءات' },
]

watchEffect(() => {
  setTableConfig(tableColumns, filteredCategories.value, categoryStore.isLoading)
})

const handleDelete = async (categoryId: string) => {
  if (!categoryId) return
  await categoryStore.removeCategory(categoryId)
}


</script>

<template>
  <UiBaseTable>
    <template #cell-updated_at="{ row }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{ formatDate(row.updated_at) }}</span>
    </template>
    <template #cell-created_at="{ row }">
      <span class="text-fluid-xs text-text/60 md:hover:text-primary">{{ formatDate(row.created_at) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <button type="button" @click="openModal(row)"
          class="px-3 py-1.5 rounded-xl border bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary font-medium text-xs transition-all active:scale-95 cursor-pointer">
          تعديل
        </button>

        <button v-if="authStore.isAdmin" type="button" @click="handleDelete(row.id)" :disabled="categoryStore.isLoading"
          class="px-3 py-1.5 rounded-xl border bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-500 font-medium text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>