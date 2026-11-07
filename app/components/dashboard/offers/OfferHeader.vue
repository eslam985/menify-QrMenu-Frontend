<!-- app/components/dashboard/offers/OfferHeader.vue -->
<script setup lang="ts">
import { useOfferModal } from '~/composables/useOfferModal'
import { useOfferStore } from '~/stores/offer'
import { useOfferSearch } from '~/composables/useOfferSearch'
import { useNotificationStore } from '~/stores/notification'

const { openModal } = useOfferModal()
const offerStore = useOfferStore()
const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } = useOfferSearch()
const notiStore = useNotificationStore()
// في OfferHeader.vue
const handleAddNew = () => {
  navigateTo('/dashboard/offers/new')
}
const handleRefresh = async () => {
  try {
    await offerStore.fetchOffers()
    notiStore.show('تم تحديث العروض بنجاح', 'success')
  } catch (err: any) {
    notiStore.show('فشل تحديث العروض', 'error')
  }
}
</script>

<template>
  <div class="w-full 2xl:max-w-[90%] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
    <div class="w-full lg:max-w-[40%]">
      <h1 class="text-2xl font-bold text-primary">إدارة العروض والخصومات</h1>
      <p class="text-xs text-text/60 mt-1">تحكم في العروض الخاصة، الفترات الزمنية، وحالة التفعيل للعملاء</p>
    </div>

    <!-- أدوات البحث، الفلتر، والتحكم -->
    <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
      <!-- خانة البحث -->
      <div class="relative w-full sm:w-60">
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text/40 text-xs">🔍</span>
        <input
          :value="searchQuery"
          @input="setSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="بحث في العروض..."
          class="w-full pl-8 pr-9 py-2.5 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary transition shadow-xs"
        />
        <button v-if="searchQuery" @click="setSearchQuery('')" class="absolute inset-y-0 left-0 flex items-center pl-3 text-text/40 hover:text-text text-xs cursor-pointer">✕</button>
      </div>

      <!-- فلتر الحالة -->
      <select
        :value="statusFilter"
        @change="setStatusFilter(($event.target as HTMLSelectElement).value)"
        class="p-2.5 rounded-xl bg-card border border-primary/10 text-text text-xs focus:outline-none focus:border-primary shadow-xs"
      >
        <option value="">جميع الحالات</option>
        <option value="active">نشط</option>
        <option value="paused">متوقف</option>
      </select>

      <!-- زر التحديث -->
      <button
        @click="handleRefresh"
        :disabled="offerStore.isLoading"
        class="p-2.5 rounded-xl bg-card border border-primary/10 text-text hover:text-primary transition cursor-pointer flex items-center justify-center shadow-xs disabled:opacity-50"
        title="تحديث البيانات"
      >
        <Icon name="lucide:refresh-cw" class="w-4 h-4 text-primary" :class="{ 'animate-spin': offerStore.isLoading }" />
      </button>

      <!-- زر الإضافة -->
<button
  @click="navigateTo('/dashboard/offers/new')"
  class="btn-primary"
>
  <Icon name="lucide:plus" class="w-4 h-4" />
  <span>إضافة عرض جديد</span>
</button>
    </div>
  </div>
</template>