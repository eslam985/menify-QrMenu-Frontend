// Menify/frontend/app/services/authService.ts
import type { UserProfileResponse } from '@/types/userType/userType'
import type { LoginUserType } from "@/schemas/userSchema/userSchema";
import type { BaseApiResponse } from '@/types/globalTypes'

export const useAuthService = () => {
  const config = useRuntimeConfig() // top of setup, not after an await
  const apiBase = () => config.public.apiBase

  async function findUserById(accessToken: string) {

      const res = await $fetch<Promise<BaseApiResponse<UserProfileResponse  | null>>>(`${apiBase()}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      })

      return res 
  }

  async function login(body: LoginUserType['body']) {

    const res = await $fetch<Promise<BaseApiResponse<UserProfileResponse>>>(`${apiBase()}/auth/login`, {
      method: 'POST',
      body,
      credentials: 'include',
    })

    return res 
  }

  async function logout() {
    const res = await $fetch(`${apiBase()}/auth/logout`, { method: 'POST', credentials: 'include' })

    return res 
  }

  async function init() {
    const res = await $fetch<Promise<BaseApiResponse<string | null>>>(`${apiBase()}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      timeout: 5000, // تقليل المهلة إلى 5 ثوانٍ لسرعة الاستجابة
    })

    return res 
  }

  
  return {
    findUserById,
    login,
    logout,
    init
  }

}