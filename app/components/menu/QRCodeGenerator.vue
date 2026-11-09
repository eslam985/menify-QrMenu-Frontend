<script setup lang="ts">
import QRCode from "qrcode";

const authStore = useAuthStore();
const slug = computed(() => authStore.restaurantSlug);

const qrCodeUrl = ref("");
const copied = ref(false);

// تكوين الرابط الكامل للمنيو بناءً على الدومين الحالي أو الثابت
const menuLink = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/menu/${slug.value}`;
  }

  // على السيرفر، نقوم بجلب الدومين والبروتوكول الحالي ديناميكياً دون أي هاردكود
  const requestUrl = useRequestURL();
  return `${requestUrl.origin}/menu/${slug.value}`;
});
// توليد الـ QR كصورة Data URL c95400 ffffff
const generateQr = async () => {
  try {
    qrCodeUrl.value = await QRCode.toDataURL(menuLink.value, {
      width: 300,
      margin: 2,
      color: {
        dark: "#c95400", // لون الـ QR (Primary)
        light: "#ffffff", // خلفية بيضاء لضمان قراءة سريعة ودقيقة بالهاتف
      },
    });
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  generateQr();
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(menuLink.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

watch(slug, () => {
  generateQr();
});
</script>

<template>
  <div
    v-if="slug"
    class="p-fluid mb-section-fluid shadow-soft border-primary/10 gap-fluid flex flex-col items-center justify-center rounded-xl border"
  >
    <h3 class="text-text text-(length:--text-fluid-h3) font-bold">
      QR كود المنيو الخاص بك
    </h3>

    <div class="bg-card rounded-2xl p-4 shadow-md">
      <img
        v-if="qrCodeUrl"
        :src="qrCodeUrl"
        alt="Restaurant QR Code"
        class="h-48 w-48 object-contain"
      />
      <div v-else class="flex h-48 w-48 items-center justify-center">
        <div
          class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
      </div>
    </div>

    <div
      class="flex w-full flex-col items-center justify-center gap-3 sm:flex-row"
    >
      <p
        class="text-fluid-sm text-primary bg-card border-primary/10 rounded-lg border px-3 py-2 text-center break-all"
      >
        {{ menuLink }}
      </p>
      <button
        @click="copyLink"
        class="bg-card border-primary/20 text-text hover:bg-primary/10 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="text-primary h-4 w-4"
        />
        <span>{{ copied ? "تم النسخ!" : "نسخ الرابط" }}</span>
      </button>
    </div>

    <div class="flex w-full flex-wrap items-center justify-center gap-3">
      <!-- زر تحميل الـ QR -->
      <a
        v-if="qrCodeUrl"
        :href="qrCodeUrl"
        :download="`menu-qr-${slug}.png`"
        class="btn-primary"
      >
        <Icon name="lucide:download" class="h-4 w-4" /> تحميل الـ QR للطباعة
      </a>

      <!-- زر معاينة المنيو الحي -->
      <NuxtLink :href="menuLink" target="_blank" class="btn-danger text-text">
        <Icon name="lucide:external-link" class="h-4 w-4" /> معاينة المنيو
      </NuxtLink>
    </div>
  </div>

  <div v-else>
    <span>حدثت مشكلة اثناء جلب البيانات</span>
  </div>
</template>
