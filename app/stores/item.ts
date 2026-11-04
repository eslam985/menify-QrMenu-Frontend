// app/stores/item.ts
import { defineStore } from 'pinia'
import { useItemService } from '~/services/itemService'
import { useNotificationStore } from '~/stores/notification'
import { useConfirmStore } from '~/stores/confirm'
import { useAuthStore } from '~/stores/auth'

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  title: string
  description?: string | null
  price: number
  image_url?: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  display_order: number
}

export const useItemStore = defineStore('item', () => {
  const notiStore = useNotificationStore()
  const itemService = useItemService()
  const confirmStore = useConfirmStore()
  const authStore = useAuthStore()

  const items = ref<MenuItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // جلب جميع الأصناف (مع إمكانية تمرير فلتر مثل category_id)
  async function fetchItems(params?: Record<string, any>) {
    isLoading.value = true
    error.value = null
    try {
      const res = await itemService.getItems(params)
      if (!res) return false
      
      items.value = res.data || []
      return res.data
    } catch (err: any) {
      const message = err?.data?.message || 'فشل تحميل المنتجات'
      error.value = message
      notiStore.show(message, 'error')
      return false
    }finally {
      isLoading.value = false
    }
  }

  // إضافة صنف جديد
  async function addItem(body: {
    category_id: string
    title: string
    description?: string
    price: number
    is_available?: boolean
    display_order?: number
  }) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }

    if (isLoading.value) return false

    isLoading.value = true
    try {
      const res = await itemService.createItem(body)
      if (!res.success) {
        notiStore.show(res.message || 'فشل إضافة الصنف', 'error')
        return false
      }

      items.value.unshift(res.data)
      notiStore.show(res.message || `تم إضافة الصنف "${body.title}" بنجاح!`, 'success')
      return res.data
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل إضافة الصنف', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // تعديل صنف
  async function updateItem(id: string, body: Partial<MenuItem>) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }

    if (isLoading.value || !id) return false

    isLoading.value = true
    try {
      const res = await itemService.updateItem(id, {
        ...body,
        description: body.description ?? undefined,
        image_url: body.image_url ?? undefined,
      })
      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1 && res.data) {
        items.value[index] = res.data
      }
      notiStore.show(res.message || 'تم تحديث الصنف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل تحديث الصنف', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // حذف صنف
  async function removeItem(id: string) {
    if (isLoading.value || !id) return false
    if (!authStore.isAdmin) {
      notiStore.show('عذراً، حذف الأصناف متاح للآدمن (Admin) فقط.', 'error')
      return false
    }

    const isConfirmed = await confirmStore.ask(
      'هل أنت متأكد من حذف هذا الصنف نهائياً؟',
      'تأكيد الحذف'
    )
    if (!isConfirmed) return false

    isLoading.value = true
    try {
      await itemService.deleteItem(id)
      items.value = items.value.filter((i) => i.id !== id)
      notiStore.show('تم حذف الصنف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل حذف الصنف', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // تبديل حالة التوفر (متوفر / غير متوفر)
  async function toggleAvailability(id: string, currentStatus: boolean) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }

    try {
      const newStatus = !currentStatus
      await itemService.setAvailability(id, newStatus)
      const index = items.value.findIndex((i) => i.id === id)
      const item = items.value[index]
      if (item) {
        item.is_available = newStatus
      }
      notiStore.show('تم تحديث حالة التوفر بنجاح', 'success')
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل تغيير حالة التوفر', 'error')
      console.error(err)
      return false
    }
  }

// رفع صورة الصنف
  async function uploadImage(id: string, formData: FormData) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }

    if (isLoading.value || !id) return false

    isLoading.value = true
    try {
      const res = await itemService.uploadImage(id, formData)
      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1 && res.data) {
        items.value[index] = res.data
      }
      notiStore.show(res.message || 'تم رفع صورة الصنف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل رفع صورة الصنف', 'error')
      console.error(err)

      return false
    } finally {
      isLoading.value = false
    }
  }

  // حذف صورة الصنف
  async function deleteImage(id: string) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
      return false
    }

    if (isLoading.value || !id) return false

    isLoading.value = true
    try {
      const res = await itemService.deleteImage(id)
      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1 && res.data) {
        items.value[index] = res.data
      }
      notiStore.show(res.message || 'تم حذف صورة الصنف بنجاح!', 'success')
      return true
    } catch (err: any) {
      notiStore.show(err?.data?.message || 'فشل حذف صورة الصنف', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // إعادة ترتيب الأصناف
    async function reorderItems(payload: { category_id: string; ids: string[] }) {
      if (!authStore.isEditorAndAbove) {
        notiStore.show('هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!', 'error')
        return false
      }

      if (isLoading.value) return false

      isLoading.value = true
      try {
        const res = await itemService.reorderItems(payload)
        
        // تحديث الترتيب محلياً بناءً على مصفوفة الـ ids والـ index الجديد
        payload.ids.forEach((id, index) => {
          const item = items.value.find((i) => i.id === id)
          if (item) item.display_order = index
        })
        
        // إعادة ترتيب مصفوفة الأصناف محلياً حسب display_order الجديد
        items.value.sort((a, b) => a.display_order - b.display_order)

        notiStore.show(res.message || 'تم إعادة ترتيب الأصناف بنجاح!', 'success')
        return true
      } catch (err: any) {
        notiStore.show(err?.data?.message || 'فشل إعادة ترتيب الأصناف', 'error')
        console.error(err)
        return false
      } finally {
        isLoading.value = false
      }
    }

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    updateItem,
    removeItem,
    toggleAvailability,
    uploadImage,
    deleteImage,
    reorderItems,
  }
})