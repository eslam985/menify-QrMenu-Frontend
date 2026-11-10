<!-- project_Full-stack/tabloz/frontend/app/components/ThemeToggle.vue -->
<script setup lang="ts">
const colorMode = useColorMode();

const toggle = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <button
    @click="toggle"
    class="bg-card hover:border-primary text-text hover:text-primary shadow-soft flex cursor-pointer items-center justify-center rounded-xl border border-white/10 p-2.5 transition"
    title="تغيير المظهر"
  >
    <Icon
      :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
      class="h-5 w-5 transition-transform duration-300 hover:rotate-45"
    />
  </button>
</template>
