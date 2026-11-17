<template>
  <footer
    dir="rtl"
    class="mt-fluid p-fluid border-primary/30 text-fluid-sm text-text/60 mx-auto flex w-full flex-col items-center justify-between gap-4 border-t text-center md:flex-row 2xl:max-w-[80%]"
  >
    <nav
      class="text-fluid-xs text-text/70 flex flex-wrap items-center justify-center gap-4 font-bold md:gap-6"
    >
      <NuxtLink to="/about" class="hover:text-primary transition">
        من نحن
      </NuxtLink>
      <NuxtLink to="/contact" class="hover:text-primary transition">
        تواصل معنا
      </NuxtLink>
      <NuxtLink to="/terms" class="hover:text-primary transition">
        الشروط والأحكام
      </NuxtLink>
      <NuxtLink to="/privacy" class="hover:text-primary transition">
        سياسة الخصوصية
      </NuxtLink>
    </nav>

    <NuxtLink to="/" class="text-fluid-xs cursor-pointer">
      © {{ new Date().getFullYear() }}
      <span class="text-primary font-bold">Tabloz</span>. جميع الحقوق محفوظة.
    </NuxtLink>
  </footer>
</template>
