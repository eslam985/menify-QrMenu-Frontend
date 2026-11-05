// app/composables/useApi.ts
import { useAuthStore } from '~/stores/auth'

// One shared refresh for every concurrent 401: the backend rotates the token on each call,
// so parallel refreshes would look like token theft and kill the session.
let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = (apiBase: string): Promise<string | null> => {
  refreshPromise ??= $fetch<{ data: string }>(`${apiBase}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((r) => r.data) // the backend returns the token string directly in `data`
    .catch(() => null)
    .finally(() => { refreshPromise = null })
  return refreshPromise
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const route = useRoute()

  const notiStore = useNotificationStore()
  const authStore = useAuthStore()

  const base = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    onRequest({ options }) {
      if (authStore.accessToken) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
        options.headers = headers
      }
    },

    // 🌟 🌟 هنا بديل interceptors.response.use الخاص بـ Axios للأخطاء 🌟 🌟
    onResponseError({ response }) {
      const status = response.status
      const errorData = response._data

      // 1. التقاط خطأ 429 (Rate Limit)
      if (status === 429) {
        const retryAfterHeader = response.headers.get('retry-after') || response.headers.get('Retry-After')
        const retryAfter = parseInt(retryAfterHeader || '60', 10) || 60
        const mins = Math.ceil(retryAfter / 60)
        notiStore.show(`طلبات كثيرة جداً - برجاء المحاولة مرة أخرى بعد ${mins} دقائق`, 'error')
        return
      }

      // 2. التقاط خطأ 404 (Not Found)
      if (status === 404) {
        notiStore.show(errorData?.message || 'عذراً، لم نتمكن من العثور على ما تبحث عنه.', 'error')
        return
      }

      // 3. التقاط خطأ 413 (Payload Too Large)
      if (status === 413) {
        notiStore.show(errorData?.message || 'حجم الملف المرفوع كبير جداً!', 'error')
        return
      }

      // 4. التقاط خطأ 504 (Gateway Timeout)
      if (status === 504) {
        notiStore.show('انتهت مهلة الاتصال بالخادم، العملية استغرقت وقتاً طويلاً.', 'error')
        return
      }

      // 5. التقاط خطأ 503 (Database/Server Offline قادم من إكسبريس)
      if (status === 503) {
        notiStore.show(errorData?.message || 'حدثت مشكلة في الاتصال من جانبنا جرب مرة اخري', 'error')
        return
      }
    }
  })

  /**
   * 401 -> refresh once -> retry the SAME request.
   * 403 SUBSCRIPTION_INACTIVE -> subscription page.
   * Throws the original error otherwise (err.response.status, err.data.message).
   */
  const apiFetch = async <T = any>(url: string, opts: Record<string, any> = {}): Promise<T> => {
    try {
      return await base<T>(url, opts)

    } catch (err: any) {
      // دعم قراءة الـ Status والـ Data سواء من ofetch أو أي هيكل آخر
      const status = err?.status || err?.statusCode || err?.response?.status
      const errorData = err?.data || err?.response?._data

      if (status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE') {
        authStore.subscriptionInactive = true
        await navigateTo('/subscription-inactive')
        // إرجاع undefined لمنع وصول الخطأ للستور أو إظهار شاشة الخطأ الحمراء
        return undefined as T
      }

      if (status !== 401 || url.includes('/auth/')) throw err

      const token = await refreshAccessToken(config.public.apiBase)
      if (!token) {
        authStore.clearSession()
        if (import.meta.client) {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(route.fullPath)}`
        } else {
          await navigateTo({ path: '/auth/login', query: { redirect: route.fullPath } })
        }

        throw err
      }
      authStore.accessToken = token
      return await base<T>(url, opts)
    }
  }

  return { apiFetch }
}