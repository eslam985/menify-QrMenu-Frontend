import type {
  ChangePasswordType,
  GetSessionsQueryType,
  UpdateUserByIdType,
} from "@/schemas/userSchema/userSchema";
import { useUserService } from "@/services/userService";
import type { SessionResponse } from "@/types/userType/userType";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const confirmStore = useConfirmStore();
  const userService = useUserService();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const isSaving = ref(false);
  const isLoaded = ref(false);

  const sessions = ref<SessionResponse[]>([]);

  async function findUserById(force = false) {
    if (isLoading.value) return false;
    if (!force && isLoaded.value) return true;
    isLoading.value = true;
    try {
      const res = await userService.findUserById();

      if (!res || !res.success || !authStore.user || !res.data) return false;

      authStore.user = { ...authStore.user, ...res.data };

      isLoaded.value = true;
      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل جلب بيانات المستخدم !");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateUserInfo(body: UpdateUserByIdType["body"]) {
    if (
      isSaving.value ||
      typeof body !== "object" ||
      Object.keys(body).length < 1
    )
      return false;

    isSaving.value = true;
    try {
      const res = await userService.updateUserInfo(body);

      const errMsg = "فشل تحديث البيانات ";
      const successMsg = "تم تحديث البيانات بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      if (!authStore.user) return false;
      authStore.user = { ...authStore.user, ...res.data };

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل تحديث البيانات ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }
  async function changePassword(body: ChangePasswordType["body"]) {
    if (
      isSaving.value ||
      typeof body !== "object" ||
      Object.keys(body).length < 1
    )
      return false;

    const msg = `هل انت متأكد من تغير كلمة المرور الحالية \n
  (سيتم تسجيل الخروج من كل الاجهزة النشظه بما في ذلك هذا الجهاز)`;
    const isConfirmed = await confirmStore.ask(msg);
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await userService.changePassword(body);

      const errMsg = "فشل تحديث كلمة المرور !";
      const successMsg = "تم تحديث كلمة المرور بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg, false);
      if (!isRes) return false;

      reloadNuxtApp();
      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل تحديث كلمة المرور !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function getSessionsByUserId(query?: GetSessionsQueryType["query"]) {
    isLoading.value = true;
    try {
      const res = await userService.getSessionsByUserId(query ?? {});

      if (!res || !res.success) return false;

      sessions.value = res.data;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل جلب الجلسات!");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeSessionById(sessionId: string) {
    if (isSaving.value || !sessionId) return false;

    const msg = "هل انت متأكد من حذف هذة الجلسة ؟";
    const isConfirmed = await confirmStore.ask(msg);
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await userService.removeSessionById(sessionId);

      const errMsg = "فشل حذف الجلسه !";
      const successMsg = "تم حذف الجلسة بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg, false);
      if (!isRes) return false;

      sessions.value = sessions.value.filter((s) => s.id !== sessionId);

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل حذف الجلسه !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function uploadAvatar(body: FormData) {
    if (isSaving.value || !body) return false;
    isSaving.value = true;
    try {
      const res = await userService.uploadAvatar(body);

      const errMsg = "فشل رفع الصورة !";
      const successMsg = "تم رفع الصورة بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes || !authStore.user) return false;

      authStore.user.avatar_url = res.data.avatar_url;
      authStore.user.avatar_history = res.data.avatar_history;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل رفع الصورة !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteAvatar() {
    if (isSaving.value) return false;

    const msg = "هل انت متأكد من حذف هذة الصورة ؟";
    const isConfirmed = await confirmStore.ask(msg);
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await userService.deleteAvatar();

      const errMsg = "فشل حذف الصورة !";
      const successMsg = "تم حذف الصورة بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes || !authStore.user) return false;

      authStore.user.avatar_url = res.data.avatar_url;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل حذف الصورة !");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function setAvatarFromHistory(chosenAvatarUrl: string) {
    if (isSaving.value || !chosenAvatarUrl) return false;

    isSaving.value = true;
    try {
      const res = await userService.setAvatarFromHistory(chosenAvatarUrl);

      const errMsg = "فشل استرجاع الصورة!";
      const successMsg = "تم تغيير الصورة الشخصية بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes || !authStore.user) return false;

      authStore.user.avatar_url = res.data.avatar_url;
      authStore.user.avatar_history = res.data.avatar_history;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل استرجاع الصورة ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    isLoading,
    isSaving,
    sessions,
    isLoaded,
    findUserById,
    updateUserInfo,
    changePassword,
    getSessionsByUserId,
    removeSessionById,
    uploadAvatar,
    deleteAvatar,
    setAvatarFromHistory,
  };
});
// 230
