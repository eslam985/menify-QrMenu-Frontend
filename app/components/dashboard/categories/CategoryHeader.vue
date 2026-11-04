<!-- app/components/dashboard/categories/CategoryHeader.vue -->
<script setup lang="ts">
import { useCategoryModal } from '~/composables/useCategoryModal'
import { useCategoryStore } from '~/stores/category'
import { useNotificationStore } from '~/stores/notification'
import BaseSearchInput from '~/components/common/BaseSearchInput.vue'

const { openModal } = useCategoryModal()
const categoryStore = useCategoryStore()
const notiStore = useNotificationStore()

const handleRefresh = async () => {
  try {
    await categoryStore.fetchCategories()
    notiStore.show('تم تحديث البيانات بنجاح', 'success')
  } catch (err: any) {
    notiStore.show('فشل تحديث البيانات', 'error')
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
    <div class="w-full md:max-w-[40%]">
      <h1 class="text-2xl font-bold text-primary">إدارة التصنيفات</h1>
      <p class="text-xs text-text/60 mt-1">تحكم في أقسام المنيو وترتيبها وعرض جميع التفاصيل للعملاء</p>
    </div>

    <!-- أداة البحث وأزرار التحكم -->
    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <BaseSearchInput />

      <button
        @click="handleRefresh"
        :disabled="categoryStore.isLoading"
        class="p-section-fluid py-2.5 rounded-xl bg-card border border-primary/10 text-text hover:text-primary transition cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50 md:hover:bg-primary/5"
        title="تحديث البيانات"
      >
        <Icon name="lucide:refresh-cw" class="w-5 h-5 text-primary" :class="{ 'animate-spin': categoryStore.isLoading }" />
      </button>

      <button
        @click="openModal"
        class="px-fluid py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:opacity-80 transition cursor-pointer shadow-soft flex items-center gap-2"
      >
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>إضافة تصنيف جديد</span>
      </button>
    </div>
  </div>
</template>