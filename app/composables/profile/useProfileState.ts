import { storeToRefs } from "pinia";

import type { SessionResponse } from "@/types/userType/userType";
import { useTable } from "~/composables/useTable";

export const useProfileState = () => {
  const { setTableConfig } = useTable();

  const notiStore = useNotificationStore();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const { sessions, isLoading } = storeToRefs(userStore);

  const selectedFile = ref<File | null>(null);
  const avatarPreview = ref<string | null>(null);
  const isDropdownOpen = ref<boolean>(false);
  const isModalOpen = ref<boolean>(false);
  const DEFAULT_AVATAR: string =
    "https://res.cloudinary.com/dbahqgo8j/image/upload/blogger/iaeclevshfanh5j6x9ew.webp";

  const sessionTableColumns = [
    { key: "device_info", label: "الجهاز / المتصفح" },
    { key: "ip_address", label: "عنوان الـ IP" },
    { key: "created_at", label: "تاريخ انشاء الجلسه" },
    { key: "updated_at", label: "اخر تحديث" },
    { key: "expires_at", label: "تاريخ انتهاء الجلسه" },
    { key: "status", label: "الحالة" },
    { key: "actions", label: "الإجراءات الأمنية" },
  ];

  const parseUserAgent = (ua: SessionResponse["user_agent"]) => {
    if (!ua) return "جهاز غير معروف";

    if (ua.includes("Windows")) return "Windows • Chrome";
    if (ua.includes("Linux") && !ua.includes("Android"))
      return "Linux • Chrome / Firefox";
    if (ua.includes("Macintosh")) return "Mac • Safari";
    if (ua.includes("iPhone")) return "iPhone • Safari";
    if (ua.includes("Android")) {
      const match = ua.match(/\(([^;]+);([^;]+);([^)]+)\)/);
      return match ? `Android • ${match[1]?.trim()}` : "Android Device";
    }

    return "جهاز غير معروف";
  };

  const isCurrentSession = (session: SessionResponse) => {
    if (!import.meta.client) return false;

    const isUAMatch = session.user_agent === navigator.userAgent;

    if (sessions.value.length === 1) return isUAMatch;

    const isMostRecent =
      session.id ===
      sessions.value.reduce<SessionResponse>(
        (max, s) =>
          new Date(s.updated_at) > new Date(max.updated_at) ? s : max,
        sessions.value[0] as SessionResponse,
      ).id;

    return isUAMatch && isMostRecent;
  };

  const handleRevokeSession = async (sessionId: string) => {
    if(!sessionId) return

    await userStore.removeSessionById(sessionId);
  };

  const handleFileChange = (event: Event) => {
    if (!event) return;

    const file: File | undefined = (event.target as HTMLInputElement | null)
      ?.files?.[0];
      
    if (!file) return;

    selectedFile.value = file;

    avatarPreview.value = URL.createObjectURL(file);
  };

  const handleUpload = async (): Promise<void | null> => {
    if (!selectedFile.value) return null;

    const formData: FormData = new FormData();
    formData.append("profileImage", selectedFile.value);

    await userStore.uploadAvatar(formData);

    selectedFile.value = null;
  };

  const handleDelete = async () => {
    await userStore.deleteAvatar();
  };

  const handleSelectHistory = async (
    url: string,
  ): Promise<null | undefined> => {
    const isSuccess = await userStore.setAvatarFromHistory(url);

    if (!isSuccess) {
      return null;
    } else {
      isModalOpen.value = false;
      await userStore.findUserById();
    }

    return null;
  };

  const role = (): "Admin" | "Editor" | "User" | "N/A" =>
    authStore.user?.roles === "5150"
      ? "Admin"
      : authStore.user?.roles === "1984"
        ? "Editor"
        : authStore.user?.roles === "2001"
          ? "User"
          : "N/A";

  return {
    isLoading,
    sessions,
    userStore,
    authStore,
    selectedFile,
    avatarPreview,
    isDropdownOpen,
    isModalOpen,
    DEFAULT_AVATAR,
    sessionTableColumns,
    notiStore,
    handleFileChange,
    handleUpload,
    handleDelete,
    handleSelectHistory,
    role,
    setTableConfig,
    parseUserAgent,
    isCurrentSession,
    handleRevokeSession,
  };
};
