<!-- /project_Full-stack/tabloz/frontend/app/components/Header.vue -->
<template>
  <header
    class="border-primary/50 p-fluid mx-auto flex w-full items-center justify-between border-b 2xl:max-w-[80%]"
  >
    <div class="flex items-center gap-2">
      <div
        class="bg-primary shadow-glow flex h-10 w-10 items-center justify-center rounded-xl text-xl font-black text-white"
      >
        M
      </div>
      <NuxtLink to="/">
        <span
          class="text-text md:hover:text-primary text-(length:--text-fluid-h3) font-black tracking-tight"
          >tabloz</span
        >
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3">
      <nuxt-link
        to="/auth/login"
        class="px-fluid bg-card border-primary/10 shadow-soft flex items-center gap-2 rounded-xl border py-2 text-(length:--text-fluid-sm) font-bold transition hover:text-white"
      >
        <Icon
          name="lucide:lock"
          class="text-primary h-4 w-4 group-hover:text-white"
        />
        <span class="text-text md:hover:text-primary">دخول الأدمن</span>
      </nuxt-link>

      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>
