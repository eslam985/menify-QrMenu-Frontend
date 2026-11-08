// app/stores/auth.ts
import { defineStore } from 'pinia'
import { useAuthService } from '@/services/authService' 

import type { UserProfileResponse } from '@/types/userType/userType'
import type { LoginUserType } from "@/schemas/userSchema/userSchema";

export const RolesList = { Admin: 5150, Editor: 1984, User: 2001 } as const


// دوال مساعدة للتعامل مع الكوكي على جهة المتصفح بأمان تام دون استخدام useCookie داخل الستور
const COOKIE_NAME = 'menify_has_session'

function getSessionCookie(): string | null {
  if (!import.meta.client) return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${COOKIE_NAME}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function setSessionCookie() {
  if (!import.meta.client) return
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${COOKIE_NAME}=1; expires=${expires}; path=/; SameSite=Lax`
}

function removeSessionCookie() {
  if (!import.meta.client) return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

export const useAuthStore = defineStore('auth', () => {
  const authService = useAuthService()

  const user = ref<UserProfileResponse | null>(null)
  const accessToken = ref<string | null>(null) // memory only, never localStorage
  const isInitialized = ref(false)
  const subscriptionInactive = ref(false)
  const isLoading = ref(false)

  const userRole = computed(() => (user.value ? Number(user.value.roles) : null))
  const restaurantId = computed(() => user.value?.restaurant_id ?? null)
  const restaurantSlug = computed(() => user.value?.restaurant_slug ?? null)
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => userRole.value === RolesList.Admin)
  const isEditorAndAbove = computed(
    () => userRole.value === RolesList.Editor || userRole.value === RolesList.Admin,
  )

  // Same rule as the backend verifyRoles: Admin > Editor > Viewer
  const hasRole = computed(() => (required: number): boolean => {
    if (!userRole.value) return false
    if (required === RolesList.Admin) return userRole.value === RolesList.Admin
    if (required === RolesList.Editor) return isEditorAndAbove.value
    return true
  })
  function clearSession() {
    user.value = null
    accessToken.value = null
    subscriptionInactive.value = false
    isInitialized.value = true
    removeSessionCookie()
  }

  async function loadProfile() {
    if (!accessToken.value) return false
    isLoading.value = true 
    try {
      const res = await authService.findUserById(accessToken.value)
      const { data,  success}  =  res 

      if (!success || !data ) return false

      user.value = data
      
      return data
    } catch (err: any) {
      console.error(err)
      const status = err?.status || err?.statusCode || err?.response?.status
      const errorData = err?.data || err?.response?._data
      if (status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE') {
        subscriptionInactive.value = true
      }
      return false
    } finally {
      isLoading.value = false
    }
  }



  /** Called after a successful login (the profile comes from GET /user: it has the restaurant info) */
    /** Called after a successful login (the profile comes from GET /user: it has the restaurant info) */
  async function login(body: LoginUserType['body']) {
    console.log('body from login: ', body)
    if (typeof body !== 'object' || Object.keys(body)?.length < 2) return false
    
    isLoading.value = true
    try {
      const res = await authService.login(body)

      const { data,  success }  = res 

      if (!data || !success) return false

      accessToken.value = data.accessToken ?? null

      user.value = data

      setSessionCookie()
      return data
    } catch (err: any) {
      const status = err?.status || err?.statusCode || err?.response?.status
      const errorData = err?.data || err?.response?._data
      const inactive = status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE'
      clearSession()
      if (inactive) subscriptionInactive.value = true
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }


  async function logout() {
    isLoading.value = true
    try {
      await authService.logout()

    } catch (err){
      /* even if the request fails, clear locally */
      console.error(err)
    } finally {
      isLoading.value = false
      clearSession()
      if (import.meta.client) {
        window.location.href = '/auth/login'
      } else {
        await navigateTo('/auth/login')
      }
    }
  }
  // Restores the session after a page reload: refresh cookie -> new access token -> profile.
  // One shared promise, so the middleware and any other caller never run two refreshes at once
  // (the backend rotates the token on every refresh).
  let initPromise: Promise<void> | null= null
  function init(): Promise<void> {
    if (isInitialized.value) return Promise.resolve()

    if (import.meta.server) return Promise.resolve()

    if (!getSessionCookie()) {
      isInitialized.value = true
      return Promise.resolve()
    }

    initPromise ??= (async () => {
      isLoading.value = true
      try {
        const r = await authService.init()
        console.log('r from store init: ', r)
        if (!r || !r.success) return

        accessToken.value = r.data
        setSessionCookie()
        const res = await loadProfile()

        if (!res) return
      } catch (err: any) {
        // إذا كان خطأ Timeout أو فشل اتصال تام، نقوم بتنظيف الجلسة بصمت دون رمي أخطاء
        const status = err?.status || err?.statusCode || err?.response?.status
        const errorData = err?.data || err?.response?._data
        const inactive = status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE'
        
        clearSession()
        if (inactive) subscriptionInactive.value = true
      } finally {
        isLoading.value = false
        isInitialized.value = true
        initPromise = null
      }
    })().catch(() => {
      // 🌟 حماية نهائية تضمن عدم وصول أي Unhandled Rejection لـ Nuxt
      clearSession()
      isLoading.value = false
      isInitialized.value = true
      initPromise = null
    })
    
    return initPromise
  }

  return {
    user, accessToken, isInitialized, subscriptionInactive,isLoading,
    userRole, restaurantId, restaurantSlug,
    isAuthenticated, isAdmin, isEditorAndAbove, hasRole, 
    login, logout, init, clearSession, loadProfile
  }
})