<!-- app/layouts/default.vue -->
<template>
  <div
    class="bg-bg text-text selection:bg-primary flex min-h-screen flex-col selection:text-white"
  >
    <Header />

    <main class="flex-1">
      <slot />
    </main>

    <Footer />
  </div>
</template>
