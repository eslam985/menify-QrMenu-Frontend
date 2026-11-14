import { SESSION_COOKIE_NAME } from "~/constants/auth";

export const useSessionCookie = () => {
  const sessionCookie = useCookie<string | null>(SESSION_COOKIE_NAME, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
  });

  const hasSessionCookie = (): boolean => !!sessionCookie.value;
  const setSessionCookie = () => {
    sessionCookie.value = "1";
  };
  const removeSessionCookie = () => {
    sessionCookie.value = null;
  };

  return {
    hasSessionCookie,
    setSessionCookie,
    removeSessionCookie,
  };
};
