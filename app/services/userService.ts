import type {
  ChangePasswordType,
  GetSessionsQueryType,
  UpdateUserByIdType,
} from "@/schemas/userSchema/userSchema";
import type {
  SessionResponse,
  SetAndUpdateAvatarUrlResponse,
  UserProfileResponse,
  UserResponse,
} from "@/types/userType/userType";

import { DEFAULT_AVATAR } from "@/utils/constants";

export const useUserService = () => {
  const { apiFetch } = useApi();

  return {
    async findUserById() {
      const res = await apiFetch<BaseApiResponse<UserProfileResponse | null>>(
        "/user",
        {
          method: "get",
        },
      );

      return res;
    },

    async updateUserInfo(body: UpdateUserByIdType["body"]) {
      const res = await apiFetch<BaseApiResponse<UserResponse | null>>(
        "/user",
        {
          method: "patch",
          body,
        },
      );

      return res;
    },

    async changePassword(body: ChangePasswordType["body"]) {
      const res = await apiFetch<BaseApiResponse>("/user/password", {
        method: "patch",
        body,
      });

      return res;
    },

    async getSessionsByUserId(query: GetSessionsQueryType["query"]) {
      const res = await apiFetch<BaseApiResponse<SessionResponse[]>>(
        "/user/sessions",
        {
          method: "get",
          query,
        },
      );

      return res;
    },

    async removeSessionById(sessionId: string) {
      const res = await apiFetch<BaseApiResponse>(
        `/user/sessions/${sessionId}`,
        {
          method: "delete",
          sessionId,
        },
      );

      return res;
    },

    async uploadAvatar(body: FormData) {
      const res = await apiFetch<
        BaseApiResponse<SetAndUpdateAvatarUrlResponse | null>
      >("/avatar", {
        method: "post",
        body,
      });

      return res;
    },

    async deleteAvatar() {
      const res = await apiFetch<
        BaseApiResponse<{ avatar_url: typeof DEFAULT_AVATAR }>
      >("/avatar", {
        method: "delete",
      });

      return res;
    },

    async setAvatarFromHistory(chosenAvatarUrl: string) {
      const res = await apiFetch<
        BaseApiResponse<SetAndUpdateAvatarUrlResponse>
      >("/avatar/previous", {
        method: "patch",
        body: chosenAvatarUrl,
      });

      return res;
    },
  };
};
