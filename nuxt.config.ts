// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "nuxt-zod",
    "@nuxt/icon/module",
    "@nuxtjs/color-mode",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  spaLoadingTemplate: true,            // a loader instead of a blank screen while the SPA boots
  runtimeConfig: {
    public: { 
      supportWhatsapp: process.env.NUXT_PUBLIC_SUPPORT_WHATSAPP ?? "", // e.g. 201001234567 (international format, digits only)
      supportEmail: process.env.NUXT_PUBLIC_SUPPORT_EMAIL ?? "",     // -> NUXT_PUBLIC_SUPPORT_EMAIL
      apiBase: "http://localhost:3000/api" // override with NUXT_PUBLIC_API_BASE in production
    }, 
  },
  routeRules: {
    '/dashboard/**': { ssr: false },   // restore this one
    //'/auth/**' : { ssr: false }, // stays WITHOUT ssr:false: login/register render instantly from the server
    // '/api/**': { proxy: 'https://your-backend.vercel.app/api/**' }
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  icon: {
    mode: "css",
    cssLayer: "base",
  },
  nuxtZod: {
    zodVersion: "v4",
  },
});
