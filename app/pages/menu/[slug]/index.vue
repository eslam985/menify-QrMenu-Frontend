<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import { usePublicMenuStore } from '~/stores/publicMenu'
import { useItemModal } from '~/composables/useItemModal'
import PublicOffersSection from '~/components/menu/PublicOffersSection.vue'
import CategorySection from '~/components/menu/CategorySection.vue'

const route = useRoute()
const publicMenuStore = usePublicMenuStore()
const { isOpen, selectedItem, closeModal } = useItemModal()

const slug = computed(() => {
  const s = route.params.slug
  return (Array.isArray(s) ? s[0] : s) ?? ''
})

onMounted(() => publicMenuStore.fetchMenu(slug.value))
watch(slug, (s) => publicMenuStore.fetchMenu(s)) // fires only when navigating to ANOTHER restaurant
onUnmounted(() => publicMenuStore.clearMenu())

const notFound = computed(() => (publicMenuStore.error as any)?.response?.status === 404)
</script>

<template>
  <div class="w-full 2xl:max-w-[80%] mx-auto px-fluid pb-16">
    <!-- خطأ في التحميل -->
    <div v-if="publicMenuStore.error" class="text-center py-24" dir="rtl">
      <h1 class="text-2xl font-bold text-primary mb-2">
        {{ notFound ? 'المنيو غير متاح' : 'تعذّر تحميل المنيو' }}
      </h1>
      <p class="text-text/60 text-sm mb-6">
        {{ notFound ? 'تأكد من الرابط، أو أن المطعم غير متاح حالياً.' : 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.' }}
      </p>
      <button v-if="!notFound" @click="publicMenuStore.fetchMenu(slug)"
        class="px-6 py-3 rounded-xl bg-primary text-white font-bold cursor-pointer hover:opacity-90 transition">
        إعادة المحاولة
      </button>
    </div>

    <template v-else>
      <MenuRestaurantHero :restaurant="publicMenuStore.restaurant" />
      <PublicOffersSection />
      <MenuCategoryTabs />
      <CategorySection />

      <MenuItemModal v-if="isOpen && selectedItem" :item="selectedItem" @close="closeModal" />
      <CartDrawer />
    </template>
  </div>
</template>