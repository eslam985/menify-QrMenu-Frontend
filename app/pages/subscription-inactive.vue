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
  <NuxtLayout name="default">
  <div
    dir="rtl"
    class="px-fluid mx-auto flex min-h-[85vh] w-full items-center justify-center py-8 2xl:max-w-[90%]"
  >
    <div
      class="bg-card border-primary/15 shadow-soft p-section-fluid relative w-full max-w-xl overflow-hidden rounded-3xl border"
    >
      <!-- شريط علوي تحذيري خفيف -->
      <div
        class="from-danger/60 via-primary/60 to-danger/60 absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r"
      ></div>

      <!-- قسم الأيقونة والعنوان -->
      <div class="flex flex-col items-center text-center">
        <div
          class="bg-danger/10 border-danger/20 text-danger mb-fluid relative flex h-20 w-20 items-center justify-center rounded-2xl border shadow-inner"
        >
          <Icon name="lucide:shield-alert" class="h-10 w-10" />
          <span
            class="bg-danger ring-card absolute -top-1.5 -right-1.5 flex h-4 w-4 rounded-full ring-4"
          ></span>
        </div>

        <span
          class="bg-danger/10 text-danger border-danger/20 text-fluid-xs mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-bold"
        >
          <Icon name="lucide:pause-circle" class="h-3.5 w-3.5" />
          <span>حالة الحساب: غير نشط</span>
        </span>

        <h1 class="text-text text-fluid-h2 mb-2 font-black">
          اشتراك المطعم متوقف حالياً
        </h1>

        <p class="text-text/70 text-fluid-sm max-w-md leading-relaxed">
          تم إيقاف لوحة التحكم مؤقتاً لانتهاء مدة الاشتراك أو لإيقافه من قبل
          الإدارة. يرجى التواصل مع فريق الدعم لتجديد الباقة وإعادة التفعيل.
        </p>
      </div>

      <!-- تنبيه توضيحي حول المنيو العام -->
      <div
        class="bg-bg border-primary/10 p-fluid mt-6 flex items-start gap-3 rounded-2xl border text-right"
      >
        <div
          class="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        >
          <Icon name="lucide:qr-code" class="h-4 w-4" />
        </div>
        <div class="text-fluid-xs text-text/80 leading-relaxed">
          <p class="text-text mb-0.5 font-bold">تنبيه بخصوص المنيو العام (QR):</p>
          <p>
            رابط المنيو الخاص بالعملاء متوقف عن العمل أيضاً ولن يظهر للزوار
            حتى يتم تجديد الاشتراك وتفعيله.
          </p>
        </div>
      </div>

      <!-- أزرار التواصل مع الدعم -->
      <div v-if="whatsapp || email" class="mt-6">
        <p class="text-text/50 text-fluid-xs mb-3 text-center font-bold">
          تواصل مباشرة مع الدعم الفني للتجديد
        </p>
        <div class="gap-fluid grid grid-cols-1 sm:grid-cols-2">
          <a
            v-if="whatsapp"
            :href="`https://wa.me/${whatsapp}`"
            target="_blank"
            rel="noopener noreferrer"
            class="p-fluid flex items-center justify-center gap-2 rounded-xl bg-emerald-600 font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Icon name="lucide:message-circle" class="h-5 w-5" />
            <span>تواصل عبر واتساب</span>
          </a>

          <a
            v-if="email"
            :href="`mailto:${email}`"
            class="border-primary/20 text-primary hover:bg-primary/10 p-fluid flex items-center justify-center gap-2 rounded-xl border font-bold transition"
          >
            <Icon name="lucide:mail" class="h-5 w-5" />
            <span>البريد الإلكتروني</span>
          </a>
        </div>
      </div>

      <!-- فاصل -->
      <div class="border-primary/10 my-6 border-t"></div>

      <!-- أزرار الإجراءات (إعادة التحقق وتسجيل الخروج) -->
      <div class="gap-fluid flex flex-col-reverse sm:flex-row sm:justify-between">
        <button
          type="button"
          @click="auth.logout()"
          class="btn-danger flex items-center justify-center gap-2"
        >
          <Icon name="lucide:log-out" class="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>

        <button
          type="button"
          @click="retry"
          :disabled="checking"
          class="btn-primary p-fluid flex flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon
            name="lucide:refresh-cw"
            :class="['h-4 w-4', checking ? 'animate-spin' : '']"
          />
          <span>{{
            checking ? "جاري التحقق من الاشتراك..." : "تم التجديد؟ أعد المحاولة"
          }}</span>
        </button>
      </div>

      <!-- رسالة تنبيه في حال استمرار الإيقاف -->
      <div
        v-if="stillInactive"
        class="bg-danger/10 border-danger/20 text-danger text-fluid-xs mt-4 flex items-center justify-center gap-2 rounded-xl border p-3 font-bold"
      >
        <Icon name="lucide:alert-circle" class="h-4 w-4 shrink-0" />
        <span>الاشتراك ما زال متوقفاً، يرجى التأكد من إتمام التجديد مع الدعم.</span>
      </div>
    </div>
  </div>
  </NuxtLayout>

</template>
