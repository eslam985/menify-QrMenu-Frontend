<!-- frontend/app/pages/subscription-inactive.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: [
    () => {
      const authStore = useAuthStore();
      if (!authStore.subscriptionInactive) {
        return navigateTo("/auth/login");
      }
    },
  ],
});

const auth = useAuthStore();
const config = useRuntimeConfig();

const whatsapp = String(config.public.supportWhatsapp || "").replace(/\D/g, "");
const email = String(config.public.supportEmail || "");

const checking = ref(false);
const stillInactive = ref(false);

const retry = async () => {
  checking.value = true;
  stillInactive.value = false;
  auth.subscriptionInactive = false;
  auth.isInitialized = false;
  await auth.init();

  if (auth.isAuthenticated) await navigateTo("/dashboard");
  else stillInactive.value = auth.subscriptionInactive;
  checking.value = false;
};
</script>

<template>
  <div
    class="px-fluid mx-auto flex min-h-[80vh] w-full items-center justify-center 2xl:max-w-[90%]"
  >
    <div
      class="bg-card border-primary/10 shadow-soft w-full max-w-md rounded-2xl border p-8 text-center"
    >
      <div class="mb-fluid text-5xl">⏸️</div>
      <h1 class="text-primary text-fluid-p mb-2 font-bold">
        اشتراك المطعم متوقف
      </h1>
      <p class="text-text/70 text-fluid-sm leading-relaxed">
        تم إيقاف لوحة التحكم لهذا المطعم لانتهاء الاشتراك أو لإيقافه من الإدارة.
        يرجى التواصل مع الدعم لتجديد الاشتراك. المنيو العام متوقف أيضاً حتى يتم
        التجديد.
      </p>

      <div class="gap-fluid mt-6 flex flex-col">
        <a
          v-if="whatsapp"
          :href="`https://wa.me/${whatsapp}`"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full rounded-xl bg-green-600 py-3 font-bold text-white transition hover:opacity-90"
        >
          تواصل عبر واتساب
        </a>
        <a
          v-if="email"
          :href="`mailto:${email}`"
          class="border-primary/20 text-primary hover:bg-primary/5 w-full rounded-xl border py-3 font-bold transition"
        >
          تواصل عبر البريد الإلكتروني
        </a>

        <button
          @click="retry"
          :disabled="checking"
          class="bg-primary w-full cursor-pointer rounded-xl py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {{ checking ? "جاري التحقق..." : "تم التجديد؟ أعد المحاولة" }}
        </button>
        <p v-if="stillInactive" class="text-fluid-xs text-danger">
          الاشتراك ما زال متوقفاً.
        </p>

        <button
          @click="auth.logout()"
          class="text-text/60 text-fluid-xs mt-1 cursor-pointer hover:underline"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  </div>
</template>
