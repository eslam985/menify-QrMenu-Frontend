<!-- project_Full-stack/Menify/frontend/app/components/ThemeToggle.vue -->
<script setup lang="ts">
const colorMode = useColorMode()

const toggle = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button 
    @click="toggle" 
    class="cursor-pointer p-2.5 rounded-xl bg-card border border-white/10 hover:border-primary transition flex items-center justify-center text-text hover:text-primary shadow-soft"
    title="تغيير المظهر"
  >
    <Icon 
      :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" 
      class="w-5 h-5 transition-transform duration-300 hover:rotate-45" 
    />
  </button>
</template>