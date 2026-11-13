<!-- app/components/dashboard/categories/CategoryHeader.vue -->
<script setup lang="ts">
import { useCategoryModal } from "~/composables/category/useCategoryModal";
import { useCategoryState } from "@/composables/category/useCategoryState";
const { authStore, categoryStore, handleRefresh } = useCategoryState();

const { openModal } = useCategoryModal();
</script>

<template>
  <div
    class="mb-section-fluid gap-fluid mx-auto flex w-full flex-col items-start justify-between lg:flex-row lg:items-center 2xl:max-w-[90%]"
  >
    <div class="w-full md:max-w-[40%]">
      <h1 class="text-primary text-fluid-p font-bold">إدارة التصنيفات</h1>
      <p class="text-text/60 text-fluid-xs mt-1">
        تحكم في أقسام المنيو وترتيبها وعرض جميع التفاصيل للعملاء
      </p>
    </div>

    <div class="gap-fluid flex w-full flex-wrap items-center md:w-auto">
      <CommonBaseSearchInput />

      <button
        @click="handleRefresh"
        :disabled="categoryStore.isLoading"
        class="p-section-fluid bg-card border-primary/10 text-text hover:text-primary md:hover:bg-primary/5 flex cursor-pointer items-center justify-center rounded-xl border py-2.5 shadow-xs transition disabled:opacity-50"
        title="تحديث البيانات"
      >
        <Icon
          name="lucide:refresh-cw"
          class="text-primary h-5 w-5"
          :class="{ 'animate-spin': categoryStore.isLoading }"
        />
      </button>

      <button
        v-if="authStore?.isEditorAndAbove"
        @click="openModal"
        class="btn-primary flex justify-between gap-1"
      >
        <span>إضافة تصنيف جديد</span>
        <Icon name="lucide:plus" class="h-4 w-4 self-center" />
      </button>
    </div>
  </div>
</template>
