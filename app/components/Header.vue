<!-- /project_Full-stack/tabloz/frontend/app/components/Header.vue -->
<template>
  <header
    class="border-primary/50 p-fluid mx-auto flex w-full items-center justify-between border-b 2xl:max-w-[80%]"
  >
    <div class="flex items-center gap-6">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div
          class="bg-primary shadow-glow text-fluid-h3 flex h-10 w-10 items-center justify-center rounded-xl font-black text-white"
        >
          T
        </div>
        <span
          class="text-text md:hover:text-primary text-(length:--text-fluid-h3) font-black tracking-tight"
        >
          Tabloz
        </span>
      </NuxtLink>

      <!-- روابط سريعة تظهر على الشاشات المتوسطة والكبيرة فقط -->
      <nav
        class="text-fluid-sm text-text/80 hidden items-center gap-5 font-bold md:flex"
      >
        <NuxtLink
          to="/about"
          active-class="text-primary"
          class="hover:text-primary transition"
        >
          من نحن
        </NuxtLink>
        <NuxtLink
          to="/contact"
          active-class="text-primary"
          class="hover:text-primary transition"
        >
          تواصل معنا
        </NuxtLink>
      </nav>
    </div>

    <div class="gap-fluid flex items-center">
      <NuxtLink
        to="/auth/login"
        class="px-fluid bg-card border-primary/10 shadow-soft group flex items-center gap-2 rounded-xl border py-2 text-(length:--text-fluid-sm) font-bold transition"
      >
        <Icon name="lucide:lock" class="text-primary h-4 w-4 transition" />
        <span class="text-text md:group-hover:text-primary">تسجيل الدخول</span>
      </NuxtLink>

      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>
    </div>
  </header>
</template>
