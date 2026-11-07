<!-- app/components/dashboard/categories/CategoryHeader.vue -->
<script setup lang="ts">
import { useCategoryModal } from '~/composables/useCategoryModal'

const { openModal } = useCategoryModal()
const categoryStore = useCategoryStore()
const notiStore = useNotificationStore()

const handleRefresh = async () => {
  const isSuccess = await categoryStore.fetchCategories()
  
  if (isSuccess) {
    notiStore.show('تم تحديث البيانات بنجاح', 'success')
  }
}
</script>

<template>
  <div class="w-full 2xl:max-w-[90%] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
    <div class="w-full md:max-w-[40%]">
      <h1 class="text-2xl font-bold text-primary">إدارة التصنيفات</h1>
      <p class="text-xs text-text/60 mt-1">تحكم في أقسام المنيو وترتيبها وعرض جميع التفاصيل للعملاء</p>
    </div>

    <!-- أداة البحث وأزرار التحكم -->
    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <CommonBaseSearchInput />

      <button @click="handleRefresh" :disabled="categoryStore.isLoading"
        class="p-section-fluid py-2.5 rounded-xl bg-card border border-primary/10 text-text hover:text-primary transition cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50 md:hover:bg-primary/5"
        title="تحديث البيانات">
        <Icon name="lucide:refresh-cw" class="w-5 h-5 text-primary"
          :class="{ 'animate-spin': categoryStore.isLoading }" />
      </button>

      <button @click="openModal" class="btn-primary flex gap-1 justify-between">
        <span>إضافة تصنيف جديد</span>
        <Icon name="lucide:plus" class="w-4 h-4 self-center" />
      </button>

    </div>
  </div>
</template>