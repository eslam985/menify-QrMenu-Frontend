<!-- app/components/dashboard/items/ItemModal.vue -->
<script setup lang="ts">
import { useItemModal } from '~/composables/useItemModal'
import { useItemStore } from '~/stores/item'
import { useCategoryStore } from '~/stores/category'
import { useForm, type FormField } from '~/composables/useForm'

const { isOpen, selectedItem: editingItem, closeModal } = useItemModal()
const itemStore = useItemStore()
const categoryStore = useCategoryStore()

// 1. إنشاء نسخة مستقلة ومحمية من الـ Composable الخاص بالفورم
const formInstance = useForm()
const { setFormConfig, formDataPayload, resetForm } = formInstance

// 2. حقن الـ Instance للـ BaseForm الابن عبر الـ Provide النقية
provide('current_form_instance', formInstance)

// إدارات مخصصة للصورة والـ Checkbox للحفاظ على توافق المعمارية الحالية
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const isAvailable = ref<boolean>(true)
const errorMessage = ref('')

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(target.files[0])
  }
}

// 3. بناء مصفوفة الحقول وتغذية قائمة خيارات الـ Categories ديناميكياً من الـ Store
const itemFieldsConfig = computed<FormField[]>(() => [
  {
    column: 'title',
    value: '',
    label: 'اسم الصنف',
    required: true,
    type: 'text',
    colspan: 'col-span-3'
  },
  {
    column: 'category_id',
    value: categoryStore.categories[0]?.id || '',
    label: 'التصنيف',
    required: true,
    type: 'select',
    colspan: 'col-span-1 sm:col-span-1.5', // متجاوب ومقسوم هندسياً بجانب السعر
    options: categoryStore.categories.map(cat => ({ label: cat.name, value: cat.id }))
  },
  {
    column: 'price',
    value: 0,
    label: 'السعر (ج.م)',
    required: true,
    type: 'text', // نتركه نصاً ليتوافق مع الحقول القياسية في المعمارية
    colspan: 'col-span-1 sm:col-span-1.5'
  },
  {
    column: 'description',
    value: '',
    label: 'الوصف',
    required: false,
    type: 'textarea',
    colspan: 'col-span-3'
  },

])

// 4. دالة الإرسال المركزية المتوافقة مع معمارية الـ Payload النظيف والرفع الثنائي
const handleSubmit = async () => {
  errorMessage.value = ''

  // بناء الكائن النهائي مع تحويل الأرقام بدقة للباك إند
  const payload = {
    category_id: formDataPayload.value.category_id,
    title: formDataPayload.value.title.trim(),
    description: formDataPayload.value.description.trim(),
    price: Number(formDataPayload.value.price || 0),
    is_available: isAvailable.value,
  }

  if (payload.price < 1) {
    const notiStore = useNotificationStore()
    notiStore.show(`سعر  '  ${payload.title ?? 'الصنف'}  '  لا يجب ان يكون 0`, 'error')
    return
  }


  try {
    let itemId = editingItem.value?.id

    if (editingItem.value) {
      await itemStore.updateItem(editingItem.value.id, payload)
    } else {

      const newItem = await itemStore.addItem(payload)
      if (newItem && newItem.id) {
        itemId = newItem.id
      }
    }

    // رفع الصورة بشكل منفصل ومنعزل تماماً إن وجدت بنجاح
    if (selectedFile.value && itemId) {
      const formData = new FormData()
      formData.append('image', selectedFile.value)
      await itemStore.uploadImage(itemId, formData)
    }

    closeModal()
    resetForm()
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'فشل حفظ الصنف'
  }
}

// 5. مراقبة تفتح وغلق المودال لشحن البيانات أو تفريغها نقياً
watch([isOpen, editingItem], ([open, item]) => {

  if (!open) {
    resetForm()
    imagePreview.value = null
    selectedFile.value = null
    return
  }

  if (item) {
    isAvailable.value = item.is_available ?? true
    imagePreview.value = item.image_url || null
    selectedFile.value = null

    setFormConfig(itemFieldsConfig.value, handleSubmit, {
      title: item.title || '',
      category_id: item.category_id || '',
      price: item.price || 0,
      description: item.description || '',
      display_order: item.display_order ?? 0
    })

  } else {
    isAvailable.value = true
    imagePreview.value = null
    selectedFile.value = null

    setFormConfig(itemFieldsConfig.value, handleSubmit, {
      category_id: categoryStore.categories[0]?.id || '',
    })
  }
}, { immediate: true })
</script>

<template>
  <div v-if="isOpen" @click.self="closeModal"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div
      class="bg-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 rounded-card border border-primary/10 shadow-2xl text-right flex flex-col gap-fluid">


      <!-- عنوان المودال -->
      <h3 class="text-fluid-h3 font-bold text-primary border-b border-primary/5 pb-2">
        {{ editingItem ? 'تعديل صنف' : 'إضافة صنف جديد' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

        <!-- استدعاء فورم النظام العام وتمرير كل المحتويات في مكانها الهندسي السليم -->
        <UiBaseForm>

          <!-- أولاً: حقن الحقول الخاصة (الصورة والـ Checkbox) لتظهر قبل الأزرار -->
          <template #extra-fields>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-fluid items-start mt-2">

              <!-- حقل الصورة المطور -->
              <div class="flex flex-col gap-1.5 text-right">
                <label class="block text-fluid-xs font-medium text-primary">صورة الصنف</label>
                <div class="flex items-center gap-3">
                  <div v-if="imagePreview"
                    class="relative w-14 h-14 rounded-xl overflow-hidden border border-primary/20 shrink-0">
                    <img :src="imagePreview" class="w-full h-full object-cover" />
                    <button type="button" @click="{ imagePreview = null; selectedFile = null; }"
                      class="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-sm font-bold opacity-0 hover:opacity-100 transition-opacity">×</button>
                  </div>
                  <input type="file" @change="handleFileChange" accept="image/*"
                    class="w-full p-2 rounded-xl bg-bg border border-primary/10 text-text/80 text-fluid-xs cursor-pointer file:ml-2 file:py-0.5 file:px-2.5 file:rounded-md file:border-0 file:text-fluid-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
              </div>

              <!-- حقل الـ Checkbox الخاص بالإتاحة -->
              <div class="flex items-center gap-2 pt-6 text-right">
                <input v-model="isAvailable" type="checkbox" id="is_available"
                  class="w-4 h-4 accent-primary rounded border-primary/20 text-primary cursor-pointer" />
                <label for="is_available" class="text-fluid-xs font-bold text-text cursor-pointer select-none">الصنف
                  متاح للطلب حالياً</label>
              </div>

            </div>
          </template>

          <!-- ثانياً: حقن زر الإلغاء بجانب زر الحفظ في نهاية الفورم تماماً -->
          <template #actions>
            <button type="button" @click="closeModal"
              class="px-5 py-2.5 rounded-xl bg-bg border border-primary/10 text-text font-bold text-xs cursor-pointer transition-colors hover:bg-primary/5">
              إلغاء
            </button>
          </template>

        </UiBaseForm>

        <!-- إظهار رسائل الخطأ الجانبية إن وُجدت في الأسفل خالص -->
        <p v-if="errorMessage" class="text-red-500 text-xs bg-red-500/10 p-2.5 rounded-lg mt-2">{{ errorMessage }}</p>

      </form>

    </div>
  </div>
</template>
