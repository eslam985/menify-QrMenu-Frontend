<!-- app/components/dashboard/items/ItemHeader.vue -->
<script setup lang="ts">
import { useItemModal } from "~/composables/useItemModal";
import { useItemSearch } from "~/composables/useItemSearch";
import { useItemReorderModal } from "~/composables/useItemReorderModal";

const { openModal: openReorderModal } = useItemReorderModal();
const { openModal: openItemModal } = useItemModal();
const itemStore = useItemStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const {
  searchQuery,
  selectedCategoryFilter,
  setSearchQuery,
  setCategoryFilter,
} = useItemSearch();
const notiStore = useNotificationStore();

const handleRefresh = async () => {
  try {
    await itemStore.fetchItems();
    notiStore.show("تم تحديث الأصناف بنجاح", "success");
  } catch (err: unknown) {
    notiStore.show("فشل تحديث الأصناف", "error");
  }
};
</script>

<template>
  <div
    class="mx-auto mb-8 flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <div class="w-full lg:max-w-[30%]">
      <h1 class="text-primary text-2xl font-bold">إدارة أصناف المنيو</h1>
      <p class="text-text/60 mt-1 text-xs">
        تحكم في الوجبات والأطباق، الأسعار، وحالة التوفر للعملاء
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
          placeholder="بحث في الأصناف..."
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

      <!-- فلتر التصنيفات -->
      <select
        :value="selectedCategoryFilter"
        @change="setCategoryFilter(($event.target as HTMLSelectElement).value)"
        class="bg-card border-primary/10 text-text focus:border-primary cursor-pointer rounded-xl border p-2.5 text-xs shadow-xs focus:outline-none"
      >
        <option value="">جميع التصنيفات</option>
        <option
          v-for="cat in categoryStore.categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>

      <!-- زر التحديث -->
      <button
        @click="handleRefresh"
        :disabled="itemStore.isLoading"
        class="bg-card border-primary/10 text-text hover:text-primary flex cursor-pointer items-center justify-center rounded-xl border p-2.5 shadow-xs transition disabled:opacity-50"
        title="تحديث البيانات"
      >
        <Icon
          name="lucide:refresh-cw"
          class="text-primary h-4 w-4"
          :class="{ 'animate-spin': itemStore.isLoading }"
        />
      </button>

      <!-- زر الإضافة -->
      <button
        v-if="authStore?.isEditorAndAbove"
        @click="openItemModal()"
        class="btn-primary flex justify-between gap-1"
      >
        <span>إضافة صنف جديد</span>
        <Icon name="lucide:plus" class="h-4 w-4 self-center" />
      </button>

      <div v-if="authStore?.isEditorAndAbove">
        <!-- زر فتح مودال الترتيب -->
        <button
          type="button"
          @click="openReorderModal"
          class="btn-primary text-text"
        >
          <Icon name="lucide:arrow-up-down" class="h-4 w-4" />
          ترتيب الأصناف
        </button>

        <!-- ضع المودال في أي مكان في الصفحة أو レイアウト وسيشتغل بالـ Composable تلقائياً -->
        <DashboardItemsItemReorderModal />
      </div>
    </div>
  </div>
</template>
