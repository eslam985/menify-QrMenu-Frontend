// app/middleware/auth.ts

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return; // the session lives in the browser memory

  const auth = useAuthStore();
  await auth.init(); // restores the session after F5 (no-op when already initialized)

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
