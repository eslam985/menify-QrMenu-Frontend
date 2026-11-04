<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const { apiFetch } = useApi()

const form = reactive({
  inviteCode: '',
  restaurantName: '',
  slug: '',
  username: '',
  email: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')
const registered = ref(false)

// Latin-only slug, same rule as the backend: ^[a-z0-9]+(-[a-z0-9]+)*$
const slugify = (s: string): string =>
  s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)

// Follow the restaurant name until the user edits the slug by hand
const slugTouched = ref(false)
watch(() => form.restaurantName, (name) => {
  if (!slugTouched.value) form.slug = slugify(name)
})
const onSlugInput = () => {
  slugTouched.value = true
  form.slug = form.slug.toLowerCase().replace(/[^a-z0-9-]/g, '') // drop invalid characters while typing
}
const onSlugBlur = () => { form.slug = slugify(form.slug) }     // full cleanup when leaving the field

const registerError = (err: any): string => {
  const status = err?.response?.status
  const msg = String(err?.data?.message ?? '')
  if (status === 403) return 'كود الدعوة غير صالح أو منتهي الصلاحية'
  if (status === 409) {
    if (msg.includes('Slug')) return 'رابط المطعم مستخدم بالفعل، اختر رابطاً آخر'
    if (msg.includes('Email')) return 'هذا البريد الإلكتروني مسجّل بالفعل'
    return 'بيانات مكررة، راجع الحقول'
  }
  return getApiError(err, 'فشل التسجيل، راجع البيانات وحاول مرة أخرى')
}

const handleRegister = async () => {
  if (loading.value) return
  loading.value = true
  errorMessage.value = ''

  const payload = {
    inviteCode: form.inviteCode.trim(),
    restaurantName: form.restaurantName.trim(),
    slug: form.slug,
    username: form.username.trim(),
    email: form.email.trim(),
    password: form.password,
  }

  try {
    await apiFetch('/api/auth/register', { method: 'POST', body: payload })
    registered.value = true

    // Straight into the dashboard: no need to type the credentials again
    try {
      await authStore.login(payload.email, payload.password)
      await navigateTo('/dashboard')
    } catch {
      await navigateTo('/auth/login')
    }
  } catch (err: any) {
    errorMessage.value = registerError(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="min-h-[85vh] flex items-center justify-center px-4 py-8">
    <div class="max-w-lg w-full p-8 bg-card rounded-2xl border border-primary/10 shadow-soft text-right">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-primary">تسجيل مطعم جديد</h1>
        <p class="text-xs text-text/60 mt-1">أدخل كود الدعوة الذي حصلت عليه وبيانات المطعم الأساسية</p>
      </div>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm text-text/80 mb-1">كود الدعوة</label>
          <input
            v-model="form.inviteCode"
            type="text"
            autocomplete="off"
            placeholder="الصق كود الدعوة هنا"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">اسم المطعم</label>
          <input
            v-model="form.restaurantName"
            type="text"
            maxlength="150"
            placeholder="مطعم الباشا"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">رابط المطعم (Slug)</label>
          <input
            v-model="form.slug"
            @input="onSlugInput"
            @blur="onSlugBlur"
            type="text"
            dir="ltr"
            minlength="3"
            maxlength="60"
            autocomplete="off"
            placeholder="el-basha-cafe"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
          <p class="text-xs text-text/60 mt-1" dir="ltr">
            /menu/<span class="font-bold text-primary">{{ form.slug || 'your-restaurant' }}</span>
          </p>
          <p class="text-fluid-xs text-primary mt-1">
            ⚠️ أحرف إنجليزية صغيرة وأرقام وشرطات فقط. هذا الرابط سيُطبع داخل الـ QR.
          </p>
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">اسم المسؤول</label>
          <input
            v-model="form.username"
            type="text"
            minlength="3"
            maxlength="30"
            autocomplete="username"
            placeholder="eslam"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            dir="ltr"
            autocomplete="email"
            placeholder="admin@example.com"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
        </div>

        <div>
          <label class="block text-sm text-text/80 mb-1">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            dir="ltr"
            minlength="8"
            autocomplete="new-password"
            placeholder="8 أحرف على الأقل"
            class="w-full p-3.5 rounded-xl bg-bg border border-primary/10 text-text focus:outline-none focus:border-primary transition"
            required
          />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl">
          {{ errorMessage }}
        </p>
        <p v-if="registered" class="text-green-600 text-sm bg-green-500/10 p-3 rounded-xl">
          تم إنشاء المطعم بنجاح! جاري تحويلك إلى لوحة التحكم...
        </p>

        <button
          type="submit"
          :disabled="loading || registered"
          class="w-full py-3.5 rounded-xl bg-primary text-white font-bold mt-2 cursor-pointer hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading ? 'جاري إنشاء الحساب...' : 'إتمام التسجيل' }}
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-text/60">
        لديك حساب بالفعل؟
        <nuxt-link to="/auth/login" class="text-primary font-bold hover:underline">تسجيل الدخول</nuxt-link>
      </div>
    </div>
  </div>
</template>