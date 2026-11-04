<!-- /project_Full-stack/Menify/frontend/app/components/Header.vue -->
<template>
  <!-- Navbar / Header -->
  <header class="w-full 2xl:max-w-[80%] mx-auto border-b border-primary/50 p-fluid flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div
        class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-glow">
        M
      </div>
      <NuxtLink to="/">
        <span
          class="text-(length:--text-fluid-h3) font-black tracking-tight text-text md:hover:text-primary">Menify</span>
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3">
      <!-- زر اللوج ان للأدمن -->
      <nuxt-link to="/auth/login"
        class="px-fluid py-2 rounded-xl bg-card border border-primary/10 text-(length:--text-fluid-sm) font-bold hover:text-white transition shadow-soft flex items-center gap-2 ">
        <Icon name="lucide:lock" class="w-4 h-4 text-primary group-hover:text-white" />
        <span class="text-text md:hover:text-primary">دخول الأدمن</span>
      </nuxt-link>

      <!-- زر التارك مود اللي عملناه ف الأول -->
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>