// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxt/icon/module",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "nuxt-schema-org",
  ],
  compatibilityDate: "2025-07-15",
  telemetry: false,
  devtools: { enabled: true },
  spaLoadingTemplate: true, // a loader instead of a blank screen while the SPA boots
  runtimeConfig: {
    public: {
      supportWhatsapp: process.env.NUXT_PUBLIC_SUPPORT_WHATSAPP ?? "",
      supportEmail: process.env.NUXT_PUBLIC_SUPPORT_EMAIL ?? "",
      supportTelegram: process.env.NUXT_PUBLIC_SUPPORT_TELEGRAM ?? "", // اسم المستخدم بدون @ مثلاً: tabloz_support
      supportFacebook: process.env.NUXT_PUBLIC_SUPPORT_FACEBOOK ?? "", // رابط الصفحة كامل
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "/api",
    },
  },

  routeRules: {
    "/dashboard": { ssr: false },
    "/dashboard/**": { ssr: false },
    "/subscription-inactive": { ssr: false },
    "/auth/login": { ssr: false },
    "/auth/register": { ssr: false },
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
  app: {
    head: {
      htmlAttrs: {
        lang: "ar",
        dir: "rtl",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  pinia: {
    storesDirs: ["stores"],
  },
  typescript: {
    strict: true,

    tsConfig: {
      compilerOptions: {
        noPropertyAccessFromIndexSignature: false,
        noFallthroughCasesInSwitch: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        allowUnreachableCode: false,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noUnusedLocals: true,
        noImplicitAny: true,
        skipLibCheck: true,
        allowJs: false,
      },
    },
  },

  // 1. تعريف هوية الموقع الأساسية (تُستخدم لبناء Canonical URLs والسايت ماب تلقائياً)
  site: {
    url: "https://tabloz-bice.vercel.app",
    name: "Tabloz - منيو إلكتروني ذكي للمطاعم والكافيهات",
    description:
      "ودّع المنيوهات الورقية، وابدأ المستقبل مع Tabloz. منيو إلكتروني تفاعلي عبر QR كود مع لوحة تحكم كاملة.",
    defaultLocale: "ar",
  },
  robots: {
    disallow: [
      "/dashboard",
      "/dashboard/**",
      "/auth",
      "/auth/**",
      "/subscription-inactive",
      "/api/**",
    ],
    allow: ["/", "/about", "/contact", "/terms", "/privacy", "/menu/**"],
  },

  sitemap: {
    sources: ["/__sitemap__/urls"],
    exclude: ["/dashboard/**", "/auth/**", "/subscription-inactive"],
  },
});
