export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const auth = useAuthStore();
  await auth.init();

  if (auth.subscriptionInactive) {
    if (to.path === "/subscription-inactive") return;
    return navigateTo("/subscription-inactive");
  }

  if (!auth.isAuthenticated) {
    if (to.path.startsWith("/auth/")) return;
    return navigateTo({
      path: "/auth/login",
      query: { redirect: to.fullPath },
    });
  }

  const required = to.meta.requiredRole;
  if (required && !auth.hasRole(required)) {
    if (to.path === "/dashboard") return;
    return navigateTo("/dashboard");
  }
});
