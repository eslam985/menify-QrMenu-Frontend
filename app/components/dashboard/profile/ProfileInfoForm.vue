<!-- app/components/dashboard/profile/ProfileInfoForm.vue -->
<script setup lang="ts">
import { useForm, type FormField } from "~/composables/useForm";
import type { UserResponse } from "~/types/userType/userType";
import type { UpdateUserByIdType } from "@/schemas/userSchema/userSchema";

const formInstance = useForm();
const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;

provide("current_form_instance", formInstance);

const userStore = useUserStore();
const authStore = useAuthStore();

const profileFieldsConfig: FormField[] = [
  {
    column: "username",
    value: "",
    label: "اسم المستخدم",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-3",
  },
  {
    column: "email",
    value: "",
    label: "البريد الإلكتروني",
    required: true,
    type: "text",
    colspan: "col-span-3 md:col-span-3",
  },
];

const handleProfileSubmit = async () => {
  const payload = formDataPayload.value;

  if (Object.keys(payload)?.length < 1) return;

  isSubmitting.value = true;

  try {
    await userStore.updateUserInfo(payload as UpdateUserByIdType["body"]);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  resetForm();

  userStore.isLoading = true;
  try {
    const currentInfo = authStore.user as UserResponse;

    if (currentInfo) {
      setFormConfig(profileFieldsConfig, handleProfileSubmit, {
        ...currentInfo,
      });
    }
  } finally {
    userStore.isLoading = false;
  }
});
</script>

<!-- app/components/dashboard/profile/ProfileInfoForm.vue -->
<template>
  <div
    v-if="userStore.isLoading"
    class="p-fluid bg-card rounded-card border-primary/20 shadow-soft flex h-100 items-center justify-center border"
  >
    <Icon name="lucide:loader-2" class="text-primary h-6 w-6 animate-spin" />
    <span class="text-text/60 text-fluid-sm mx-2"
      >جاري جلب بيانات الحساب...</span
    >
  </div>

  <div
    v-else
    class="p-fluid bg-card border-primary/20 rounded-card shadow-soft flex h-full flex-col justify-between border"
  >
    <div>
      <h3
        class="text-fluid-p text-primary mb-fluid border-primary/5 flex items-center gap-2 border-b pb-2 font-bold"
      >
        <Icon name="lucide:user" class="text-primary h-5 w-5" />
        <span>تحديث البيانات الأساسية</span>
      </h3>
      <div class="mt-fluid">
        <UiBaseForm />
      </div>
    </div>
  </div>
</template>
