export const handleGlobalError = (
  err: unknown,
  fallbackMessage: string,
  showNotification = true,
): { status?: number; message: string; code?: string } => {
  const error = (typeof err === "object" && err !== null ? err : {}) as {
    status?: number;
    statusCode?: number;
    response?: {
      status?: number;
      _data?: {
        code?: string;
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
    data?: {
      code?: string;
      message?: string;
      errors?: Record<string, string[]>;
    };
  };

  const status = error.status || error.statusCode || error.response?.status;
  const errorData = error.data || error.response?._data;

  let finalMsg = errorData?.message || fallbackMessage;

  if (!status) finalMsg = "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت";
  if (status === 429) finalMsg = "محاولات كثيرة، حاول مرة أخرى بعد قليل";

  const fieldErrors = errorData?.errors;
  if (fieldErrors && typeof fieldErrors === "object") {
    const firstMessage = Object.values(fieldErrors).flat()[0];
    if (firstMessage) finalMsg = String(firstMessage);
  }

  if (import.meta.client && showNotification) {
    const notiStore = useNotificationStore();
    notiStore.show(finalMsg, "error");
  }

  console.error("[API Error]:", err);

  return {
    ...(status !== undefined && { status }),
    message: finalMsg,
    ...(errorData?.code !== undefined && { code: errorData.code }),
  };
};
