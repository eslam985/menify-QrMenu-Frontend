/**
 * Composable مركزي لهوية البراند وبيانات الموقع
 * يتيح تغيير اسم البراند والروابط من مكان واحد (عبر RuntimeConfig أو متغيرات البيئة)
 */
export const useBrand = () => {
  const config = useRuntimeConfig();

  const siteName = (config.public.siteName as string) || "Tabloz";
  const siteUrl =
    (config.public.siteUrl as string) ||
    (config.public.nuxtPublicSiteUrl as string) ||
    "https://tabloz-bice.vercel.app";

  const supportTelegram = String(config.public.supportTelegram || "");
  const supportWhatsapp = String(config.public.supportWhatsapp || "");
  const supportEmail = String(config.public.supportEmail || "");
  const supportFacebook = String(config.public.supportFacebook || "");

  // الحرف الأول من اسم البراند للأيقونات والشعارات المختصرة
  const firstLetter = siteName.charAt(0).toUpperCase();

  return {
    siteName,
    siteUrl,
    firstLetter,
    supportTelegram,
    supportWhatsapp,
    supportEmail,
    supportFacebook,
  };
};
