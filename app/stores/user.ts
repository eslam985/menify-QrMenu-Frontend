import type {
  ChangePasswordType,
  GetSessionsQueryType,
  UpdateUserByIdType,
} from "@/schemas/userSchema/userSchema";
import { useUserService } from "@/services/userService";
import type { SessionResponse } from "@/types/userType/userType";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const notiStore = useNotificationStore();
  const confirmStore = useConfirmStore();
  const userService = useUserService();
  const authStore = useAuthStore();

  const successMessage = ref("");
  const errorMessage = ref("");
  const isLoading = ref(false);

  const sessions = ref<SessionResponse[]>([]);

  async function findUserById() {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.findUserById();

      if (!res || !res.success) return false;

      if (authStore.user && res.data) {
        authStore.user = { ...authStore.user, ...res.data };
      }

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

  async function updateUserInfo(body: UpdateUserByIdType["body"]) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.updateUserInfo(body);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      if (authStore.user && res.data) {
        authStore.user = { ...authStore.user, ...res.data };
      }

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
  async function changePassword(body: ChangePasswordType["body"]) {
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

  async function getSessionsByUserId(query: GetSessionsQueryType["query"]) {
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.getSessionsByUserId(query);

      if (!res || !res.success) return false;

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
      const isConfirmed = await confirmStore.ask(
        "هل انت متأكد من حذف هذة الجلسة ؟",
      );
      if (!isConfirmed) return false;

      const res = await userService.removeSessionById(sessionId);

      if (!res || !res.success) return false;

      successMessage.value = res.message;

      notiStore.show(successMessage.value, "success");

      const index = sessions.value.findIndex((s) => s.id === sessionId);

      if (index !== -1) {
        sessions.value = sessions.value.splice(index, 1);
      }

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

      if (!res || !res.success || !res.data) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      if (authStore.user) {
        authStore.user.avatar_url = res.data.avatar_url;
        authStore.user.avatar_history = res.data.avatar_history;
      }

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
    const isConfirmed = await confirmStore.ask(
      "هل انت متأكد من حذف هذة الصورة ؟",
    );
    if (!isConfirmed) return false;
    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await userService.deleteAvatar();

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      if (authStore.user) authStore.user.avatar_url = res.data.avatar_url;

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

      if (authStore.user) {
        authStore.user.avatar_url = res.data.avatar_url;
        authStore.user.avatar_history = res.data.avatar_history;
      }

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
