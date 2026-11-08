<!-- app/components/dashboard/items/ItemTable.vue -->
<script setup lang="ts">
import { useItemSearch } from '~/composables/useItemSearch'
import { useItemModal } from '~/composables/useItemModal'
import { useTable } from '~/composables/useTable'

const { searchQuery, selectedCategoryFilter } = useItemSearch()
const { setTableConfig } = useTable()
const { openModal } = useItemModal()

const publicMenuStore = usePublicMenuStore()
const categoryStore = useCategoryStore()
const itemStore = useItemStore()
const authStore = useAuthStore()

// دالة لجلب اسم التصنيف بناءً على الـ category_id
const getCategoryName = (categoryId: string) => {
  const cat = categoryStore.categories.find((c) => c.id === categoryId)
  return cat ? cat.name : '—'
}

// تصفية الأصناف بناءً على البحث والفلتر
const filteredItems = computed(() => {
  let result = itemStore.items

  if (selectedCategoryFilter.value) {
    result = result.filter((item) => item.category_id === selectedCategoryFilter.value)
  }

  if (searchQuery.value) {
    
    const query = searchQuery.value.toLowerCase().trim()

    result = result.filter((item) => {
      const category = categoryStore.categories.find((c) => c.id === item.category_id)

      const titleMatch = item.title.toLowerCase().includes(query)
      const descMatch = item.description ? item.description.toLowerCase().includes(query) : false
      const categoryNameMatch = category ? category.name.toLowerCase().includes(query) : false
      const categorySectionMatch = category ? category.section.toLowerCase().includes(query) : false

      return titleMatch || descMatch || categoryNameMatch || categorySectionMatch
    })
  }

  return result
})

const tableColumns = [
  { key: 'image_url', label: 'الصورة' },
  { key: 'title', label: 'اسم الصنف' },
  { key: 'category', label: 'التصنيف' },
  { key: 'description', label: 'الوصف' },
  { key: 'price', label: 'السعر' },
  { key: 'is_available', label: 'حالة التوفر' },
  { key: 'display_order', label: 'الترتيب' },
  { key: 'created_at', label: 'تاريخ الإضافة' }, 
  { key: 'updated_at', label: 'آخر تحديث' },
  { key: 'actions', label: 'الإجراءات' },
]

watchEffect(() => {
  setTableConfig(tableColumns, filteredItems.value, itemStore.isLoading)
})

</script>

<template>
  <UiBaseTable>
    <!-- تخصيص عمود الصورة -->
    <!-- تخصيص عمود الصورة -->
    <template #cell-image_url="{ row }">
      <div class="flex items-center justify-center">
        <img v-if="row.image_url" :src="row.image_url" alt="صورة الصنف"
          class="w-10 h-10 rounded-xl object-cover border border-primary/10 shadow-xs" />
        <div v-else
          class="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-text/40">
          <Icon name="lucide:image" class="w-5 h-5" />
        </div>
      </div>
    </template>
    <!-- تخصيص عمود تاريخ الإضافة -->
    <template #cell-created_at="{ row }">
      <span class="text-xs text-text/60">{{ formatDate(row.created_at) }}</span>
    </template>
    <!-- تخصيص عمود التصنيف -->
    <template #cell-category="{ row }">
      <span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
        {{ getCategoryName(row.category_id) }}
      </span>
    </template>

    <!-- تخصيص عمود السعر -->
    <template #cell-price="{ row }">
      <span class="font-bold text-primary">
        {{ row.price + (publicMenuStore.restaurant?.currency ?? 'ج.م') }}
      </span>
    </template>

    <!-- تخصيص عمود التوفر (مع زر التبديل السريع) -->
    <template #cell-is_available="{ row }">
      <button @click="itemStore.toggleAvailability(row.id, row.is_available)" :class="[
        'px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer',
        row.is_available ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      ]">
        {{ row.is_available ? 'متوفر' : 'غير متوفر' }}
      </button>
    </template>

    <!-- تنسيق التاريخ -->
    <template #cell-updated_at="{ row }">
      <span class="text-xs text-text/60">{{ formatDate(row.updated_at) }}</span>
    </template>

    <!-- أزرار الإجراءات (تعديل وحذف) -->
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-2">
        <button type="button" @click="openModal(row)"
          class="px-3 py-1.5 rounded-xl border bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary font-medium text-xs transition-all active:scale-95 cursor-pointer">
          تعديل
        </button>
        <button v-if="authStore.isAdmin" type="button" @click="itemStore.removeItem(row.id)"
          :disabled="itemStore.isLoading"
          class="px-3 py-1.5 rounded-xl border bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-500 font-medium text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>