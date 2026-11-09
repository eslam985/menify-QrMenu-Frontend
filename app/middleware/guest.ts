// app/middleware/guest.ts

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const auth = useAuthStore();
  await auth.init();

  if (auth.isAuthenticated) {
    if (to.path === "/dashboard") return;
    return navigateTo("/dashboard");
  }
});
