export const useLoginState = () => {
  const authStore = useAuthStore();
  const route = useRoute();

  const safeRedirect = (): string => {
    const r = String(route.query.redirect ?? "");

    return r.startsWith("/") && !r.startsWith("//") && !r.includes("\\")
      ? r
      : "/dashboard";
  };

  return {
    authStore,
    route,
    safeRedirect,
  };
};
