<script setup lang="ts">
const route = useRoute();

const publicMenuStore = usePublicMenuStore();

const activeCategory = ref<string | number | null>(null);
const selectedsection = ref("كل الاقسام");
const isSticky = ref(false);

const sections = computed(() => publicMenuStore.sections);

const scrollToCategory = (categoryId: string | number) => {
  if (!categoryId) return;

  activeCategory.value = categoryId;

  const element = document.getElementById(`category-${categoryId}`);

  if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
};

// 💡 الخاصية الجديدة لفلترة الأقسام بناءً على السيكشن المختار
const filteredCategories = computed(() => {
  const res =
    selectedsection.value === "كل الاقسام"
      ? publicMenuStore.categories
      : publicMenuStore.categories.filter(
          (category) => category.section === selectedsection.value,
        );

  return res;
});

// 💡 وظيفة تفحص مكان الاسكرول وتحدد متى يلتصق الشريط بالظبط
const handleScroll = () =>
  window.scrollY > 1000 ? (isSticky.value = true) : (isSticky.value = false);

// إذا تغير السيكشن، نجعل التحديد يبدأ من أول عنصر متاح في الفلتر الجديد
watch(selectedsection, () => (activeCategory.value = null));

onMounted(() => {
  const slug = route.params.slug;
  const menuSlug = Array.isArray(slug) ? slug[0] : slug;
  menuSlug ? publicMenuStore.fetchMenu(menuSlug) : null;

  window.addEventListener("scroll", handleScroll, true);
});

onUnmounted(() => window.removeEventListener("scroll", handleScroll, true));
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

    <!-- 💡 الحاوية هنا تتغير ديناميكياً بناءً على الاسكرول وتأخذ العرض المناسب لشاشات الموبايل والديسك توب -->
    <div
      :class="[
        'z-50 w-full transition-all duration-300',
        isSticky
          ? 'px-fluid bg-bg/95 fixed top-0 right-0 left-0 py-3 shadow-md backdrop-blur-md'
          : 'my-fluid relative',
      ]"
    >
      <!-- شريط التصنيفات الدائري -->
      <div
        :class="[
          'p-fluid no-scrollbar bg-card/80 border-primary/30 flex items-center gap-2 overflow-x-auto border-y',
          isSticky ? 'mx-auto max-w-5xl md:rounded-xl' : 'md:rounded-full',
        ]"
      >
        <select v-model="selectedsection" class="select-primary">
          <option value="كل الاقسام">كل الاقسام</option>
          <option v-for="sec in sections" :key="sec" :value="sec">
            {{ sec }}
          </option>
        </select>

        <button
          v-for="category in filteredCategories"
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
