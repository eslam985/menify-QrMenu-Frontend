<!-- app/components/dashboard/categories/CategoryModal.vue -->
<script setup lang="ts">
import { useCategoryModal } from '~/composables/useCategoryModal'
import { useCategoryStore } from '~/stores/category'
import { useForm, type FormField } from '~/composables/useForm'

const { isOpen, editingCategory, closeModal } = useCategoryModal()
const categoryStore = useCategoryStore()

// 1. إنشاء نسخة مستقلة ومحمية من الـ Composable الخاص بالفورم
const formInstance = useForm()
const { setFormConfig, formDataPayload, resetForm } = formInstance

// 2. حقن الـ Instance للـ BaseForm الابن عبر الـ Provide النقية بدون Props
provide('current_form_instance', formInstance)

// 3. تحديد هيكل الحقول وخيارات الأقسام ديناميكياً
const categoryFieldsConfig: FormField[] = [
  {
    column: 'name',
    value: '',
    label: 'اسم التصنيف',
    required: true,
    type: 'text',
    colspan: 'col-span-3'
  },
  {
    column: 'section',
    value: 'food',
    label: 'القسم (Section)',
    required: true,
    type: 'select',
    colspan: 'col-span-3',
    options: [
      { label: 'طعام (Food)', value: 'food' },
      { label: 'مشروبات (Drinks)', value: 'drinks' },
      { label: 'حلويات (Desserts)', value: 'desserts' },
      { label: 'شيشة', value: 'shisha' }, // قمت بتعديل القيمة المكررة لـ shisha لضمان دقة البيانات
      { label: 'أخرى (Other)', value: 'other' }
    ]
  },
  {
    column: 'display_order',
    value: 0,
    label: 'ترتيب العرض (Display Order)',
    required: false,
    type: 'text', // سيعامل كـ input قياسي والـ Payload سيتكفل بالباقي
    colspan: 'col-span-3'
  }
]
interface PayloadType {
    name: string;
    section: CategorySection;
    display_order: number;
}
// 4. دالة الإرسال الموحدة (تتعرف تلقائياً على وضع التعديل أو الإضافة)
const handleSubmit = async () => {
  const isEditing = Boolean(editingCategory.value?.id)
  let success = false
  
  // تحويل ترتيب العرض إلى Number للتوافق مع الباك إند
  const payload: PayloadType = {
    ...formDataPayload.value,
    name: String(formDataPayload.value.name || ''),
    section: formDataPayload.value.section || 'food',
    display_order: Number(formDataPayload.value.display_order || 0)
  }

  if (isEditing) {
    success = await categoryStore.updateCategory(editingCategory.value!.id, payload)
  } else {
    success = await categoryStore.addCategory(payload)
  }

  if (success !== false) {
    closeModal()
    resetForm()
  }
}

// 5. مراقبة حالة المودال لشحن البيانات أو تصفيرها هندسياً
watch([isOpen, editingCategory], ([open, category]) => {
  if (!open) {
    resetForm()
    return
  }

  if (category) {
    // وضع التعديل: نشحن الهيكل بالبيانات القادمة من الـ Store
    setFormConfig(categoryFieldsConfig, handleSubmit, {
      name: category.name || '',
      section: category.section || 'food',
      display_order: category.display_order ?? 0
    })
  } else {
    // وضع الإضافة: نشحن الهيكل بالقيم الافتراضية الفارغة
    setFormConfig(categoryFieldsConfig, handleSubmit)
  }
}, { immediate: true })
</script>

<template>
  <div v-if="isOpen" @click.self="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-card max-w-md w-full p-6 rounded-card border border-primary/10 shadow-2xl text-right flex flex-col gap-fluid">
      
      <!-- عنوان المودال الديناميكي -->
      <h3 class="text-fluid-h3 font-bold text-primary border-b border-primary/5 pb-2">
        {{ editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد' }}
      </h3>
      
      <!-- استدعاء الفورم العام الموحد بالنظام ليقوم بالرسم التلقائي المنسق -->
      <UiBaseForm />

      <!-- زر الإلغاء الإضافي الخاص بـ الـ Modal التفاعلي متمم لزر الحفظ بالأسفل -->
      <div class="w-full flex justify-start -mt-12 pr-fluid pointer-events-none">
        <button type="button" @click="closeModal" class="pointer-events-auto px-4 py-2 rounded-xl bg-card border border-primary/10 text-text font-bold text-xs cursor-pointer transition-colors hover:bg-primary/5">
          إلغاء
        </button>
      </div>

    </div>
  </div>
</template>
