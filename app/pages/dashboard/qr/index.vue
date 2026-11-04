<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.restaurantSlug) {
    await authStore.loadProfile()
  }
})
</script>

<template>
  <div class="w-full">
    <MenuQRCodeGenerator />
  </div>
</template>