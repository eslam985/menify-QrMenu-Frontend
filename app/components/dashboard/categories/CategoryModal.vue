<!-- app/components/dashboard/categories/CategoryModal.vue -->
<script setup lang="ts">
import { useCategoryModal } from '~/composables/useCategoryModal'
import { useCategoryStore } from '~/stores/category'

const { isOpen, editingCategory, closeModal } = useCategoryModal()
const categoryStore = useCategoryStore()

const form = reactive({
  name: '',
  section: 'food' as NonNullable<Parameters<typeof categoryStore.updateCategory>[1]['section']>,
  display_order: 0,
})

// مراقبة حالة المودال لتعبئة البيانات عند التعديل أو تفريغها عند الإضافة
watch(editingCategory, (newVal) => {
  if (newVal) {
    form.name = newVal.name || ''
    form.section = newVal.section || 'food'
    form.display_order = newVal.display_order ?? 0
  } else {
    form.name = ''
    form.section = 'food'
    form.display_order = 0
  }
}, { immediate: true })

const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''

  // التحقق الأدق والأكثر أماناً: هل يوجد ID حقيقي للتعديل؟
  const isEditing = Boolean(editingCategory.value?.id)
  
  let success = false

  if (isEditing) {
    // وضع التعديل
    success = await categoryStore.updateCategory(editingCategory.value!.id, { ...form })
  } else {
    // وضع الإضافة
    success = await categoryStore.addCategory({ ...form })
  }

  // إغلاق المودال فقط إذا تمت العملية بنجاح
  if (success !== false) {
    closeModal()
  }
}
</script>

<template>
  <div v-if="isOpen" @click.self="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div class="bg-card max-w-md w-full p-6 rounded-2xl border border-primary/10 shadow-2xl text-right">
      <h3 class="text-lg font-bold text-primary mb-4">
        {{ editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد' }}
      </h3>
      
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs text-text/80 mb-1">اسم التصنيف</label>
          <input v-model="form.name" type="text" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" required />
        </div>

        <div>
          <label class="block text-xs text-text/80 mb-1">القسم (Section)</label>
          <select v-model="form.section" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary">
            <option value="food">طعام (Food)</option>
            <option value="drinks">مشروبات (Drinks)</option>
            <option value="desserts">حلويات (Desserts)</option>
            <option value="drinks">شيشة</option>
            <option value="other">أخرى (Other)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs text-text/80 mb-1">ترتيب العرض (Display Order)</label>
          <input v-model.number="form.display_order" type="number" class="w-full p-3 rounded-xl bg-bg border border-primary/10 text-text text-sm focus:outline-none focus:border-primary" />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-xs bg-red-500/10 p-2.5 rounded-lg">{{ errorMessage }}</p>

        <div class="flex gap-2 mt-4">
          <button type="submit" :disabled="categoryStore.isLoading" class="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-xs cursor-pointer hover:opacity-90 disabled:opacity-50">
            {{ editingCategory ? 'تحديث' : 'حفظ' }}
          </button>
          <button type="button" @click="closeModal" class="flex-1 py-3 rounded-xl bg-card border border-primary/10 text-text font-bold text-xs cursor-pointer">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  </div>
</template>