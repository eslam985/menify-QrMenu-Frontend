<!-- app/components/dashboard/items/ItemHeader.vue -->
<script setup lang="ts">
import { useItemState } from "@/composables/item/useItemState";

const {
  selectedCategoryFilter,
  categoryStore,
  searchQuery,
  authStore,
  itemStore,
  openModalItemReorderModal,
  setCategoryFilter,
  setSearchQuery,
  openItemModal,
  handleRefresh,
} = useItemState();
</script>

<template>
  <div
    class="mb-section-fluid gap-fluid mx-auto flex w-full flex-col flex-wrap items-start justify-between lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <h1 class="text-primary text-fluid-h3 font-bold">إدارة أصناف المنيو</h1>

    <div class="gap-fluid flex w-full flex-wrap items-center lg:w-auto">
      <div class="relative w-full sm:w-60">
        <span
          class="text-primary text-fluid-sm pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5"
        >
          <Icon name="lucide:search"></Icon>
        </span>

        <input
          :value="searchQuery"
          @input="setSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="بحث في الأصناف..."
          class="bg-card border-primary/10 text-text focus:border-primary text-fluid-xs w-full rounded-xl border py-2.5 pr-9 pl-8 shadow-xs transition focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="setSearchQuery('')"
          class="text-text/40 hover:text-text text-fluid-xs absolute inset-y-0 left-0 flex cursor-pointer items-center pl-3"
        >
          ✕
        </button>
      </div>

      <select
        :value="selectedCategoryFilter"
        @change="setCategoryFilter(($event.target as HTMLSelectElement).value)"
        class="bg-card border-primary/10 text-text focus:border-primary text-fluid-xs cursor-pointer rounded-xl border p-2.5 shadow-xs focus:outline-none"
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

      <button
        v-if="authStore?.isEditorAndAbove"
        @click="
          openItemModal();
          itemStore.error = '';
        "
        class="btn-primary flex justify-between gap-1"
      >
        <span>إضافة صنف جديد</span>
        <Icon name="lucide:plus" class="h-4 w-4 self-center" />
      </button>

      <div v-if="authStore?.isEditorAndAbove">
        <button
          type="button"
          @click="openModalItemReorderModal"
          class="btn-primary text-text"
        >
          <Icon name="lucide:arrow-up-down" class="h-4 w-4" />
          ترتيب الأصناف
        </button>

        <DashboardItemsItemReorderModal />
      </div>
    </div>
  </div>
</template>
