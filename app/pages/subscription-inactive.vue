<!-- frontend/app/pages/subscription-inactive.vue -->
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// 🛡️ حماية الصفحة: السماح بالدخول فقط إذا كان الاشتراك متوقفاً حقاً
definePageMeta({
  middleware: [
    () => {
      const authStore = useAuthStore()
      if (!authStore.subscriptionInactive) {
        return navigateTo('/auth/login')
      }
    }
  ]
})

const auth = useAuthStore()
const config = useRuntimeConfig()

const whatsapp = String(config.public.supportWhatsapp || '').replace(/\D/g, '')
const email = String(config.public.supportEmail || '')

const checking = ref(false)
const stillInactive = ref(false)

// After the owner renews and you reactivate the restaurant: try to restore the session
const retry = async () => {
  checking.value = true
  stillInactive.value = false
  auth.subscriptionInactive = false
  auth.isInitialized = false      // force init() to run again
  await auth.init()

  if (auth.isAuthenticated) await navigateTo('/dashboard')
  else stillInactive.value = auth.subscriptionInactive
  checking.value = false
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full p-8 bg-card rounded-2xl border border-primary/10 shadow-soft text-center">
      <div class="text-5xl mb-4">⏸️</div>
      <h1 class="text-2xl font-bold text-primary mb-2">اشتراك المطعم متوقف</h1>
      <p class="text-sm text-text/70 leading-relaxed">
        تم إيقاف لوحة التحكم لهذا المطعم لانتهاء الاشتراك أو لإيقافه من الإدارة.
        يرجى التواصل مع الدعم لتجديد الاشتراك. المنيو العام متوقف أيضاً حتى يتم التجديد.
      </p>

      <div class="flex flex-col gap-3 mt-6">
        <a
          v-if="whatsapp"
          :href="`https://wa.me/${whatsapp}`"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:opacity-90 transition"
        >
          تواصل عبر واتساب
        </a>
        <a
          v-if="email"
          :href="`mailto:${email}`"
          class="w-full py-3 rounded-xl border border-primary/20 text-primary font-bold hover:bg-primary/5 transition"
        >
          تواصل عبر البريد الإلكتروني
        </a>

        <button
          @click="retry"
          :disabled="checking"
          class="w-full py-3 rounded-xl bg-primary text-white font-bold cursor-pointer hover:opacity-90 transition disabled:opacity-50"
        >
          {{ checking ? 'جاري التحقق...' : 'تم التجديد؟ أعد المحاولة' }}
        </button>
        <p v-if="stillInactive" class="text-xs text-red-500">الاشتراك ما زال متوقفاً.</p>

        <button @click="auth.logout()" class="text-xs text-text/60 hover:underline cursor-pointer mt-1">
          تسجيل الخروج
        </button>
      </div>
    </div>
  </div>
</template>