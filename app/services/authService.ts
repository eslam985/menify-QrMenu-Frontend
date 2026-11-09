// Menify/frontend/app/services/authService.ts
import type {
  LoginUserType,
  RegisterRestaurantType,
} from "@/schemas/userSchema/userSchema";
import type { BaseApiResponse } from "@/types/globalTypes";
import type {
  UserProfileResponse,
  UserResponse,
} from "@/types/userType/userType";

export const useAuthService = () => {
  const config = useRuntimeConfig(); // top of setup, not after an await
  const apiBase = () => config.public.apiBase;

  async function findUserById(accessToken: string) {
    const res = await $fetch<
      Promise<BaseApiResponse<UserProfileResponse | null>>
    >(`${apiBase()}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    return res;
  }

  async function login(body: LoginUserType["body"]) {
    const res = await $fetch<Promise<BaseApiResponse<UserProfileResponse>>>(
      `${apiBase()}/auth/login`,
      {
        method: "POST",
        body,
        credentials: "include",
      },
    );

    return res;
  }

  async function logout() {
    const res = await $fetch<Promise<BaseApiResponse<unknown | null>>>(
      `${apiBase()}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    return res;
  }

  async function init() {
    const res = await $fetch<Promise<BaseApiResponse<string | null>>>(
      `${apiBase()}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
        timeout: 5000, // تقليل المهلة إلى 5 ثوانٍ لسرعة الاستجابة
      },
    );

    return res;
  }

  // داخل app/services/authService.ts
  async function register(body: RegisterRestaurantType["body"]) {
    const res = await $fetch<
      Promise<
        BaseApiResponse<{
          user: UserResponse;
          restaurant: { name: string; slug: string };
        }>
      >
    >(`${apiBase()}/auth/register`, {
      method: "POST",
      body,
      credentials: "include",
    });

    return res;
  }

  return {
    findUserById,
    login,
    logout,
    init,
    register,
  };
};
