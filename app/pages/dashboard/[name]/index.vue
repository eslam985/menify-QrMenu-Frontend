<!-- app/components/dashboard/restaurant/RestaurantForm.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

import { useForm, type FormField } from '~/composables/useForm'

const restaurantStore = useRestaurantStore()

const formInstance = useForm()
const { setFormConfig, setWorkingHoursConfig, formDataPayload, isSubmitting, resetForm  } = formInstance

provide('current_form_instance', formInstance)

// 1. تعريف بنية وتكوين حقول المطعم (Configuration) متوافقة مع الـ FormField Type
const restaurantFieldsConfig: FormField[] = [
  { column: 'name', value: '', label: 'اسم المطعم او الكافية', required: true, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'phone', value: '', label: 'رقم الهاتف', required: true, type: 'tel', colspan: 'col-span-3 md:col-span-1' },
  { column: 'whatsapp', value: '', label: 'رقم واتساب', required: false, type: 'tel', colspan: 'col-span-3 md:col-span-1' },
  { column: 'currency', value: '', label: 'العملة مثل (EGP | جنيه)', required: true, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'address', value: '', label: 'عنوان المطعم او الكافية', required: false, type: 'text', colspan: 'col-span-3 md:col-span-2' },
  { column: 'maps_url', value: '', label: 'رابط عنوان المكان (GPS)', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'instagram_url', value: '', label: 'رابط انستجرام', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'facebook_url', value: '', label: 'رابط فيسبوك', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'timezone', value: '', label: 'المنطقة او البلد', required: false, type: 'text', colspan: 'col-span-3 md:col-span-1' },
  { column: 'description', value: '', label: 'الوصف', required: false, type: 'textarea', colspan: 'col-span-3' }
]

// 2. دالة الإرسال المركزية التي سيستدعيها الـ BaseForm ديناميكياً عند الـ submit
const handleRestaurantSubmit = async () => {
  isSubmitting.value = true
  try {
    // نأخذ نسخة عميقة من الـ payload المجمع تلقائياً بواسطة الـ Composable
    const payload = { ...formDataPayload.value }

    // إرسال البيانات النصية ومواعيد العمل إلى الـ Store الخاص بك مباشرة
    await restaurantStore.updateRestaurant(payload)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  // resetForm()

  restaurantStore.isLoading = true
  try {
    // جلب بيانات المطعم الحالية من السيرفر
    await restaurantStore.fetchRestaurant()
    const restaurantData = restaurantStore.restaurant as Record<string, any>

    if (restaurantData) {
      // شحن الـ Composable بالهيكل والبيانات النصية مع تمرير دالة الحفظ
      setFormConfig(restaurantFieldsConfig, handleRestaurantSubmit, restaurantData)

      // تشريح وشحن ساعات العمل المفعّلة إن وجدت داخل الـ Composable
      if (restaurantData.working_hours) {
        setWorkingHoursConfig(restaurantData.working_hours)
      }
    }
  } finally {
    restaurantStore.isLoading = false
  }
})
onUnmounted(() => {
  resetForm()
})
</script>

<template>
  <div v-if="restaurantStore.isLoading" class="flex items-center justify-center p-fluid">
    <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
    <span class="mx-2 text-text/60">جاري تحميل بيانات المطعم...</span>
  </div>

  <div v-else-if="restaurantStore.restaurant"
    class="max-w-6xl mx-auto w-full my-fluid p-section-fluid bg-card rounded-card shadow-soft border border-primary/5">
    <!-- استدعاء الفورم الموحد في سطر واحد وبدون أي Props أو تعقيد -->
    <UiBaseForm />
  </div>
</template>
