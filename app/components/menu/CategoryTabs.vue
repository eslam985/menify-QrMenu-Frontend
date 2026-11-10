<script setup lang="ts">
const publicMenuStore = usePublicMenuStore();
const activeCategory = ref<string | number | null>(null);

const scrollToCategory = (categoryId: string | number) => {
  activeCategory.value = categoryId;
  const element = document.getElementById(`category-${categoryId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<template>
  <div dir="rtl" v-if="publicMenuStore.categories.length" class="my-fluid">
    <div class="mb-fluid flex items-center justify-between">
      <h2
        class="text-fluid-h3 text-primary flex items-center gap-2.5 font-black"
      >
        <div
          class="bg-primary/10 border-primary/20 text-primary rounded-xl border p-2"
        >
          <Icon name="lucide:layout-grid" class="h-6 w-6" />
        </div>
        <span>قائمة الأقسام والمنتجات</span>
      </h2>
      <span
        class="text-fluid-xs text-primary/60 bg-card border-primary/10 rounded-xl border px-3 py-1.5 font-bold"
      >
        {{ publicMenuStore.categories.length }} أقسام
      </span>
    </div>

    <div class="sticky top-4 z-30">
      <div
        class="p-fluid no-scrollbar bg-card/80 border-primary/30 shadow-soft flex items-center gap-2 overflow-x-auto rounded-full border backdrop-blur-md"
      >
        <button
          v-for="category in publicMenuStore.categories"
          :key="category.id"
          @click="scrollToCategory(category.id)"
          :class="[
            'px-fluid text-fluid-p cursor-pointer rounded-xl py-2 font-bold whitespace-nowrap transition-all',
            activeCategory === category.id
              ? 'bg-primary text-white shadow-md dark:text-black'
              : 'bg-bg text-text md:hover:text-primary',
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>
