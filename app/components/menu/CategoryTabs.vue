<script setup lang="ts">
import { usePublicMenuStore } from '~/stores/publicMenu'

const publicMenuStore = usePublicMenuStore()
const activeCategory = ref<string | number | null>(null)

const scrollToCategory = (categoryId: string | number) => {
  activeCategory.value = categoryId
  const element = document.getElementById(`category-${categoryId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div dir="rtl" v-if="publicMenuStore.categories.length" class="my-fluid">
    <!-- عنوان الأقسام العام الشامل -->
    <div class="flex items-center justify-between mb-fluid">
      <h2 class="text-fluid-h3 font-black text-primary flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <Icon name="lucide:layout-grid" class="w-6 h-6" />
        </div>
        <span>قائمة الأقسام والمنتجات</span>
      </h2>
      <span class="text-fluid-xs font-bold text-primary/60 bg-card px-3 py-1.5 rounded-xl border border-primary/10">
        {{ publicMenuStore.categories.length }} أقسام
      </span>
    </div>

    <!-- شريط التبويبات الملتصق (Sticky Category Tabs) -->
    <div class="sticky top-4 z-30">
      <div class="flex items-center gap-2 p-fluid overflow-x-auto no-scrollbar bg-card/80 backdrop-blur-md border border-primary/30 rounded-full shadow-soft">
        <button
          v-for="category in publicMenuStore.categories"
          :key="category.id"
          @click="scrollToCategory(category.id)"
          :class="[
            'px-fluid py-2 rounded-xl text-fluid-p font-bold transition-all whitespace-nowrap cursor-pointer',
            activeCategory === category.id 
              ? 'bg-primary text-white dark:text-black shadow-md' 
              : 'bg-bg text-text md:hover:text-primary'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>