<!-- app/components/menu/CategoryTabs.vue -->
<script setup lang="ts">
import { usePublicMenuState } from "~/composables/menu/usePublicMenu";
import { useMenuNavigation } from "~/composables/menu/useMenuNavigation";

const { activeCategory, isSticky, scrollToCategory, handleScroll } =
  useMenuNavigation();

const { targetCategories, publicMenuStore, selectedsection, sections } =
  usePublicMenuState();

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  // حساب الموضع الأولي فور التحميل (في حال تم عمل refresh والصفحة ممررة لأسفل)
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

watch(selectedsection, () => (activeCategory.value = null));
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
        class="text-fluid-xs text-primary/60 bg-card border-primary/10 px-fluid rounded-xl border py-1.5 font-bold"
      >
        {{ publicMenuStore.categories.length }} أقسام
      </span>
    </div>

    <!-- نقطة الارتكاز (Sentinel): تظل دائماً في مكانها الطبيعي في الـ DOM لقياس موضع الشريط ديناميكياً -->
    <div id="category-tabs-sentinel" class="pointer-events-none h-0 w-full" />

    <!-- حاوية تحافظ على المساحة لمنع قفزة المحتوى (Layout Shift) عند تحول الشريط إلى Fixed -->
    <div :class="{ 'h-16': isSticky }">
      <div
        :class="[
          'z-50 w-full transition-all duration-300',
          isSticky
            ? 'px-fluid bg-bg/95 fixed top-0 right-0 left-0 py-3 shadow-md backdrop-blur-md'
            : 'my-fluid relative',
        ]"
      >
        <div
          :class="[
            'p-fluid no-scrollbar bg-card/80 border-primary/30 flex items-center gap-2 overflow-x-auto border-y',
            isSticky
              ? 'mx-auto md:max-w-[90%] md:rounded-xl'
              : 'md:rounded-full',
          ]"
        >
          <select v-model="selectedsection" class="select-primary">
            <option value="كل الاقسام">كل الاقسام</option>
            <option v-for="sec in sections" :key="sec.value" :value="sec.value">
              {{ sec.label }}
            </option>
          </select>

          <button
            v-for="category in targetCategories"
            :key="category.id"
            @click="scrollToCategory(category.id)"
            :class="[
              'btn-primary p-fluid py-2.5 font-bold whitespace-nowrap ',
              activeCategory === category.id ? 'text-fluid-h3' : 'text-text text-fluid-p',
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
