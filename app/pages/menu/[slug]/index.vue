<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import type { CartItem } from "~/types/dataType/menuItemType";

import { usePublicMenuState, useShowModal } from "#imports";

const { publicMenuStore, PublicSlug, notFound, handleFetchMenu } =
  usePublicMenuState();

const { isOpen: isOpenItem, selectedData: selectedItem } =
  useShowModal("item-model");

onMounted(async () => {
  await handleFetchMenu();
});

watch(
  () => PublicSlug,
  () => handleFetchMenu(),
);

onUnmounted(() => publicMenuStore.clearMenu());
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
      <button
        v-if="!notFound"
        @click="handleFetchMenu"
        class="bg-primary cursor-pointer rounded-xl px-6 py-3 font-bold text-white transition hover:opacity-90"
      >
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

      <CartDrawer />
    </template>
  </div>
</template>
