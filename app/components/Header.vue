<script setup lang="ts">
const { siteName, firstLetter } = useBrand();
</script>

<template>
  <header
    class="border-primary/50 p-fluid mx-auto flex w-full items-center justify-between border-b 2xl:max-w-[80%]"
  >
    <!-- right -->
    <div class="gap-fluid flex items-center">
      <ClientOnly>
        <ThemeToggle />
      </ClientOnly>

      <NuxtLink
        to="/auth/login"
        class="px-fluid bg-card border-primary/10 shadow-soft group flex items-center gap-2 rounded-xl border py-2 text-(length:--text-fluid-sm) font-bold transition"
      >
        <Icon name="lucide:lock" class="text-primary h-4 w-4 transition" />
        <span class="text-text md:group-hover:text-primary">سجل الأن</span>
      </NuxtLink>
    </div>

    <!-- left -->
    <div class="gap-section flex items-center">
      <!-- روابط سريعة تظهر على الشاشات المتوسطة والكبيرة فقط -->
      <nav
        class="text-fluid-sm text-text/80 gap-fluid hidden items-center font-bold md:flex"
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

      <NuxtLink to="/" class="flex items-center gap-2">
        <span
          class="text-text md:hover:text-primary text-(length:--text-fluid-h3) font-black tracking-tight"
        >
          {{ siteName }}
        </span>
        <div
          class="bg-card shadow-glow text-fluid-h3 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border font-black"
        >
          {{ firstLetter }}
        </div>
      </NuxtLink>
    </div>
  </header>
</template>
