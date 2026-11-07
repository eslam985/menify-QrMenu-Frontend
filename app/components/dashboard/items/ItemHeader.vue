<!-- app/components/dashboard/items/ItemHeader.vue -->
<script setup lang="ts">
import { useItemModal } from '~/composables/useItemModal'
import { useItemSearch } from '~/composables/useItemSearch'
import { useItemReorderModal } from '~/composables/useItemReorderModal'

const { openModal: openReorderModal } = useItemReorderModal()
const { openModal: openItemModal } = useItemModal()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()
const { searchQuery, selectedCategoryFilter, setSearchQuery, setCategoryFilter } = useItemSearch()
const notiStore = useNotificationStore()

const handleRefresh = async () => {
  try {
    await itemStore.fetchItems()
    notiStore.show('تم تحديث الأصناف بنجاح', 'success')
  } catch (err: any) {
    notiStore.show('فشل تحديث الأصناف', 'error')
  }
}
</script>

<template>
  <div class="w-full 2xl:max-w-[90%] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
    <div class="w-full lg:max-w-[30%]">
      <h1 class="text-2xl font-bold text-primary">إدارة أصناف المنيو</h1>
      <p class="text-xs text-text/60 mt-1">تحكم في الوجبات والأطباق، الأسعار، وحالة التوفر للعملاء</p>
    </div>

    <!-- أدوات البحث، الفلتر، والتحكم -->
    <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
      <!-- خانة البحث -->
      <div class="relative w-full sm:w-60">
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text/40 text-xs">🔍</span>
        <input :value="searchQuery" @input="setSearchQuery(($event.target as HTMLInputElement).value)" type="text"
          placeholder="بحث في الأصناف..."
          class="w-full pl-8 pr-9 py-2.5 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary transition shadow-xs" />
        <button v-if="searchQuery" @click="setSearchQuery('')"
          class="absolute inset-y-0 left-0 flex items-center pl-3 text-text/40 hover:text-text text-xs cursor-pointer">✕</button>
      </div>

      <!-- فلتر التصنيفات -->
      <select :value="selectedCategoryFilter" @change="setCategoryFilter(($event.target as HTMLSelectElement).value)"
        class="p-2.5 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary shadow-xs cursor-pointer">
        <option value="">جميع التصنيفات</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <!-- زر التحديث -->
      <button @click="handleRefresh" :disabled="itemStore.isLoading"
        class="p-2.5 rounded-xl bg-card border border-primary/10 text-text hover:text-primary transition cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50"
        title="تحديث البيانات">
        <Icon name="lucide:refresh-cw" class="w-4 h-4 text-primary" :class="{ 'animate-spin': itemStore.isLoading }" />
      </button>

      <!-- زر الإضافة -->
        <button @click="openItemModal()" class="btn-primary flex justify-between gap-1">
          <span>إضافة صنف جديد</span>
          <Icon name="lucide:plus" class="w-4 h-4 self-center" />
        </button>

      <div>
        <!-- زر فتح مودال الترتيب -->
        <button type="button" @click="openReorderModal" class="btn-primary text-text">
          <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
          ترتيب الأصناف
        </button>

        <!-- ضع المودال في أي مكان في الصفحة أو レイアウト وسيشتغل بالـ Composable تلقائياً -->
        <DashboardItemsItemReorderModal />
      </div>
    </div>
  </div>
</template>