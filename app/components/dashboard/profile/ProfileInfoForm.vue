<!-- app/components/dashboard/profile/ProfileInfoForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from '~/composables/useForm'
import { useUserStore } from '~/stores/user'

// إنشاء نسخة مستقلة تماماً وخاصة بفورم البروفايل
const formInstance = useForm()
const { setFormConfig, formDataPayload, isSubmitting, resetForm } = formInstance

provide('current_form_instance', formInstance)

const userStore = useUserStore()
const authStore = useAuthStore()

// 1. تحديد هيكل الحقول المطلوب تعديلها للمستخدم
const profileFieldsConfig: FormField[] = [
  {
    column: 'username',
    value: '',
    label: 'اسم المستخدم',
    required: true,
    type: 'text',
    colspan: 'col-span-3 md:col-span-3'
  },
  {
    column: 'email',
    value: '',
    label: 'البريد الإلكتروني',
    required: true,
    type: 'text',
    colspan: 'col-span-3 md:col-span-3'
  }
]

// 2. دالة الحفظ المركزية التي يطلقها الـ BaseForm ديناميكياً عند الـ Submit
const handleProfileSubmit = async () => {
  const payload = formDataPayload.value
  if (Object.keys(payload)?.length < 1) return
  isSubmitting.value = true
  try {
    // إرسال الـ Payload الصافي (username, email) المجمع تلقائياً إلى الـ Store الخاص بك
    await userStore.updateUserInfo(payload)

  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  resetForm()

  userStore.isLoading = true
  try {
    const currentInfo = authStore.user as Record<string, any>

    if (currentInfo) {
      // شحن الـ Composable بالهيكل وتغذية الحقول بالقيم الحالية مع ربط دالة الحفظ
      setFormConfig(profileFieldsConfig, handleProfileSubmit, currentInfo)
    }
  } finally {
    userStore.isLoading = false
  }
})

</script>

<!-- app/components/dashboard/profile/ProfileInfoForm.vue -->
<template>
  <div v-if="userStore.isLoading"
    class="flex items-center justify-center p-fluid bg-card rounded-card border border-primary/20 shadow-soft h-100">
    <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-primary" />
    <span class="mx-2 text-text/60 text-fluid-sm">جاري جلب بيانات الحساب...</span>
  </div>

  <div v-else
    class="p-fluid bg-card border border-primary/20 rounded-card shadow-soft flex flex-col justify-between h-full">
    <div>
      <h3 class="text-fluid-p text-primary font-bold mb-fluid border-b border-primary/5 pb-2 flex items-center gap-2">
        <Icon name="lucide:user" class="w-5 h-5 text-primary" />
        <span>تحديث البيانات الأساسية</span>
      </h3>
      <div class="mt-fluid">
        <UiBaseForm />
      </div>
    </div>
  </div>
</template>
