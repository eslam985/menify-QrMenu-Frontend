<!-- app/components/dashboard/items/ItemModal.vue -->
<script setup lang="ts">
import { useItemModal } from '~/composables/useItemModal'
import { useItemStore } from '~/stores/item'
import { useCategoryStore } from '~/stores/category'

const { isOpen, selectedItem: editingItem, closeModal } = useItemModal()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()

// --- التعديل الجديد ---
const form = reactive({
  category_id: '',
  title: '',
  description: '',
  price: 0,
  is_available: true,
  display_order: 0,
})

const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
  }
}

watch(editingItem, (newVal) => {
  if (newVal) {
    form.category_id = newVal.category_id || ''
    form.title = newVal.title || ''
    form.description = newVal.description || ''
    form.price = newVal.price || 0
    form.is_available = newVal.is_available ?? true
    form.display_order = newVal.display_order ?? 0
    imagePreview.value = newVal.image_url || null
    selectedFile.value = null
  } else {
    form.category_id = categoryStore.categories[0]?.id || ''
    form.title = ''
    form.description = ''
    form.price = 0
    form.is_available = true
    form.display_order = 0
    imagePreview.value = null
    selectedFile.value = null
  }
}, { immediate: true })

const errorMessage = ref('')

// --- استبدال دالة handleSubmit في app/components/dashboard/items/ItemModal.vue ---
const handleSubmit = async () => {
  errorMessage.value = ''
  const paylod = {
    category_id: form.category_id,
    title: form.title,
    description: form.description,
    price: form.price,
    is_available: form.is_available,
  }

  try {
    let itemId = editingItem.value?.id

    if (editingItem.value) {
      await itemStore.updateItem(editingItem.value.id, paylod)
    } else {
      // استقبال الصنف الجديد المُضاف والذي يحتوي على الـ id
      const newItem = await itemStore.addItem(paylod)

      if (newItem && newItem.id) {
        itemId = newItem.id
      }

      resetObj(form) 
    }

    // رفع الصورة إن وجدت (سيعمل الآن في الحالتين Edit و Create بدقة)
    if (selectedFile.value && itemId) {
      const formData = new FormData()
      formData.append('image', selectedFile.value)
      await itemStore.uploadImage(itemId, formData)
    }
    
    closeModal()
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'فشل حفظ الصنف'
  }
}
</script>

<template>
  <div v-if="isOpen" @click.self="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div class="bg-card max-w-lg w-full p-6 rounded-2xl border border-primary/10 shadow-2xl text-right">
      <h3 class="text-lg font-bold text-primary mb-4">
        {{ editingItem ? 'تعديل صنف' : 'إضافة صنف جديد' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs text-text/80 mb-1">اسم الصنف</label>
          <input v-model="form.title" type="text" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" required />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-text/80 mb-1">التصنيف</label>
            <select v-model="form.category_id" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" required>
              <option value="" disabled>اختر التصنيف</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-text/80 mb-1">السعر (ج.م)</label>
            <input 
              v-model.number="form.price" 
              type="number" 
              step="0.01" 
              min="1" 
              class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" 
              required 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-text/80 mb-1">الوصف</label>
          <textarea v-model="form.description" rows="3" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" placeholder="وصف المكونات أو الوجبة..."></textarea>
        </div>
<!-- قسم رفع وتعديل صورة الصنف -->
        <div>
          <label class="block text-xs text-text/80 mb-1">صورة الصنف</label>
          <div class="flex items-center gap-4">
            <div v-if="imagePreview" class="relative w-16 h-16 rounded-xl overflow-hidden border border-primary/20">
              <img :src="imagePreview" class="w-full h-full object-cover" />
              <button type="button" @click="{ imagePreview = null; selectedFile = null; }" class="absolute top-0 right-0 bg-red-500 text-white p-0.5 text-xs">×</button>
            </div>
            <input type="file" @change="handleFileChange" accept="image/*" class="w-full p-2 rounded-xl bg-bg border border-primary/10 text-text text-xs file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label class="block text-xs text-text/80 mb-1">ترتيب العرض</label>
            <input v-model.number="form.display_order" type="number" min="0" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" />
          </div>

          <div class="flex items-center gap-2 pt-5">
            <input v-model="form.is_available" type="checkbox" id="is_available" class="w-4 h-4 accent-primary" />
            <label for="is_available" class="text-xs font-bold text-text cursor-pointer">الصنف متاح للطلب حالياً</label>
          </div>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-xs bg-red-500/10 p-2.5 rounded-lg">{{ errorMessage }}</p>

        <div class="flex gap-2 mt-4">
          <button type="submit" :disabled="itemStore.isLoading" class="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer hover:opacity-90 disabled:opacity-50">
            {{ editingItem ? 'تحديث' : 'حفظ' }}
          </button>
          <button type="button" @click="closeModal" class="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-text font-bold text-xs cursor-pointer">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  </div>
</template>