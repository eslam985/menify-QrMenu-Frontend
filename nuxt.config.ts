// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@pinia/nuxt", "@nuxt/icon/module", "@nuxtjs/color-mode"],
  compatibilityDate: "2025-07-15",
  telemetry: false,
  devtools: { enabled: true },
  spaLoadingTemplate: true, // a loader instead of a blank screen while the SPA boots
  runtimeConfig: {
    public: {
      supportWhatsapp: process.env.NUXT_PUBLIC_SUPPORT_WHATSAPP ?? "",
      supportEmail: process.env.NUXT_PUBLIC_SUPPORT_EMAIL ?? "",
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "/api", // خليه /api كقيمة افتراضية عشان البروكسي يشتغل
    },
  },
  routeRules: {
    "/dashboard/**": { ssr: false },
    //'/auth/**' : { ssr: false }, // stays WITHOUT ssr:false: login/register render instantly from the server
    "/api/**": {
      proxy: "https://menify-qr-menu-backend.vercel.app/api/**",
    },
  },

  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  icon: {
    mode: "css",
    cssLayer: "base",
    provider: "iconify",
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  pinia: {
    storesDirs: ["stores"],
  },
  typescript: {
    strict: true, // تفعيل الفحص الصارم الأساسي لـ Nuxt تلقائياً

    tsConfig: {
      compilerOptions: {
        noImplicitAny: true,
        noImplicitReturns: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noUncheckedIndexedAccess: true,
        allowUnreachableCode: false,
        exactOptionalPropertyTypes: true,
        noFallthroughCasesInSwitch: true,
        noPropertyAccessFromIndexSignature: false,
        skipLibCheck: true,
        allowJs: false,
      },
    },
  },
});
