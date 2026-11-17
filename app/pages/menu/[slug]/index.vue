<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import type { CartItem } from "~/types/dataType/menuItemType";
import { usePublicMenuState } from "~/composables/menu/usePublicMenu";
import { useMenuSeo } from "~/composables/menu/useMenuSeo";
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

// السيو الديناميكي والبيانات المنظمة للمطعم
useMenuSeo(
  computed(() => publicMenuStore.restaurant),
  computed(() => publicMenuStore.categories),
  notFound,
);
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
