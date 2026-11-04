<!-- app/components/menu/CategorySection.vue -->
<script setup lang="ts">
import { usePublicMenuStore } from '~/stores/publicMenu'
import { useItemModal } from '~/composables/useItemModal'

const publicMenuStore = usePublicMenuStore()
const { openModal, setActiveCategoryItems } = useItemModal()
const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return publicMenuStore.categories
  const query = searchQuery.value.toLowerCase().trim()

  return publicMenuStore.categories.map((category: any) => {
    if (category.name?.toLowerCase().includes(query)) return category

    const filteredItems = category.items?.filter((item: any) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
    return { ...category, items: filteredItems }
  }).filter((category: any) => category.items && category.items.length > 0)
})

// The clicked category's items become the "active" list, set AT CLICK TIME
// (not on render), so categories never overwrite each other
const openItem = (category: any, item: any) => {
  if (!item.is_available) return
  setActiveCategoryItems(category.items)
  openModal(item)
}
</script>

<template>
  <div v-if="publicMenuStore.categories?.length > 0" dir="rtl">
    <!-- خانة البحث -->
    <div class="mb-6 relative">
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text/40">
        <Icon name="lucide:search" class="w-5 h-5" />
      </div>
      <input v-model="searchQuery" type="text" placeholder="ابحث عن وجبتك المفضلة (مثل: برجر، بيتزا، مشروب...)"
        class="w-full py-3.5 pr-12 pl-10 rounded-2xl bg-card border border-primary/10 text-text placeholder:text-text/40 focus:outline-none focus:border-primary transition shadow-soft text-fluid-sm" />
      <button v-if="searchQuery" @click="searchQuery = ''"
        class="absolute inset-y-0 left-0 pl-4 flex items-center text-text/40 hover:text-primary transition cursor-pointer"
        title="مسح البحث">
        <Icon name="lucide:x" class="w-5 h-5" />
      </button>
    </div>

    <div class="mt-8 flex flex-col gap-10">
      <div v-if="publicMenuStore.isLoading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="text-text/60 text-sm animate-pulse">جاري تحضير قائمة المطعم...</p>
      </div>

      <div v-else-if="searchQuery.trim() !== '' && filteredCategories.length === 0"
        class="text-center py-16 bg-card rounded-2xl border border-primary/5 shadow-soft">
        <Icon name="lucide:search-x" class="w-12 h-12 text-text/30 mx-auto mb-3" />
        <h3 class="font-bold text-lg text-text">عذراً، لم نجد نتائج مطابقة لـ "{{ searchQuery }}"</h3>
        <p class="text-sm text-text/60 mt-1">جرب البحث بكلمات أخرى أو مسح حقل البحث.</p>
      </div>

      <div v-else-if="publicMenuStore.isLoaded && filteredCategories.length === 0"
        class="text-center py-16 text-text/60">
        لا توجد أصناف في المنيو حالياً.
      </div>

      <template v-else>
        <div v-for="category in filteredCategories" :key="category.id" :id="`category-${category.id}`"
          class="scroll-mt-24">
          <h2 class="text-fluid-h2 font-bold text-primary mb-fluid pb-2 border-b border-primary/10">
            {{ category.name }}
          </h2>

          <!-- أصناف هذا التصنيف فقط -->
          <div class="flex overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div
              v-for="item in category.items"
              :key="item.id"
              @click="openItem(category, item)"
              :class="[
                'bg-card text-text rounded-3xl p-fluid shadow-xl border border-primary/25 flex flex-col justify-between transition-all shrink-0 w-[260px] sm:w-[280px] md:w-[320px] snap-start group hover:border-primary/50',
                item.is_available ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'
              ]"
            >
              <div>
                <div class="w-full h-36 md:h-40 rounded-2xl overflow-hidden bg-bg flex items-center justify-center relative mb-4 shadow-inner border border-primary/10">
                  <img
                    v-if="item.image_url || publicMenuStore.restaurant?.logo_url"
                    :src="item.image_url || publicMenuStore.restaurant?.logo_url"
                    :alt="item.title"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <Icon v-else name="lucide:utensils" class="w-8 h-8 text-text/30" />

                  <span v-if="!item.is_available" class="absolute top-3 left-3 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold shadow-md">
                    غير متوفر حاليا
                  </span>
                </div>

                <div class="flex flex-col gap-1">
                  <h3 class="text-(length:--text-fluid-h3) font-bold text-text truncate">{{ item.title }}</h3>
                  <p v-if="item.description" class="text-(length:--text-fluid-sm) text-text/70 line-clamp-2 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between mt-4 pt-3 border-t border-primary/10">
                <span class="text-fluid-xs text-text/50 font-bold">السعر</span>
                <span class="text-xl font-black text-primary">
                  {{ formatPrice(item.price) }}
                  <span class="text-xs">{{ publicMenuStore.restaurant?.currency || 'ج.م' }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>