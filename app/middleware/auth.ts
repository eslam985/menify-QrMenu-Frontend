// app/middleware/auth.ts
import { useAuthStore } from "~/stores/auth"
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return // the session lives in the browser memory

  const auth = useAuthStore()
  await auth.init() // restores the session after F5 (no-op when already initialized)

  if (auth.subscriptionInactive) return navigateTo('/subscription-inactive')


  if (!auth.isAuthenticated) {
      // استخدام إعادة توجيه متصفح حقيقية لتفادي تعارض الـ SPA Layouts والشاشة البيضاء
      if (import.meta.client) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(to.fullPath)}`
        return
      }
      
      return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
    }

  const required = to.meta.requiredRole
  if (required && !auth.hasRole(required)) return navigateTo('/dashboard')
})