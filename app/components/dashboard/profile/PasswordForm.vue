<!-- app/components/dashboard/profile/PasswordForm.vue -->
<script setup lang="ts">
import type { ChangePasswordType } from "@/schemas/userSchema/userSchema";
import { useProfileState } from "@/composables/profile/useProfileState";
import { useForm } from "~/composables/useForm";

const formInstance = useForm();
const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
  formInstance;
provide("current_form_instance", formInstance);

const { handleSubmit, userStore, notiStore } = useProfileState();

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

const onSuccessReset = (isSuccess: boolean) => {
  if (!isSuccess) return;

  resetForm();
  handleSetFormConfig();
};

const submit = () => {
  const newPassword = formDataPayload.value.newPassword;
  const confirmPassword = formDataPayload.value.confirmPassword;
  const isPasswordExist = newPassword && confirmPassword;
  const isPasswordNotMatch = isPasswordExist && newPassword !== confirmPassword;

  if (isPasswordNotMatch) {
    const msg = "كلمة المرور الجديدة وتأكيدها غير متطابقين!";
    notiStore.show(msg, "error");
    return;
  }

  handleSubmit(
    formDataPayload.value as ChangePasswordType["body"] & {
      confirmPassword: string;
    },
    isSubmitting,
    () =>
      userStore.changePassword(
        formDataPayload.value as ChangePasswordType["body"],
      ),
    onSuccessReset,
  );
};

const handleSetFormConfig = () => {
  setFormConfig(passwordFieldsConfig, () => submit());
};

onMounted(() => {
  resetForm();
  handleSetFormConfig();
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
