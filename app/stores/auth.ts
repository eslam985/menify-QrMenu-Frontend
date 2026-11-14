import { defineStore } from "pinia";

import type {
  LoginUserType,
  RegisterRestaurantType,
} from "@/schemas/userSchema/userSchema";
import { useAuthService } from "@/services/authService";
import type { UserProfileResponse } from "@/types/userType/userType";

import { RolesList } from "~/constants/auth";
import { useSessionCookie } from "~/composables/auth/useSessionCookie";
import { handleGlobalError, mapRegisterError } from "~/utils/apiError";

export const useAuthStore = defineStore("auth", () => {
  const authService = useAuthService();

  const notiStore = useNotificationStore();
  const { hasSessionCookie, setSessionCookie, removeSessionCookie } =
    useSessionCookie();

  const user = ref<UserProfileResponse | null>(null);
  const accessToken = ref<string | null>(null);
  const isInitialized = ref(false);
  const subscriptionInactive = ref(false);
  const isLoading = ref(false);
  const isLoaded = ref(false);
  const isSaving = ref(false);

  const errorMessage = ref("");
  const successMessage = ref("");
  const userRole = computed(() =>
    user.value ? Number(user.value.roles) : null,
  );

  function resetState() {
    errorMessage.value = "";
    successMessage.value = "";
  }

  const restaurantId = computed(() => user.value?.restaurant_id ?? null);
  const restaurantSlug = computed(() => user.value?.restaurant_slug ?? null);
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => userRole.value === RolesList.Admin);
  const isEditorAndAbove = computed(
    () =>
      userRole.value === RolesList.Editor || userRole.value === RolesList.Admin,
  );

  const hasRole = computed(() => (required: number): boolean => {
    if (!userRole.value) return false;
    if (required === RolesList.Admin) return userRole.value === RolesList.Admin;
    if (required === RolesList.Editor) return isEditorAndAbove.value;
    return true;
  });
  /**
   * Verifies if the user meets the required role permission.
   * Displays an error notification and returns `false` if unauthorized.
   *
   * @param hasPermission - Boolean computed flag (e.g., `authStore.isEditorAndAbove`)
   * @param roleName - Optional human-readable role label to display in the error message
   * @returns `true` if authorized, otherwise `false`
   */
  function checkRole(hasPermission: boolean, roleName?: string): boolean {
    if (!hasPermission) {
      const msg = roleName
        ? `هذا الإجراء يتطلب صلاحية (${roleName}) أو أعلى!`
        : "هذا الإجراء غير مصرح لك حالياً";

      notiStore.show(msg, "error");
      return false;
    }

    return true;
  }

  function clearSession() {
    user.value = null;
    accessToken.value = null;
    subscriptionInactive.value = false;
    isInitialized.value = true;
    removeSessionCookie();
  }

  async function loadProfile(force = false) {
    if (!force && isLoaded.value) return true;
    if (!accessToken.value) return false;
    resetState();
    try {
      const res = await authService.findUserById(accessToken.value);

      if (!res || !res.success || !res.data) return false;

      user.value = res.data;
      isLoaded.value = true;
      return res.data;
    } catch (err: unknown) {
      const { status, code } = handleGlobalError(
        err,
        "فشل تحميل الملف الشخصي",
        false,
      );

      if (status === 403 && code === "SUBSCRIPTION_INACTIVE") {
        subscriptionInactive.value = true;
      }

      return false;
    }
  }

  async function register(payload: RegisterRestaurantType["body"]) {
    if (isSaving.value) return false;

    resetState();
    isSaving.value = true;
    try {
      const res = await authService.register(payload);

      if (!res) return false;

      const { success, data, message } = res;

      if (!success || !data) return false;

      successMessage.value = message;

      return res.success;
    } catch (err: unknown) {
      const { status, message } = handleGlobalError(
        err,
        "فشل عملية التسجيل",
        false,
      );
      errorMessage.value = mapRegisterError(status, message);
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function login(body: LoginUserType["body"]) {
    const isNotValid =
      typeof body !== "object" || Object.keys(body)?.length < 2;
    if (isSaving.value || isNotValid) return false;

    successMessage.value = "";
    errorMessage.value = "";
    isSaving.value = true;
    isLoading.value = true;
    try {
      const res = await authService.login(body);

      if (!res) return false;

      const { data, success, message } = res;

      if (!data || !success) return false;

      successMessage.value = message;
      accessToken.value = data.accessToken ?? null;
      user.value = data;

      setSessionCookie();
      await loadProfile();
      return success;
    } catch (err: unknown) {
      const { status, code, message } = handleGlobalError(
        err,
        "فشل تسجيل الدخول",
        false,
      );

      const inactive = status === 403 && code === "SUBSCRIPTION_INACTIVE";

      clearSession();

      if (inactive) {
        subscriptionInactive.value = true;
      } else {
        errorMessage.value = message || "حدث خطأ اثناء تسجيل الدخول";
        notiStore.show(errorMessage.value, "error");
      }

      return false;
    } finally {
      isSaving.value = false;
      isLoading.value = false;
      isInitialized.value = true;
    }
  }

  async function logout() {
    if (isSaving.value) return false;
    resetState();
    isSaving.value = true;

    try {
      const res = await authService.logout();

      if (!res) return false;

      successMessage.value = res.message || "تم تسجيل الخروج بنجاح";
      notiStore.show(successMessage.value, "success");
      return res.success ?? true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      isSaving.value = false;
      clearSession();
      if (import.meta.client) {
        window.location.href = "/auth/login";
      } else {
        await navigateTo("/auth/login");
      }
    }
  }

  let initPromise: Promise<void> | null = null;
  function init(): Promise<void> {
    if (isInitialized.value) return Promise.resolve();

    if (import.meta.server) return Promise.resolve();

    if (!hasSessionCookie()) {
      isInitialized.value = true;
      return Promise.resolve();
    }

    if (initPromise) return initPromise;

    initPromise = (async () => {
      isLoading.value = true;
      try {
        const r = await authService.init();
        if (!r || !r.success || !r.data) {
          clearSession();
          return;
        }

        accessToken.value = r.data;
        const res = await loadProfile();

        if (!res) {
          clearSession();
          return;
        }

        setSessionCookie();
      } catch (err: unknown) {
        const { status, code } = handleGlobalError(
          err,
          "فشل تهيئة الجلسة",
          false,
        );
        const inactive = status === 403 && code === "SUBSCRIPTION_INACTIVE";

        clearSession();
        if (inactive) {
          subscriptionInactive.value = true;
        }
      } finally {
        isLoading.value = false;
        isInitialized.value = true;

        initPromise = null;
      }
    })();

    return initPromise;
  }

  return {
    user,
    accessToken,
    isInitialized,
    subscriptionInactive,
    isLoading,
    isLoaded,
    isSaving,
    errorMessage,
    successMessage,
    userRole,
    restaurantId,
    restaurantSlug,
    isAuthenticated,
    isAdmin,
    isEditorAndAbove,
    hasRole,
    resetState,
    login,
    logout,
    init,
    clearSession,
    loadProfile,
    register,
    checkRole,
  };
});
