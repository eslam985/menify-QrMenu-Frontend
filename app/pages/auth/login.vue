<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

// Same-site paths only: prevents an open redirect (?redirect=https://evil.com)
const safeRedirect = (): string => {
  const r = String(route.query.redirect ?? '')
  return r.startsWith('/') && !r.startsWith('//') && !r.includes('\\') ? r : '/dashboard'
}

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form.email.trim(), form.password)
    await navigateTo(safeRedirect())
  } catch (err: any) {
    if (authStore.subscriptionInactive) {
      await navigateTo('/subscription-inactive')
      return
    }

    const status = err?.response?.status
    const isLoginRequest = String(err?.response?.url ?? '').includes('/auth/login')

    if (status === 401 && isLoginRequest) {
      errorMessage.value = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    } else if (status === 401) {
      errorMessage.value = 'تعذّر تحميل بيانات الحساب، حاول تسجيل الدخول مرة أخرى'
    } else {
      errorMessage.value = getApiError(err, 'فشل تسجيل الدخول، حاول مرة أخرى')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full 2xl:max-w-[90%] mx-auto min-h-[80vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full p-8 bg-card rounded-2xl border border-primary/10 shadow-soft text-right">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-primary">تسجيل الدخول</h1>
        <p class="text-xs text-text/60 mt-1">أدخل بيانات الحساب للوصول إلى لوحة التحكم</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-text/80 mb-1">البريد الإلكتروني</label>
          <input v-model="form.email" type="email" dir="ltr" autocomplete="email" placeholder="name@example.com"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required />
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">كلمة المرور</label>
          <input v-model="form.password" type="password" dir="ltr" autocomplete="current-password"
            placeholder="••••••••"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="loading"
          class="w-full py-3.5 rounded-xl bg-primary text-white font-bold mt-2 cursor-pointer hover:opacity-90 transition disabled:opacity-50">
          {{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-text/60">
        ليس لديك مطعم مسجل؟
        <nuxt-link to="/auth/register" class="text-primary font-bold hover:underline">إنشاء مطعم جديد</nuxt-link>
      </div>
    </div>
  </div>
</template>