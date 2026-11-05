// Menify/frontend/app/stores/user.ts
import { defineStore } from "pinia";
import { useUserService } from "@/services/userService";

export const useUserStore = defineStore("user", () => {
  const notiStore = useNotificationStore();
  const userService = useUserService();
  const confirmStore = useConfirmStore()
  const successMessage = ref("");
  const errorMessage = ref("");
  const isLoading = ref(false);
  const userInfo = ref<{
    avatar_url?: string;
    avatar_history?: string[];
    roles?: unknown;
    username?: string;
    email?: string;
    created_at?: string
  }>({});
  const sessions = ref([]);

  async function findUserById() {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.findUserById();

      if (!res || !res.success) return false;

      userInfo.value = res.data;

      return res.data;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateUserInfo(body: { username?: string; email?: string }) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.updateUserInfo(body);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      userInfo.value = res.data;

      return res.data;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  async function changePassword(body: {
    currentPassword: string;
    newPassword: string;
  }) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.changePassword(body);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function getSessionsByUserId(query: unknown) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.getSessionsByUserId(query);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      sessions.value = res.data;

      return res.data;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeSessionById(sessionId: string) {

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    
    try {
      const isConfirmed = await  confirmStore.ask('هل انت متأكد من حذف هذة الجلسة ؟');
      if (!isConfirmed) return false
      
      const res = await userService.removeSessionById(sessionId);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadAvatar(body: FormData) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.uploadAvatar(body);

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      userInfo.value.avatar_url = res.data.avatar_url;
      userInfo.value.avatar_history = res.data.avatar_history;

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAvatar() {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {

      const isConfirmed = await  confirmStore.ask('هل انت متأكد من حذف هذة الصورة ؟');
      if (!isConfirmed) return false

      const res = await userService.deleteAvatar();

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      userInfo.value.avatar_url = res.data.avatar_url;

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function setAvatarFromHistory(chosenAvatarUrl: string) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.setAvatarFromHistory(chosenAvatarUrl);

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      userInfo.value.avatar_url = res.data.avatar_url;
      userInfo.value.avatar_history = res.data.avatar_history;

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    successMessage,
    errorMessage,
    userInfo,
    sessions,
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
