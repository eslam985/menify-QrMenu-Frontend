import type { ComputedRef, Ref } from "vue";
import type {
  PublicRestaurantInfo,
  PublicMenuCategory,
} from "~/types/dataType/publicMenuType";
import { toIsoCurrency } from "~/constants/currency";
import { useBrand } from "~/composables/useBrand";

/**
 * Composable مخصص لإدارة السيو والبيانات المنظمة (Schema.org) لصفحة المنيو العامة
 * يعالج مشكلة الـ Soft 404، يضمن التفاعلية الكاملة عند التنقل بين المطاعم،
 * ويلتزم بمعايير ISO 4217 للعملات في محركات البحث.
 */
export const useMenuSeo = (
  restaurant:
    Ref<PublicRestaurantInfo | null> | ComputedRef<PublicRestaurantInfo | null>,
  categories: Ref<PublicMenuCategory[]> | ComputedRef<PublicMenuCategory[]>,
  notFound: Ref<boolean> | ComputedRef<boolean>,
) => {
  const { siteName } = useBrand();

  // 1. معالجة حالة الـ 404 على السيرفر فقط (Server-side Only) لمنع مشكلة Soft 404
  if (import.meta.server) {
    try {
      const event = useRequestEvent();
      if (event && notFound.value) {
        setResponseStatus(event, 404);
      }
    } catch {
      // تفادي أي استثناء خارج سياق معالجة الطلب
    }
  }

  // 2. ضبط وسوم الميتا الأساسية والتواصل الاجتماعي (تفاعلية عبر Getters)
  useSeoMeta({
    title: () =>
      notFound.value
        ? `المنيو غير متاح | ${siteName}`
        : restaurant.value?.name
          ? `منيو ${restaurant.value.name} | ${siteName}`
          : `منيو المطعم | ${siteName}`,

    description: () =>
      notFound.value
        ? "عذراً، هذا المنيو غير متاح أو الرابط غير صحيح."
        : restaurant.value?.description ||
          `تصفح القائمة الرقمية والأسعار والعروض الخاصة بـ ${restaurant.value?.name || "المطعم"} عبر ${siteName}.`,

    ogTitle: () =>
      notFound.value
        ? "المنيو غير متاح"
        : restaurant.value?.name
          ? `منيو ${restaurant.value.name}`
          : "منيو المطعم",

    ogDescription: () =>
      notFound.value
        ? "عذراً، هذا المنيو غير متاح أو الرابط غير صحيح."
        : restaurant.value?.description ||
          "تصفح المنيو الإلكتروني واطلب بسهولة.",

    ogImage: () =>
      !notFound.value && restaurant.value?.logo_url
        ? restaurant.value.logo_url
        : undefined,
    ogType: "website",
    ogLocale: "ar_AR",
    twitterCard: "summary_large_image",
    robots: () => (notFound.value ? "noindex, nofollow" : "index, follow"),
  });

  // 3. البيانات المنظمة (Schema.org) - تفاعلية بالكامل عبر computed
  // تتحدث تلقائياً عند التنقل بين المطاعم (Client-side navigation)
  // وتلتزم بكود العملة القياسي ISO 4217 (مثل "EGP") المتوافق مع Google Rich Results
  useSchemaOrg(
    computed(() => {
      const rest = restaurant.value;
      if (!rest || notFound.value) {
        return [];
      }

      return [
        defineWebPage({
          name: `منيو ${rest.name}`,
        }),
        {
          "@type": "Restaurant",
          name: rest.name,
          description: rest.description || undefined,
          image: rest.logo_url || undefined,
          telephone: rest.phone || undefined,
          address: rest.address
            ? {
                "@type": "PostalAddress",
                streetAddress: rest.address,
              }
            : undefined,
          hasMenu: {
            "@type": "Menu",
            name: `قائمة طعام ${rest.name}`,
            hasMenuSection: categories.value.map((cat) => ({
              "@type": "MenuSection",
              name: cat.name,
              hasMenuItem: (cat.items || []).slice(0, 15).map((item) => ({
                "@type": "MenuItem",
                name: item.title,
                description: item.description || undefined,
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: toIsoCurrency(rest.currency),
                },
              })),
            })),
          },
        },
      ];
    }),
  );
};
