<!-- app/app.vue -->
<script setup lang="ts">
const authStore = useAuthStore()

if (import.meta.client) {
  authStore.init()
}
</script>

<template>
  <div class="min-h-screen w-full flex flex-col bg-bg text-text relative">
    <!-- تغليف الـ Loader بـ ClientOnly يمنع أي تضارب أو Mismatch بين السيرفر والمتصفح -->
    <ClientOnly>
      <div
        v-if="!authStore.isInitialized"
        class="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-bg text-text"
      >
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-fluid"></div>
      <p class="text-fluid-sm font-medium tracking-wide">جاري التحميل ...</p>
      </div>
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>