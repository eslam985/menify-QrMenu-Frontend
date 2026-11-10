<!-- app/app.vue -->
<script setup lang="ts">
const authStore = useAuthStore();

if (import.meta.client) {
  authStore.init();
}
</script>

<template>
  <div class="bg-bg text-text relative flex min-h-screen w-full flex-col">
    <ClientOnly>
      <div
        v-if="!authStore.isInitialized"
        class="bg-bg text-text fixed inset-0 z-99999 flex flex-col items-center justify-center"
      >
        <div
          class="border-primary mb-fluid h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
        <p class="text-fluid-sm font-medium tracking-wide">جاري التحميل ...</p>
      </div>
    </ClientOnly>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
