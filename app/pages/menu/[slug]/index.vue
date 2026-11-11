<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import CategorySection from "~/components/menu/CategorySection.vue";
import PublicOffersSection from "~/components/menu/PublicOffersSection.vue";
import { useItemModal } from "~/composables/useItemModal";

import type { CartItem } from "@/types/dataType/menuItemType";

const route = useRoute();
const publicMenuStore = usePublicMenuStore();
const { isOpen, selectedItem, closeModal } = useItemModal();

const slug = computed(() => {
  const s = route.params.slug;
  return (Array.isArray(s) ? s[0] : s) ?? "";
});

onMounted(async () => {
  await publicMenuStore.fetchMenu(slug.value);
});
watch(slug, (s) => publicMenuStore.fetchMenu(s));
onUnmounted(() => publicMenuStore.clearMenu());

const notFound = computed(() => {
  const error = publicMenuStore.error;

  if (typeof error !== "object" || error === null || !("response" in error)) {
    return false;
  }

  const response = error.response;

  return (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    response.status === 404
  );
});
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
        @click="publicMenuStore.fetchMenu(slug)"
        class="bg-primary cursor-pointer rounded-xl px-6 py-3 font-bold text-white transition hover:opacity-90"
      >
        إعادة المحاولة
      </button>
    </div>

    <template v-else>
      <MenuRestaurantHero :restaurant="publicMenuStore.restaurant" />
      <PublicOffersSection />
      <MenuCategoryTabs />
      <CategorySection />

      <MenuItemModal
        v-if="isOpen && selectedItem"
        :item="selectedItem as CartItem"
        @close="closeModal"
      />
      <CartDrawer />
    </template>
  </div>
</template>
