<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen bg-bg text-text flex flex-col selection:bg-primary selection:text-white">
    <!-- هيدر الزوار -->
    <Header />
    
    <!-- محتوى الصفحة -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- الفوتر -->
    <Footer />
  </div>
</template>