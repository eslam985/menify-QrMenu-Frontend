<!-- app/components/dashboard/profile/PasswordForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from "~/composables/useForm";

import type { ChangePasswordType } from "@/schemas/userSchema/userSchema";

const formInstance = useForm(); // إنشاء نسخة مستقلة تماماً وخاصة بالباسورد
const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;
// توصيل نسخة الباسورد المستقلة للـ BaseForm التابع له
provide("current_form_instance", formInstance);

const userStore = useUserStore();

// 1. تحديد هيكل الحقول الثلاثة لتأمين عملية تغيير كلمة المرور
const passwordFieldsConfig: FormField[] = [
  {
    column: "currentPassword",
    value: "",
    label: "كلمة المرور الحالية",
    required: true,
    type: "password",
    colspan: "col-span-3",
  },
  {
    column: "newPassword",
    value: "",
    label: "كلمة المرور الجديدة",
    required: true,
    type: "password",
    colspan: "col-span-3 ",
  },
  {
    column: "confirmPassword",
    value: "",
    label: "تأكيد كلمة المرور الجديدة",
    required: true,
    type: "password",
    colspan: "col-span-3",
  },
];

// 2. دالة الحفظ المركزية التي سيطلقها الـ BaseForm ديناميكياً عند الـ Submit
const handlePasswordSubmit = async () => {
  const payload = formDataPayload.value;

  if (Object.keys(payload)?.length < 1) return;

  // التحقق الفوري (Validation) من تطابق كلمة المرور الجديدة قبل إرسال الطلب للسيرفر
  if (payload.newPassword !== payload.confirmPassword) {
    const notiStore = useNotificationStore();
    notiStore.show("كلمة المرور الجديدة وتأكيدها غير متطابقين!", "error");
    return;
  }

  isSubmitting.value = true;

  const paylod = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  };

  try {
    // إرسال كائن البيانات الصافي (currentPassword, newPassword) للـ Store الخاص بك
    const isSuccess = await userStore.changePassword(
      paylod as ChangePasswordType["body"],
    );

    // إذا تم التغيير بنجاح، نقوم بتفريغ الحقول حمايةً للمستخدم
    if (isSuccess) {
      resetForm();
      setFormConfig(passwordFieldsConfig, handlePasswordSubmit);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 3. تطهير وتهيئة الـ Composable فور الدخول للصفحة بناءً على قرارنا الهندسي الأخير
onMounted(() => {
  resetForm();
  setFormConfig(passwordFieldsConfig, handlePasswordSubmit);
});
</script>

<!-- app/components/dashboard/profile/PasswordForm.vue -->
<template>
  <div
    class="p-fluid bg-card border-primary/20 rounded-card shadow-soft flex h-full flex-col justify-between border"
  >
    <div>
      <h3
        class="text-fluid-p text-primary mb-fluid border-primary/5 flex items-center gap-2 border-b pb-2 font-bold"
      >
        <Icon name="lucide:lock" class="text-primary h-5 w-5" />
        <span>تغيير كلمة المرور</span>
      </h3>
      <div class="mt-fluid">
        <UiBaseForm />
      </div>
    </div>
  </div>
</template>
