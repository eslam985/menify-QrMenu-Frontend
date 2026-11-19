<!-- app/components/dashboard/items/ItemHeader.vue -->
<script setup lang="ts">
import { useItemState } from "@/composables/item/useItemState";
import { useItemModal } from "~/composables/item/useItemModal";
import { useItemReorderModal } from "~/composables/item/useItemReorderModal";
const { openItemModal } = useItemModal();
const { openModalItemReorderModal } = useItemReorderModal();
const {
  selectedCategoryFilter,
  categoryStore,
  searchQuery,
  authStore,
  itemStore,
  setCategoryFilter,
  handleRefresh,
  selectedStatus,
  getItemsByStatus,
} = useItemState();

const statusItems = [
  { label: "كل الاصناف", value: "" },
  { label: "الاصناف النشطة", value: "true" },
  { label: "الاصناف الغير نشطة حاليا", value: "false" },
];
</script>

<template>
  <div
    class="mb-section-fluid gap-fluid mx-auto flex w-full flex-col flex-wrap items-start justify-between lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <h1 class="text-primary text-fluid-h3 font-bold">إدارة أصناف المنيو</h1>

    <div class="gap-fluid flex w-full flex-wrap items-center lg:w-auto">
      <CommonBaseSearchInput
        v-model="searchQuery"
        placeholder="بحث في الأصناف..."
        class="sm:w-60"
      />

      <select
        v-model="selectedStatus"
        @change="getItemsByStatus"
        class="select-primary p-fluid"
      >
        <option
          v-for="item in statusItems"
          :key="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>

      <select
        :value="selectedCategoryFilter"
        @change="setCategoryFilter(($event.target as HTMLSelectElement).value)"
        class="select-primary p-fluid"
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
        class="btn-primary p-fluid flex"
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
        @click="openItemModal()"
        class="btn-primary p-fluid flex justify-between gap-1"
      >
        <span>إضافة صنف جديد</span>
        <Icon name="lucide:plus" class="h-4 w-4 self-center" />
      </button>

      <div v-if="authStore?.isEditorAndAbove">
        <button
          type="button"
          @click="openModalItemReorderModal"
          class="btn-primary text-text p-fluid"
        >
          <Icon name="lucide:arrow-up-down" class="h-4 w-4" />
          ترتيب الأصناف
        </button>

        <DashboardItemsItemReorderModal />
      </div>
    </div>
  </div>
</template>
