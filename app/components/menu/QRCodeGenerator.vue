<script setup lang="ts">

import QRCode from 'qrcode'

import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const slug = computed(() => authStore.restaurantSlug)

const qrCodeUrl = ref('')
const copied = ref(false)

// تكوين الرابط الكامل للمنيو بناءً على الدومين الحالي أو الثابت
const menuLink = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/menu/${slug.value}`
  }

  // على السيرفر، نقوم بجلب الدومين والبروتوكول الحالي ديناميكياً دون أي هاردكود
  const requestUrl = useRequestURL()
  return `${requestUrl.origin}/menu/${slug.value}`
})
// توليد الـ QR كصورة Data URL c95400 ffffff
const generateQr = async () => {

  try {
    qrCodeUrl.value = await QRCode.toDataURL(menuLink.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#c95400', // لون الـ QR (Primary)
        light: '#ffffff' // خلفية بيضاء لضمان قراءة سريعة ودقيقة بالهاتف
      }
    })

  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  generateQr()
})


const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(menuLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

watch(slug, () => {
  generateQr()
})
</script>

<template>
  <div v-if="slug"
    class="flex flex-col items-center justify-center p-6  rounded-xl shadow-soft border border-primary/10 gap-4">
    <h3 class="text-(length:--text-fluid-h3) font-bold text-text/80">QR كود المنيو الخاص بك</h3>

    <div class="p-4 bg-card rounded-2xl shadow-md">
      <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Restaurant QR Code" class="w-48 h-48 object-contain" />
      <div v-else class="w-48 h-48 flex items-center justify-center">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
      <p class="text-fluid-sm text-primary text-center break-all bg-card px-3 py-2 rounded-lg border border-primary/10">
        {{ menuLink }}
      </p>
      <button 
        @click="copyLink"
        class="px-3 py-2 rounded-xl bg-card border border-primary/20 text-text font-medium text-xs hover:bg-primary/10 transition flex items-center gap-1.5 cursor-pointer shrink-0"
      >
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4 text-primary" />
        <span>{{ copied ? 'تم النسخ!' : 'نسخ الرابط' }}</span>
      </button>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3 w-full">
      <!-- زر تحميل الـ QR -->
      <a v-if="qrCodeUrl" :href="qrCodeUrl" :download="`menu-qr-${slug}.png`"
        class="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition flex items-center gap-2 cursor-pointer">
        <Icon name="lucide:download" class="w-4 h-4" /> تحميل الـ QR للطباعة
      </a>

      <!-- زر معاينة المنيو الحي -->
      <NuxtLink :href="menuLink" target="_blank"
        class="px-fluid py-2 rounded-xl bg-card border border-primary/30 text-primary font-bold text-sm hover:bg-primary/10 transition flex items-center gap-2 cursor-pointer">
        <Icon name="lucide:external-link" class="w-4 h-4" /> معاينة المنيو
      </NuxtLink>
    </div>
  </div>

  <div v-else>
    <span>حدثت مشكلة اثناء جلب البيانات</span>
  </div>
</template>