// app/stores/category.ts
import { defineStore } from 'pinia'


import { useCategoryService } from '~/services/categoryService'
import { useNotificationStore } from '~/stores/notification'
import { useConfirmStore } from '~/stores/confirm'
import { useAuthStore } from '~/stores/auth'
export type CategorySection = "food" | "drinks" | "desserts" | "other";

export interface UpdateCategoryInput {
  name?: string | undefined;
  section?: CategorySection | undefined; 
  display_order?: number | undefined;
}

export const useCategoryStore = defineStore('category', () => {
  const notiStore = useNotificationStore()
  const categoryService = useCategoryService()
  const confirmStore = useConfirmStore()
  const  authStore = useAuthStore()

  const categories = ref<any[]>([])
  const isSaving = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const categoriesCount = computed(() => categories.value?.length)
  const itemsArray = computed(() => categories.value.map((c) => c.items_count))
  const items_count = computed(() => itemsArray.value.reduce((acc, curr) => acc + curr, 0))

  async function fetchCategories() {
    isLoading.value = true
    error.value = null
    try {
      const res = await categoryService.getCategories()

      if (!res) return false

      categories.value = res.data || []
    } catch (err: any) {
      // 🌟 إذا كان الخطأ هو توقف الاشتراك، اتركه يصعد ولا تكبته
      const status = err?.status || err?.statusCode || err?.response?.status
      const errorData = err?.data || err?.response?._data
      if (status === 403 && errorData?.code === 'SUBSCRIPTION_INACTIVE') {
        throw err
      }

      error.value = errorData?.message || err?.message
      const msg = error.value || 'فشل تحميل التصنيفات'
      notiStore.show(msg, 'error')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function addCategory(body: { name: string; section?: string; display_order?: number }) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }
    if (isSaving.value) return false

    isSaving.value = true
    try {
      const res = await categoryService.createCategory(body)
      if (!res.success) {
        notiStore.show(res.message || 'فشل اضافة التصنيف', 'error')
        return false
      }
      // the backend appends it at the END, and a new category has no items yet
      categories.value.push({ items_count: 0, ...res.data })
      notiStore.show(res.message || `تم اضافة التصنيف ${body.name} بنجاح!`, 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل اضافة التصنيف', 'error')
      return false
    } finally {
      isSaving.value = false
    }
  }
  
  async function updateCategory(id: string, body: UpdateCategoryInput) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }
    if (!id || isSaving.value || !body) return false

    isSaving.value = true
    try {
      const res = await categoryService.updateCategory(
        id,
        body as Parameters<typeof categoryService.updateCategory>[1],
      )
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1 && res.data) {
        // merge: the PATCH response has no items_count
        categories.value[index] = { ...categories.value[index], ...res.data }
      }
      notiStore.show(res.message || 'تم تحديث التصنيف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل تحديث التصنيف', 'error')
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function removeCategory(id: string) {
    if (!id || isSaving.value) return false
    if (!authStore.isAdmin) {
      notiStore.show('عذراً، حذف التصنيفات متاح للآدمن (Admin) فقط.', 'error')
      return false
    }

    const count = categories.value.find((c) => c.id === id)?.items_count ?? 0
    const isConfirmed = await confirmStore.ask(
      count > 0
        ? `سيتم حذف هذا التصنيف و${count} صنف تابع له نهائياً. هل أنت متأكد؟`
        : 'هل أنت متأكد من حذف هذا التصنيف؟',
      'تأكيد الحذف',
    )
    if (!isConfirmed) return false

    isSaving.value = true
    try {
      await categoryService.deleteCategory(id)
      categories.value = categories.value.filter((c) => c.id !== id)
      notiStore.show('تم حذف التصنيف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل حذف التصنيف', 'error')
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    categories,
    isLoading,
    error,
    isSaving,
    categoriesCount,
    items_count,
    fetchCategories,
    addCategory,
    removeCategory,
    updateCategory
  }
})