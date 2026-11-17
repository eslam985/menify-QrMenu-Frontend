<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import type { CartItem } from "~/types/dataType/menuItemType";
import { usePublicMenuState } from "~/composables/menu/usePublicMenu";
import { useShowModal } from "#imports";

const { publicMenuStore, PublicSlug, notFound, handleFetchMenu } =
  usePublicMenuState();

const { isOpen: isOpenItem, selectedData: selectedItem } =
  useShowModal("item-model");

await useAsyncData(
  () => `public-menu-${PublicSlug.value}`,
  async () => {
    await handleFetchMenu();
    return true;
  },
  { watch: [PublicSlug] },
);

// 1. السيو الديناميكي لكل مطعم (يظهر في جوجل وعند مشاركة الرابط على واتساب وفيسبوك)
useSeoMeta({
  title: () =>
    publicMenuStore.restaurant?.name
      ? `منيو ${publicMenuStore.restaurant.name} | Tabloz`
      : "منيو المطعم | Tabloz",
  description: () =>
    publicMenuStore.restaurant?.description ||
    `تصفح القائمة الرقمية والأسعار والعروض الخاصة بـ ${publicMenuStore.restaurant?.name || "المطعم"} عبر Tabloz.`,
  ogTitle: () =>
    publicMenuStore.restaurant?.name
      ? `منيو ${publicMenuStore.restaurant.name}`
      : "منيو المطعم",
  ogDescription: () =>
    publicMenuStore.restaurant?.description ||
    "تصفح المنيو الإلكتروني واطلب بسهولة.",
  ogImage: () => publicMenuStore.restaurant?.logo_url || "/imgs/hero.webp",
  twitterCard: "summary_large_image",
  robots: () => (notFound.value ? "noindex, nofollow" : "index, follow"),
});

// 2. البيانات المنظمة (Schema.org) ليفهم جوجل أن الصفحة قائمة طعام لمطعم
useSchemaOrg([
  defineWebPage({
    name: () =>
      publicMenuStore.restaurant?.name
        ? `منيو ${publicMenuStore.restaurant.name}`
        : "منيو المطعم",
  }),
  {
    "@type": "Restaurant",
    name: () => publicMenuStore.restaurant?.name,
    description: () => publicMenuStore.restaurant?.description,
    image: () => publicMenuStore.restaurant?.logo_url,
    telephone: () => publicMenuStore.restaurant?.phone,
    address: () => publicMenuStore.restaurant?.address,
    hasMenu: {
      "@type": "Menu",
      name: () => `قائمة طعام ${publicMenuStore.restaurant?.name || ""}`,
      hasMenuSection: () =>
        publicMenuStore.categories.map((cat) => ({
          "@type": "MenuSection",
          name: cat.name,
          hasMenuItem: cat.items.slice(0, 15).map((item) => ({
            "@type": "MenuItem",
            name: item.title,
            description: item.description,
            offers: {
              "@type": "Offer",
              price: item.price,
              priceCurrency: publicMenuStore.restaurant?.currency || "EGP",
            },
          })),
        })),
    },
  },
]);
</script>

<template>
  <div class="px-fluid mx-auto w-full pb-16 2xl:max-w-[90%]">
    <div v-if="publicMenuStore.error" class="py-24 text-center" dir="rtl">
      <h1 class="text-primary text-fluid-p mb-2 font-bold">
        {{ notFound ? "المنيو غير متاح" : "تعذّر تحميل المنيو" }}
      </h1>
      <p class="text-text/60 mb-section-fluid text-fluid-sm">
        {{
          notFound
            ? "تأكد من الرابط، أو أن المطعم غير متاح حالياً."
            : "تحقق من اتصالك بالإنترنت وحاول مرة أخرى."
        }}
      </p>
      <button v-if="!notFound" @click="handleFetchMenu" class="btn-primary">
        إعادة المحاولة
      </button>
    </div>

    <template v-else>
      <MenuRestaurantHero :restaurant="publicMenuStore.restaurant" />
      <MenuPublicOffersSection />
      <MenuCategoryTabs />
      <MenuCategorySection />

      <div v-if="isOpenItem && (selectedItem as CartItem).is_available">
        <MenuItemModal :item="selectedItem as CartItem" />
      </div>

      <ClientOnly>
        <CartDrawer />
      </ClientOnly>
    </template>
  </div>
</template>
