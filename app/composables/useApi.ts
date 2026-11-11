import { handleGlobalError } from "~/utils/apiError";

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = (apiBase: string): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = $fetch<{ data: string }>(`${apiBase}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((r) => r.data)
    .catch(() => null)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const useApi = () => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const notiStore = useNotificationStore();
  const authStore = useAuthStore();

  const base = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: "include",

    onRequest({ options }) {
      if (authStore.accessToken) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${authStore.accessToken}`);
        options.headers = headers;
      }
    },

    onResponseError({ response }) {
      const status = response.status;
      const errorMsg = response?._data?.message;
      const errorDAta = response?._data;

      if (status === 429) {
        const retryAfterHeader =
          response.headers.get("retry-after") ||
          response.headers.get("Retry-After");

        const retryAfter = parseInt(retryAfterHeader || "60", 10) || 60;
        const mins = Math.ceil(retryAfter / 60);

        const msg =
          errorMsg ||
          `طلبات كثيرة جداً - برجاء المحاولة مرة أخرى بعد ${mins} دقائق`;

        notiStore.show(msg, "error");

        return;
      }

      if (status === 404) {
        const msg = errorMsg || "عذراً، لم نتمكن من العثور على ما تبحث عنه.";
        notiStore.show(msg, "error");

        return;
      }

      if (status === 413) {
        const msg = errorMsg || "حجم الملف المرفوع كبير جداً!";
        notiStore.show(msg, "error");

        return;
      }

      if (status === 504) {
        const msg =
          errorMsg ||
          "انتهت مهلة الاتصال بالخادم، العملية استغرقت وقتاً طويلاً.";
        notiStore.show(msg, "error");

        return;
      }

      if (status === 503) {
        const msg = errorMsg || "حدثت مشكلة في الاتصال من جانبنا جرب مرة اخري";
        notiStore.show(msg, "error");

        return;
      }

      if (status !== 401 && status !== 403) {
        const fakeErrorContext = {
          status,
          data: errorDAta,
        };

        const msg = errorMsg || "حدث خطأ أثناء تنفيذ العملية";
        handleGlobalError(fakeErrorContext, msg);
      }
    },
  });

  const apiFetch = async <T = unknown>(
    url: string,
    opts: Record<string, unknown> = {},
  ): Promise<T> => {
    try {
      return await base<T>(url, opts);
    } catch (err: unknown) {
      const { status, code } = handleGlobalError(err, "", false);

      if (status === 403 && code === "SUBSCRIPTION_INACTIVE") {
        authStore.subscriptionInactive = true;

        await navigateTo("/subscription-inactive");

        return undefined as T;
      }

      if (status !== 401 || url.includes("/auth/")) throw err;

      const token = await refreshAccessToken(config.public.apiBase);

      if (!token) {
        authStore.clearSession();

        if (!route.path.startsWith("/auth/")) {
          await navigateTo({
            path: "/auth/login",
            query: { redirect: route.fullPath },
          });
        }

        throw err;
      }

      authStore.accessToken = token;

      return await base<T>(url, opts);
    }
  };

  return { apiFetch };
};
