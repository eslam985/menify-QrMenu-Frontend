// server/__sitemap__/urls.ts
import type { BaseApiResponse } from "~/types/globalTypes";
import type { PublicRestaurantListItem } from "~/types/dataType/publicMenuType";

export default defineSitemapEventHandler(async () => {
  try {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase.startsWith("http")
      ? config.public.apiBase
      : "https://menify-qr-menu-backend.vercel.app/api";

    const response = await $fetch<BaseApiResponse<PublicRestaurantListItem[]>>(
      `${apiBase}/public/restaurants`,
    );

    if (!response?.success || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((restaurant) => ({
      loc: `/menu/${restaurant.slug}`,
      changefreq: "daily" as const,
      priority: 0.9,
      images: restaurant.logo_url
        ? [
            {
              loc: restaurant.logo_url,
              title: restaurant.name,
            },
          ]
        : [],
    }));
  } catch (err) {
    console.error("Sitemap fetch error:", err);
    return [];
  }
});
