// app/stores/auth.ts
import { defineStore } from 'pinia'

export const RolesList = { Admin: 5150, Editor: 1984, User: 2001 } as const

export interface BaseApiResponse<T = null> {
    success: boolean
    message: string
    data: T
}

export interface Profile extends BaseApiResponse {
  accessToken?: string
  userId?: string
  created_at?:string
  updated_at?: string
  id: string
  restaurant_id: string
  username: string
  email: string
  roles: string
  avatar_url: string
  avatar_history: string[]
  restaurant_name: string
  restaurant_slug: string
  restaurant_logo_url: string | null
}

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
  const config = useRuntimeConfig() // top of setup, not after an await
  const apiBase = () => config.public.apiBase

  const user = ref<Profile | null>(null)
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

    if(!accessToken.value) return false
    
    isLoading.value = true 
    try {
      const res = await $fetch<{ success: boolean; data: Profile }>(`${apiBase()}/api/user`, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
        credentials: 'include',
      })
      
      // إذا فشل الطلب، نخرج ولكن الـ finally ستضمن تحويل isLoading إلى false
      if (!res || !res.success) return false

      user.value = res.data
      
      return res.data
    } catch (err: any) {
      console.error(err)
      const status = err?.status || err?.statusCode || err?.response?.status
      const errorData = err?.data || err?.response?._data
      if (status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE') {
        subscriptionInactive.value = true
      }
      return false
    } finally {
      isLoading.value = false // 🌟 تضمن عودتها false دائماً مهما حدث داخل الـ try
    }
  }



  /** Called after a successful login (the profile comes from GET /api/user: it has the restaurant info) */
    /** Called after a successful login (the profile comes from GET /api/user: it has the restaurant info) */
  async function login(email: string, password: string) {
    const res = await $fetch<{ data: { accessToken: string } }>(`${apiBase()}/api/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })

    accessToken.value = res.data.accessToken
    isLoading.value = true
    try {
      const profile = await loadProfile()

      if (!profile) return false

      if (user.value) {
        user.value.accessToken = res.data.accessToken
      }

      setSessionCookie()
      return profile
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
      await $fetch(`${apiBase()}/api/auth/logout`, { method: 'POST', credentials: 'include' })

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
  let initPromise: Promise<void> | null = null
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
        const r = await $fetch<{success: boolean, data: string }>(`${apiBase()}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          timeout: 5000, // تقليل المهلة إلى 5 ثوانٍ لسرعة الاستجابة
        })

        if (!r || !r.success) return

        accessToken.value = r.data
        await loadProfile()
        setSessionCookie()
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