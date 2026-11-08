// app/stores/publicMenu.ts
import { defineStore } from 'pinia'

const CURRENCY_LABELS: Record<string, string> = { EGP: 'ج.م', SAR: 'ر.س', AED: 'د.إ', USD: '$', EUR: '€' }

export const usePublicMenuStore = defineStore('publicMenu', () => {
  const config = useRuntimeConfig()

  const restaurant = ref<any>(null)
  const categories = ref<any[]>([])
  const offers = ref<any[]>([])
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref<any>(null)

  let loadedSlug: string | null = null
  const categoriesCount = computed(()=> categories.value?.length)

  async function fetchMenu(slug: string) {
    if (!slug || isLoading.value) return                       // guard: no slug / already running
    if (loadedSlug === slug && restaurant.value) return        // guard: already loaded, no refetch

    isLoading.value = true
    error.value = null
    try {
      const res: any = await $fetch(`${config.public.apiBase}/public/menu/${encodeURIComponent(slug)}`)

      if (!res || !res.success ) return false
      
      const info = res.data.restaurant

      info.currency = CURRENCY_LABELS[info.currency] ?? info.currency
      restaurant.value = info
      categories.value = res.data.categories ?? []
      offers.value = res.data.offers ?? []
      loadedSlug = slug

      return res
    } catch (e: any) {
      const status = e?.status || e?.statusCode || e?.response?.status
      if (status === 404) {
        error.value = 'عذراً، هذا المطعم غير موجود أو تم إيقاف الرابط.'
      } else {
        error.value = e?.data?.message || 'حدث خطأ أثناء تحميل بيانات المنيو.'
      }
      console.error(e)
    } finally {
      isLoading.value = false
      isLoaded.value = true
    }
  }

  function clearMenu() {
    restaurant.value = null
    categories.value = []
    offers.value = []
    error.value = null
    isLoading.value = false
    isLoaded.value = false
    loadedSlug = null
  }

  return { restaurant, categories, offers, isLoading, isLoaded, error, categoriesCount, fetchMenu, clearMenu, }
})