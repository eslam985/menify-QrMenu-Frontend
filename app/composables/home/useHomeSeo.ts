import { useBrand } from "~/composables/useBrand";

/**
 * Composable مخصص لإدارة السيو والبيانات المنظمة (Schema.org) للصفحة الرئيسية
 * يستمد هوية البراند والروابط تلقائياً من useBrand بدون أي هاردكود
 */
export const useHomeSeo = () => {
  const { siteName, siteUrl } = useBrand();

  const site = {
    name: siteName,
    title: `${siteName} | منيو إلكتروني ذكي للمطاعم والكافيهات عبر QR كود`,
    description: `ودّع المنيوهات الورقية، وابدأ المستقبل مع ${siteName}. أنشئ منيو إلكتروني تفاعلي لمطعمك أو الكافيه الخاص بك مع QR كود دائم ولوحة تحكم لحظية.`,
    ogTitle: `${siteName} - منيو إلكتروني ذكي للمطاعم والكافيهات`,
    ogDescription:
      "منيو إلكتروني تفاعلي عبر QR كود مع حاسبة فاتورة ذكية ولوحة تحكم كاملة لتعديل الأسعار والأصناف في ثوانٍ.",
    url: siteUrl,
  };

  // 1. التحقق من ملكية الموقع في Google Search Console
  useHead({
    meta: [
      {
        name: "google-site-verification",
        content: "rYTEb-Ob4kJMCp7tqf-aoMBDK9BpigLTl4n2T_h6WK8",
      },
    ],
  });

  // 2. وسوم الميتا ومشاركة الروابط في شبكات التواصل الاجتماعي
  useSeoMeta({
    title: site.title,
    description: site.description,
    ogTitle: site.ogTitle,
    ogDescription: site.ogDescription,
    ogType: "website",
    ogLocale: "ar_AR",
    ogUrl: site.url,
    twitterCard: "summary_large_image",
  });

  // 3. البيانات المنظمة (Schema.org) لمنصة البرمجيات والموقع
  useSchemaOrg([
    defineWebSite({
      name: site.name,
      description: `منصة إنشاء وإدارة المنيو الإلكتروني الذكي للمطاعم والكافيهات عبر ${site.name}.`,
      inLanguage: "ar",
    }),
    {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EGP",
        description: "تجربة مجانية لأول شهر بالكامل",
      },
    },
  ]);
};
