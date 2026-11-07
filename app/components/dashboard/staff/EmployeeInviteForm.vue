<!-- app/components/dashboard/profile/EmployeeInviteForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from '~/composables/useForm'

const authrStore = useAuthStore()
const staffStore = useStaffStore()
// 1. إنشاء نسخة مستقلة تماماً ومحمية لفورم الموظفين لعدم تداخل البيانات
const formInstance = useForm()
const { setFormConfig, formDataPayload, isSubmitting, resetForm } = formInstance

// 2. حقن الـ Instance للـ BaseForm الابن عبر الـ الـ Provide النقي
provide('current_form_instance', formInstance)

// 3. تحديد هيكل الحقول وخيارات الرتب (Roles) المتوافقة مع الـ Back-end
const employeeFieldsConfig: FormField[] = [
  {
    column: 'username',
    value: '',
    label: 'اسم الموظف',
    required: true,
    type: 'text',
    colspan: 'col-span-3 sm:col-span-1 md:col-span-1',
  },
  {
    column: 'email',
    value: '',
    label: 'البريد الإلكتروني للموظف',
    required: true,
    type: 'text',
    colspan: 'col-span-3 sm:col-span-1 md:col-span-1',
  },
  {
    column: 'roles',
    value: '2001', // القيمة الابتدائية الافتراضية (Editor)
    label: 'الصلاحية / الرتبة',
    required: true,
    type: 'select',
    colspan: 'col-span-3 sm:col-span-1 md:col-span-1',
    options: [
      { label: 'مستخدم عادي (User)', value: '2001' },
      { label: 'محرر (Editor)', value: '1984' },
    ]
  },
  {
    column: 'password',
    value: '',
    label: 'كلمة المرور',
    required: true,
    type: 'password',
    colspan: 'col-span-3 sm:col-span-1 md:col-span-1',
  },
  {
    column: 'confirmPassword',
    value: '',
    label: 'تأكيد كلمة المرور',
    required: true,
    type: 'password',
    colspan: 'col-span-3 sm:col-span-1 md:col-span-1',
  },

]

// 4. دالة الإرسال لربطها بالـ Backend (عبر الـ Store المجهز مستقبلاً للـ Employees)
const handleEmployeeSubmit = async () => {
  const payload = formDataPayload.value
  if (Object.keys(payload)?.length < 1) return

  if (payload.password !== payload.confirmPassword) {
    const notiStore = useNotificationStore()
    notiStore.show('كلمة المرور وتأكيدها غير متطابقين!', 'error')
    return
  }

  delete payload.confirmPassword
  isSubmitting.value = true

  const isSuccess = await staffStore.createStaff(payload)

  if (isSuccess) {
    resetForm()
    const router = useRouter()
    router.push('/dashboard/staff')
  }
}

// 5. التحقق من صلاحية المستخدم الحالي (هل هو Admin؟) بناءً على الكود الرقمي '5150' القادم من سيرفرك
const isAdmin = computed(() => authrStore.isAdmin)

onMounted(() => {
  resetForm()
  // لا نقوم بشحن وتهيئة الفورم إلا إذا كان المستخدم بالفعل مدير نظام (Admin)
  if (isAdmin.value) {
    setFormConfig(employeeFieldsConfig, handleEmployeeSubmit)
  }
})
</script>

<template>
  <!-- حماية صارمة على مستوى الـ UI: الفورم يختفي كلياً عن الـ Editor ولا يراه إلا الـ Admin فقط -->

  <div v-if="isAdmin" class="max-w-6xl mx-auto my-section-fluid">

    <h3
      class="text-fluid-h3 text-text font-bold mb-section-fluid border-b border-primary/10 pb-2 flex items-center gap-fluid md:hover:text-primary">
      <Icon name="lucide:user-plus" class="w-5 h-5 text-primary" />
      <span>إضافة موظف جديد للنظام</span>
    </h3>

    <div
      class="p-section-fluid   bg-card border border-primary/20 rounded-card shadow-soft flex flex-col justify-between">
      <UiBaseForm>
        <template #actions>
          <NuxtLink to='/dashboard/staff' class="btn-danger">
            إلغاء
          </NuxtLink>
        </template>
      </UiBaseForm>
    </div>

  </div>

</template>
