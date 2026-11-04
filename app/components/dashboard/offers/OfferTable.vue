<!-- app/components/dashboard/offers/OfferTable.vue -->
<script setup lang="ts">
import { useOfferStore } from '~/stores/offer'
import { useOfferSearch } from '~/composables/useOfferSearch'
import { useOfferModal } from '~/composables/useOfferModal'
import { useTable } from '~/composables/useTable'
import { useAuthStore } from '~/stores/auth'

const offerStore = useOfferStore()
const { searchQuery, statusFilter } = useOfferSearch()
const { openModal } = useOfferModal()
const { setTableConfig } = useTable()
const authStore = useAuthStore()

// تصفية العروض بناءً على البحث والحالة
const filteredOffers = computed(() => {
  let result = offerStore.offers

  if (statusFilter.value === 'active') {
    result = result.filter((o) => o.is_active)
  } else if (statusFilter.value === 'paused') {
    result = result.filter((o) => !o.is_active)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        (o.description && o.description.toLowerCase().includes(query))
    )
  }

  return result
})

const tableColumns = [
  { key: 'image_url', label: 'الصورة' },
  { key: 'title', label: 'عنوان العرض' },
  { key: 'offer_price', label: 'سعر العرض' },
  { key: 'original_total', label: 'السعر الأصلي' },
  { key: 'savings', label: 'قيمة التوفير' },
  { key: 'items', label: 'بنود العرض' },
  { key: 'all_items_available', label: 'توفر الأصناف' },
  { key: 'status', label: 'الحالة (Status)' },
  { key: 'is_active', label: 'التفعيل' },
  { key: 'starts_at', label: 'يبدأ في' },
  { key: 'ends_at', label: 'ينتهي في' },
  { key: 'created_at', label: 'تاريخ الإنشاء' },
  { key: 'actions', label: 'الإجراءات' },
]

watchEffect(() => {
  setTableConfig(tableColumns, filteredOffers.value, offerStore.isLoading)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('ar-EG')
}
</script>

<template>
  <UiBaseTable>
    <!-- تخصيص عمود الصورة -->
    <template #cell-image_url="{ row }">
      <div class="flex items-center justify-center">
        <img 
          v-if="row.image_url" 
          :src="row.image_url" 
          alt="صورة العرض" 
          class="w-10 h-10 rounded-xl object-cover border border-primary/10 shadow-xs" 
        />
        <div v-else class="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-text/40">
          <Icon name="lucide:tag" class="w-5 h-5" />
        </div>
      </div>
    </template>

    <!-- تخصيص عمود عنوان العرض (مع الوصف لو موجود) -->
    <template #cell-title="{ row }">
      <div>
        <p class="font-bold text-text text-xs">{{ row.title }}</p>
        <p v-if="row.description" class="text-[10px] text-text/60 truncate max-w-[150px]" :title="row.description">
          {{ row.description }}
        </p>
      </div>
    </template>

    <!-- تخصيص عمود سعر العرض -->
    <template #cell-offer_price="{ row }">
      <span class="font-bold text-primary">
        {{ row.offer_price !== null && row.offer_price !== undefined ? `${row.offer_price} ج.م` : 'مجاني / حسب الطلب' }}
      </span>
    </template>

    <!-- تخصيص عمود السعر الأصلي -->
    <template #cell-original_total="{ row }">
      <span class="text-text/70 font-medium">
        {{ row.original_total !== null && row.original_total !== undefined ? `${row.original_total} ج.م` : '—' }}
      </span>
    </template>

    <!-- تخصيص عمود قيمة التوفير -->
    <template #cell-savings="{ row }">
      <span v-if="row.savings !== null && row.savings !== undefined && row.savings > 0" class="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 font-bold text-xs">
        وفّر {{ row.savings }} ج.م
      </span>
      <span v-else class="text-text/40 text-xs">—</span>
    </template>

    <!-- تخصيص عمود الـ Status -->
    <template #cell-status="{ row }">
      <span class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
        {{ row.status || 'active' }}
      </span>
    </template>

    <!-- تخصيص عمود بنود العرض (items) -->
    <template #cell-items="{ row }">
      <div class="flex flex-col gap-1 max-w-[180px]">
        <span class="text-xs font-bold text-text">
          {{ row.items?.length || 0 }} بند(ود)
        </span>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="(item, idx) in row.items" 
            :key="idx" 
            class="px-1.5 py-0.5 rounded bg-bg border border-primary/10 text-[9px] text-text/80 truncate max-w-[160px]"
            :title="item.title || item.custom_label"
          >
            {{ item.title || item.custom_label }} (×{{ item.quantity }})
          </span>
        </div>
      </div>
    </template>

    <!-- تخصيص عمود توفر الأصناف (all_items_available) -->
    <template #cell-all_items_available="{ row }">
      <span
        :class="[
          'px-2.5 py-1 rounded-full text-[10px] font-bold',
          row.all_items_available ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
        ]"
      >
        {{ row.all_items_available ? 'متوفر' : 'بعض الأصناف غير متوفرة' }}
      </span>
    </template>

    <!-- تخصيص عمود الحالة (is_active) -->
    <template #cell-is_active="{ row }">
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-bold',
          row.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        ]"
      >
        {{ row.is_active ? 'نشط' : 'متوقف' }}
      </span>
    </template>

    <!-- تنسيق تواريخ البداية والنهاية -->
    <template #cell-starts_at="{ row }">
      <span class="text-xs text-text/60">{{ formatDate(row.starts_at) }}</span>
    </template>
    <template #cell-ends_at="{ row }">
      <span class="text-xs text-text/60">{{ formatDate(row.ends_at) }}</span>
    </template>

    <!-- تخصيص عمود تاريخ الإنشاء -->
    <template #cell-created_at="{ row }">
      <span class="text-xs text-text/60">{{ formatDate(row.created_at) }}</span>
    </template>

    <!-- أزرار الإجراءات -->
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-2">
        <button
          type="button"
          @click="navigateTo(`/dashboard/offers/${row.id}`)"
          class="px-3 py-1.5 rounded-xl border bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary font-medium text-xs transition-all active:scale-95 cursor-pointer"
        >
          تعديل
        </button>
        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="offerStore.removeOffer(row.id)"
          :disabled="offerStore.isLoading"
          class="px-3 py-1.5 rounded-xl border bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-500 font-medium text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>