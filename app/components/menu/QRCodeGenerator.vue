<script setup lang="ts">
import { usePublicMenuState } from "~/composables/menu/usePublicMenu";
import { useMenuShare } from "~/composables/menu/useMenuShare"; 
const {  menuLink, qrCodeUrl, copied, generateQr, copyLink} = useMenuShare()
const { slug, } =
  usePublicMenuState();

onMounted(() => {
  generateQr();
});

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

    <div class="bg-card p-fluid rounded-2xl shadow-md">
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
      class="gap-fluid flex w-full flex-col items-center justify-center sm:flex-row"
    >
      <p
        class="text-fluid-sm text-primary bg-card border-primary/10 px-fluid rounded-lg border py-2 text-center break-all"
      >
        {{ menuLink }}
      </p>
      <button
        @click="copyLink"
        class="bg-card border-primary/20 text-text hover:bg-primary/10 px-fluid text-fluid-xs flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border py-2 font-medium transition"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="text-primary h-4 w-4"
        />
        <span>{{ copied ? "تم النسخ!" : "نسخ الرابط" }}</span>
      </button>
    </div>

    <div class="gap-fluid flex w-full flex-wrap items-center justify-center">
      <a
        v-if="qrCodeUrl"
        :href="qrCodeUrl"
        :download="`menu-qr-${slug}.png`"
        class="btn-primary"
      >
        <Icon name="lucide:download" class="h-4 w-4" /> تحميل الـ QR للطباعة
      </a>

      <NuxtLink :href="menuLink" target="_blank" class="btn-danger text-text">
        <Icon name="lucide:external-link" class="h-4 w-4" /> معاينة المنيو
      </NuxtLink>
    </div>
  </div>

  <div v-else>
    <span>حدثت مشكلة اثناء جلب البيانات</span>
  </div>
</template>
