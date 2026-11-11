<!-- app/components/dashboard/offers/OfferTable.vue -->
<script setup lang="ts">
import { useOfferSearch } from "~/composables/useOfferSearch";
import { useTable } from "~/composables/useTable";
import type { OfferResponse } from "~/types/dataType/offerType";

const offerStore = useOfferStore();
const { searchQuery, statusFilter } = useOfferSearch();
const { setTableConfig } = useTable();
const authStore = useAuthStore();

const filteredOffers = computed(() => {
  let result = offerStore.offers;

  if (statusFilter.value === "active") {
    result = result.filter((o) => o.is_active);
  } else if (statusFilter.value === "paused") {
    result = result.filter((o) => !o.is_active);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        (o.description && o.description.toLowerCase().includes(query)),
    );
  }

  return result;
});

const tableColumns = [
  { key: "image_url", label: "الصورة" },
  { key: "title", label: "عنوان العرض" },
  { key: "offer_price", label: "سعر العرض" },
  { key: "original_total", label: "السعر الأصلي" },
  { key: "savings", label: "قيمة التوفير" },
  { key: "items", label: "بنود العرض" },
  { key: "all_items_available", label: "توفر الأصناف" },
  { key: "status", label: "الحالة (Status)" },
  { key: "is_active", label: "التفعيل" },
  { key: "starts_at", label: "يبدأ في" },
  { key: "ends_at", label: "ينتهي في" },
  { key: "created_at", label: "تاريخ الإنشاء" },
  { key: "actions", label: "الإجراءات" },
];

watchEffect(() => {
  setTableConfig(tableColumns, filteredOffers.value, offerStore.isLoading);
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("ar-EG");
};
</script>

<template>
  <UiBaseTable>
    <template #cell-image_url="{ row }">
      <div class="flex items-center justify-center">
        <img
          v-if="row.image_url"
          :src="String(row.image_url ?? '')"
          alt="صورة العرض"
          class="border-primary/10 h-10 w-10 rounded-xl border object-cover shadow-xs"
        />
        <div
          v-else
          class="bg-primary/5 border-primary/10 text-text/40 flex h-10 w-10 items-center justify-center rounded-xl border"
        >
          <Icon name="lucide:tag" class="h-5 w-5" />
        </div>
      </div>
    </template>

    <template #cell-title="{ row }">
      <div>
        <p class="text-text text-fluid-xs font-bold">{{ row.title }}</p>
        <p
          v-if="row.description"
          class="text-text/60 max-w-[150px] truncate text-[10px]"
          :title="String(row.description ?? '')"
        >
          {{ row.description }}
        </p>
      </div>
    </template>

    <template #cell-offer_price="{ row }">
      <span class="text-primary font-bold">
        {{
          row.offer_price !== null && row.offer_price !== undefined
            ? `${row.offer_price} ج.م`
            : "مجاني / حسب الطلب"
        }}
      </span>
    </template>

    <template #cell-original_total="{ row }">
      <span class="text-text/70 font-medium">
        {{
          row.original_total !== null && row.original_total !== undefined
            ? `${row.original_total} ج.م`
            : "—"
        }}
      </span>
    </template>

    <template #cell-savings="{ row }">
      <span
        v-if="
          row.savings !== null &&
          row.savings !== undefined &&
          Number(row.savings) > 0
        "
        class="text-fluid-xs rounded-md bg-green-500/10 px-2 py-0.5 font-bold text-green-500"
      >
        وفّر {{ row.savings }} ج.م
      </span>
      <span v-else class="text-text/40 text-fluid-xs">—</span>
    </template>

    <template #cell-status="{ row }">
      <span
        class="bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-[10px] font-bold"
      >
        {{ row.status || "active" }}
      </span>
    </template>

    <template #cell-items="{ row }">
      <div class="flex max-w-[180px] flex-col gap-1">
        <span class="text-text text-fluid-xs font-bold">
          {{ Array.isArray(row.items) ? row.items.length : 0 }} بند(ود)
        </span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(item, idx) in row.items as {
              title?: string;
              custom_label?: string;
              quantity?: number;
            }[]"
            :key="idx"
            class="bg-bg border-primary/10 text-text/80 max-w-[160px] truncate rounded border px-1.5 py-0.5 text-[9px]"
            :title="item.title || item.custom_label"
          >
            {{ item.title || item.custom_label }} (×{{ item.quantity }})
          </span>
        </div>
      </div>
    </template>

    <template #cell-all_items_available="{ row }">
      <span
        :class="[
          'rounded-full px-2.5 py-1 text-[10px] font-bold',
          row.all_items_available
            ? 'bg-green-500/10 text-green-500'
            : 'bg-amber-500/10 text-amber-500',
        ]"
      >
        {{ row.all_items_available ? "متوفر" : "بعض الأصناف غير متوفرة" }}
      </span>
    </template>

    <template #cell-is_active="{ row }">
      <span
        :class="[
          'px-fluid text-fluid-xs rounded-full py-1 font-bold',
          row.is_active
            ? 'bg-green-500/10 text-green-500'
            : 'bg-danger/10 text-danger',
        ]"
      >
        {{ row.is_active ? "نشط" : "متوقف" }}
      </span>
    </template>

    <template #cell-starts_at="{ row }">
      <span class="text-text/60 text-fluid-xs">{{
        formatDate(row.starts_at as OfferResponse["starts_at"])
      }}</span>
    </template>
    <template #cell-ends_at="{ row }">
      <span class="text-text/60 text-fluid-xs">{{
        formatDate(row.ends_at as OfferResponse["ends_at"])
      }}</span>
    </template>

    <template #cell-created_at="{ row }">
      <span class="text-text/60 text-fluid-xs">{{
        formatDate(row.created_at as OfferResponse["created_at"])
      }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-2">
        <button
          type="button"
          @click="navigateTo(`/dashboard/offers/${row.id}`)"
          class="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary px-fluid text-fluid-xs cursor-pointer rounded-xl border py-1.5 font-medium active:scale-95"
        >
          تعديل
        </button>
        <button
          v-if="authStore.isAdmin"
          type="button"
          @click="offerStore.removeOffer((row as unknown as OfferResponse).id)"
          :disabled="offerStore.isLoading"
          class="bg-danger/5 px-fluid text-fluid-xs text-danger hover:bg-danger/10 cursor-pointer rounded-xl border border-red-500/20 py-1.5 font-medium active:scale-95 disabled:opacity-50"
        >
          حذف
        </button>
      </div>
    </template>
  </UiBaseTable>
</template>
