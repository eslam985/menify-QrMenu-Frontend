<!-- app/pages/contact.vue -->
<script setup lang="ts">
useSeoMeta({
  title: "تواصل معنا - Tabloz",
  description:
    "تواصل مع فريق دعم Tabloz للاستفسارات وطلبات الاشتراك في المنيو الإلكتروني.",
});

const config = useRuntimeConfig();
const whatsapp = String(config.public.supportWhatsapp || "").replace(/\D/g, "");
const email = String(config.public.supportEmail || "");
const telegram = String(config.public.supportTelegram || "").replace(/^@/, "");
const facebook = String(config.public.supportFacebook || "");
</script>

<template>
  <div dir="rtl" class="px-fluid mx-auto w-full max-w-4xl py-12">
    <div
      class="bg-card border-primary/15 shadow-soft p-section-fluid rounded-3xl border text-center"
    >
      <div
        class="bg-primary/10 border-primary/20 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border"
      >
        <Icon name="lucide:headphones" class="h-8 w-8" />
      </div>

      <h1 class="text-text text-fluid-h1 font-black">تواصل معنا</h1>
      <p class="text-text/70 text-fluid-p mx-auto mt-2 max-w-xl leading-relaxed">
        فريق دعم <strong>Tabloz</strong> جاهز للرد على استفساراتك ومساعدتك في
        إنشاء المنيو الخاص بمطعمك أو كافيهك في أسرع وقت.
      </p>

      <!-- قنوات التواصل المباشر (Grid 2x2 متناسق) -->
      <div class="gap-fluid mt-8 grid grid-cols-1 md:grid-cols-2">
        <!-- واتساب -->
        <a
          v-if="whatsapp"
          :href="`https://wa.me/${whatsapp}?text=${encodeURIComponent('مرحباً، أرغب في الاستفسار عن الاشتراك في منصة Tabloz')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-bg hover:border-emerald-500/50 border-primary/10 p-fluid group flex flex-col items-center rounded-2xl border transition"
        >
          <div
            class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition group-hover:scale-105"
          >
            <Icon name="lucide:message-circle" class="h-7 w-7" />
          </div>
          <h2 class="text-text text-fluid-h3 font-bold">
            المحادثة الفورية (واتساب)
          </h2>
          <p class="text-text/60 text-fluid-xs mt-1">
            أسرع طريقة للتواصل وطلب تفعيل الحساب
          </p>
          <span
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
          >
            <span>ابدأ المحادثة الآن</span>
            <Icon name="lucide:arrow-up-left" class="h-4 w-4" />
          </span>
        </a>

        <!-- تيليجرام -->
        <a
          v-if="telegram"
          :href="`https://t.me/${telegram}`"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-bg border-primary/10 p-fluid group flex flex-col items-center rounded-2xl border transition hover:border-sky-500/50"
        >
          <div
            class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 transition group-hover:scale-105"
          >
            <Icon name="lucide:send" class="h-7 w-7" />
          </div>
          <h2 class="text-text text-fluid-h3 font-bold">تيليجرام (Telegram)</h2>
          <p class="text-text/60 text-fluid-xs mt-1">
            تواصل مباشر مع الدعم الفني عبر تيليجرام
          </p>
          <span
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white"
          >
            <span>راسلنا على تيليجرام</span>
            <Icon name="lucide:arrow-up-left" class="h-4 w-4" />
          </span>
        </a>

        <!-- فيسبوك -->
        <a
          v-if="facebook"
          :href="facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-bg border-primary/10 p-fluid group flex flex-col items-center rounded-2xl border transition hover:border-blue-500/50"
        >
          <div
            class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition group-hover:scale-105"
          >
            <Icon name="lucide:facebook" class="h-7 w-7" />
          </div>
          <h2 class="text-text text-fluid-h3 font-bold">صفحتنا على فيسبوك</h2>
          <p class="text-text/60 text-fluid-xs mt-1">
            تابع أحدث العروض والتحديثات أو راسلنا عبر ماسنجر
          </p>
          <span
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
          >
            <span>زيارة الصفحة</span>
            <Icon name="lucide:arrow-up-left" class="h-4 w-4" />
          </span>
        </a>

        <!-- البريد الإلكتروني -->
        <a
          v-if="email"
          :href="`mailto:${email}`"
          class="bg-bg hover:border-primary/50 border-primary/10 p-fluid group flex flex-col items-center rounded-2xl border transition"
        >
          <div
            class="bg-primary/10 text-primary mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105"
          >
            <Icon name="lucide:mail" class="h-7 w-7" />
          </div>
          <h2 class="text-text text-fluid-h3 font-bold">البريد الإلكتروني</h2>
          <p class="text-text/60 text-fluid-xs mt-1">
            للمقترحات والدعم الفني والطلبات الرسمية
          </p>
          <span
            class="border-primary/20 text-primary mt-4 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold"
          >
            <span>{{ email }}</span>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
