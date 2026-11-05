// Menify/frontend/app/services/userService.ts
export const useUserService = () => {
  const { apiFetch } = useApi();

  return {
    async findUserById() {
      const res = await apiFetch("/user", {
        method: "get",
      });

      return res;
    },

    async updateUserInfo(body: { username?: string; email?: string }) {
      const res = await apiFetch("/user", {
        method: "patch",
        body,
      });

      return res;
    },

    async changePassword( body: { currentPassword: string; newPassword: string; } ) {
      const res = await apiFetch("/user/password", {
        method: "patch",
        body,
      });

      return res;
    },

    async getSessionsByUserId(query: unknown) {
      const res = await apiFetch("/user/sessions", {
        method: "get",
        query,
      });

      return res;
    },

    async removeSessionById(sessionId: string) {
      const res = await apiFetch(`/user/sessions/${sessionId}`, {
        method: "delete",
        sessionId,
      });

      return res;
    },

    async uploadAvatar(body: FormData) {
      const res = await apiFetch("/avatar", {
        method: "post",
        body,
      });

      return res;
    },

    async deleteAvatar() {
      const res = await apiFetch("/avatar", {
        method: "delete",
      });

      return res;
    },

    async setAvatarFromHistory(chosenAvatarUrl: string) {
      const res = await apiFetch("/avatar/previous", {
        method: "patch",
        body: { chosenAvatarUrl },
      });

      return res;
    },
  };
};
