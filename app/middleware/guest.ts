// app/middleware/guest.ts
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async () => {
  // فحص الكوكي على السيرفر والمتصفح لمنع رندر صفحة اللوجن نهائياً للمسجلين وتجنب الـ Hydration Mismatch
  const sessionCookie = useCookie('menify_has_session')
  if (sessionCookie.value) {
    return navigateTo('/dashboard')
  }

  if (import.meta.server) return

  const auth = useAuthStore()
  await auth.init()

  if (auth.isAuthenticated) return navigateTo('/dashboard')
})