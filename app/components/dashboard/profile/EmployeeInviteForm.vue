<!-- app/components/dashboard/profile/EmployeeInviteForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from '~/composables/useForm'

const authrStore = useAuthStore()
const userStore = useUserStore()
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
    label: 'اسم الموظف (Name)',
    required: true,
    type: 'text',
    colspan: 'col-span-3'

  },
  {
    column: 'email',
    value: '',
    label: 'البريد الإلكتروني للموظف (Email)',
    required: true,
    type: 'text',
    colspan: 'col-span-3'

  },
  {
    column: 'role',
    value: '2001', // القيمة الابتدائية الافتراضية (Editor)
    label: 'الصلاحية / الرتبة (Role)',
    required: true,
    type: 'select',
    colspan: 'col-span-3',
    options: [
      { label: 'مستخدم عادي (User)', value: '2001' },
      { label: 'محرر (Editor)', value: '1984' },
    ]
  }
]

// 4. دالة الإرسال لربطها بالـ Backend (عبر الـ Store المجهز مستقبلاً للـ Employees)
const handleEmployeeSubmit = async () => {
  isSubmitting.value = true
  try {
    // هنا سيتم تمرير الـ Payload المجمع تلقائياً (username, email, role)
    console.log('Employee Payload:', formDataPayload.value)
    // await userStore.inviteNewEmployee(formDataPayload.value)
    
  } finally {
    isSubmitting.value = false
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
  <div v-if="isAdmin"
    class="p-fluid bg-card border border-primary/20 rounded-card shadow-soft flex flex-col justify-between h-full">
    <h3 class="text-fluid-p text-primary font-bold mb-fluid border-b border-primary/5 pb-2 flex items-center gap-2">
      <Icon name="lucide:user-plus" class="w-5 h-5 text-primary" />
      <span>إضافة موظف جديد للنظام</span>
    </h3>

    <div class="mt-fluid">
      <!-- استدعاء الفورم الموحد مع تمرير الـ Key المخصص والمستقل له -->
      <UiBaseForm  />
    </div>
  </div>
</template>
