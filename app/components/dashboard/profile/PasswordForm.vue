<!-- app/components/dashboard/profile/PasswordForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from '~/composables/useForm'
import { useUserStore } from '~/stores/user'

const formInstance = useForm() // إنشاء نسخة مستقلة تماماً وخاصة بالباسورد
const { setFormConfig, formDataPayload, isSubmitting, resetForm } = formInstance
// توصيل نسخة الباسورد المستقلة للـ BaseForm التابع له
provide('current_form_instance', formInstance)

const userStore = useUserStore()

// 1. تحديد هيكل الحقول الثلاثة لتأمين عملية تغيير كلمة المرور
const passwordFieldsConfig: FormField[] = [
  {
    column: 'currentPassword',
    value: '',
    label: 'كلمة المرور الحالية',
    required: true,
    type: 'password',
    colspan: 'col-span-3'
  },
  {
    column: 'newPassword',
    value: '',
    label: 'كلمة المرور الجديدة',
    required: true,
    type: 'password',
    colspan: 'col-span-3 '
  },
  {
    column: 'confirmPassword',
    value: '',
    label: 'تأكيد كلمة المرور الجديدة',
    required: true,
    type: 'password',
    colspan: 'col-span-3'
  }
]

// 2. دالة الحفظ المركزية التي سيطلقها الـ BaseForm ديناميكياً عند الـ Submit
const handlePasswordSubmit = async () => {
  const payload = formDataPayload.value
  console.log(Object.keys(payload)?.length < 1)
  console.log(payload)
  if (Object.keys(payload)?.length < 1) return

  // التحقق الفوري (Validation) من تطابق كلمة المرور الجديدة قبل إرسال الطلب للسيرفر
  if (payload.newPassword !== payload.confirmPassword) {
    const notiStore = useNotificationStore()
    notiStore.show('كلمة المرور الجديدة وتأكيدها غير متطابقين!', 'error')
    return
  }

  isSubmitting.value = true
  try {
    // إرسال كائن البيانات الصافي (currentPassword, newPassword) للـ Store الخاص بك
    const isSuccess = await userStore.changePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword
    })

    // إذا تم التغيير بنجاح، نقوم بتفريغ الحقول حمايةً للمستخدم
    if (isSuccess) {
      resetForm()
      setFormConfig(passwordFieldsConfig, handlePasswordSubmit)
    }
  } finally {
    isSubmitting.value = false
  }
}

// 3. تطهير وتهيئة الـ Composable فور الدخول للصفحة بناءً على قرارنا الهندسي الأخير
onMounted(() => {
  resetForm()
  setFormConfig(passwordFieldsConfig, handlePasswordSubmit)
})
</script>

<!-- app/components/dashboard/profile/PasswordForm.vue -->
<template>
  <div
    class="p-fluid bg-card border border-primary/20 rounded-card shadow-soft flex flex-col justify-between h-full">
    <div>
      <h3 class="text-fluid-p text-primary font-bold mb-fluid border-b border-primary/5 pb-2 flex items-center gap-2">
        <Icon name="lucide:lock" class="w-5 h-5 text-primary" />
        <span>تغيير كلمة المرور</span>
      </h3>
      <div class="mt-fluid">
        <UiBaseForm />
      </div>
    </div>
  </div>
</template>
