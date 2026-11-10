<!-- app/components/dashboard/offers/OfferHeader.vue -->
<script setup lang="ts">
import { useOfferSearch } from "~/composables/useOfferSearch";

const offerStore = useOfferStore();
const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } =
  useOfferSearch();
const notiStore = useNotificationStore();
const authStore = useAuthStore();

const handleRefresh = async () => {
  try {
    await offerStore.fetchOffers();
    notiStore.show("تم تحديث العروض بنجاح", "success");
  } catch (err: unknown) {
    notiStore.show("فشل تحديث العروض", "error");
  }
};
</script>

<template>
  <div
    class="mx-auto mb-8 flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <div class="w-full lg:max-w-[40%]">
      <h1 class="text-primary text-2xl font-bold">إدارة العروض والخصومات</h1>
      <p class="text-text/60 mt-1 text-xs">
        تحكم في العروض الخاصة، الفترات الزمنية، وحالة التفعيل للعملاء
      </p>
    </div>

    <!-- أدوات البحث، الفلتر، والتحكم -->
    <div class="flex w-full flex-wrap items-center gap-3 lg:w-auto">
      <!-- خانة البحث -->
      <div class="relative w-full sm:w-60">
        <span
          class="text-text/40 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs"
          >🔍</span
        >
        <input
          :value="searchQuery"
          @input="setSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="بحث في العروض..."
          class="bg-card border-primary/10 text-text focus:border-primary w-full rounded-xl border py-2.5 pr-9 pl-8 text-xs shadow-xs transition focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="setSearchQuery('')"
          class="text-text/40 hover:text-text absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3 text-xs"
        >
          ✕
        </button>
      </div>

      <!-- فلتر الحالة -->
      <select
        :value="statusFilter"
        @change="setStatusFilter(($event.target as HTMLSelectElement).value)"
        class="bg-card border-primary/10 text-text focus:border-primary rounded-xl border p-2.5 text-xs shadow-xs focus:outline-none"
      >
        <option value="">جميع الحالات</option>
        <option value="active">نشط</option>
        <option value="paused">متوقف</option>
      </select>

      <!-- زر التحديث -->
      <button
        @click="handleRefresh"
        :disabled="offerStore.isLoading"
        class="bg-card border-primary/10 text-text hover:text-primary flex cursor-pointer items-center justify-center rounded-xl border p-2.5 shadow-xs transition disabled:opacity-50"
        title="تحديث البيانات"
      >
        <Icon
          name="lucide:refresh-cw"
          class="text-primary h-4 w-4"
          :class="{ 'animate-spin': offerStore.isLoading }"
        />
      </button>

      <!-- زر الإضافة -->
      <button
        v-if="authStore?.isEditorAndAbove"
        @click="navigateTo('/dashboard/offers/new')"
        class="btn-primary"
      >
        <Icon name="lucide:plus" class="h-4 w-4" />
        <span>إضافة عرض جديد</span>
      </button>
    </div>
  </div>
</template>
