<script setup lang="ts">
const cartStore = useCartStore();
const isVisible = ref(false);

const hasCartItems = computed(() => cartStore.items.length > 0);

const handleScroll = () => {
  isVisible.value = window.scrollY > 300;
};

const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="isVisible"
      @click="backToTop"
      type="button"
      aria-label="العودة إلى الأعلى"
      title="العودة إلى الأعلى"
      :class="hasCartItems ? 'bottom-23 md:bottom-4' : 'bottom-4'"
      class="bg-primary hover:bg-primary/80 fixed left-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
    >
      <Icon name="lucide:chevrons-up" class="h-5 w-5" />
    </button>
  </Transition>
</template>
