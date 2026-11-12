<!-- app/pages/auth/login.vue -->
<script setup lang="ts">
import type { LoginUserType } from "@/schemas/userSchema/userSchema";
import { useForm, type FormField } from "~/composables/useForm";
import { useSubmitstate } from "#imports";
import { useLoginState } from "~/composables/auth/useLoginState";
const { authStore, safeRedirect } = useLoginState();
const { handleSubmit } = useSubmitstate();
definePageMeta({ middleware: "guest" });

const formInstance = useForm();
const { setFormConfig, formDataPayload, resetForm, isSubmitting } =
  formInstance;

provide("current_form_instance", formInstance);

const loginFieldsConfig: FormField[] = [
  {
    column: "email",
    value: "",
    label: "البريد الإلكتروني",
    required: true,
    type: "email",
    colspan: "col-span-3",
  },
  {
    column: "password",
    value: "",
    label: "كلمة المرور",
    required: true,
    type: "password",
    colspan: "col-span-3",
  },
];

const handleLoginSubmit = async () => {
  if (authStore.isLoading || isSubmitting.value) return;

  handleSubmit({
    formDataPayload: formDataPayload.value,
    isSubmitting,
    apiCall: () =>
      authStore.login(formDataPayload.value as LoginUserType["body"]),
    onSuccess: async (isSuccess) => {
      if (isSuccess) {
        resetForm();
        await navigateTo(safeRedirect());
      } else if (authStore.subscriptionInactive) {
        await navigateTo("/subscription-inactive");
        resetForm();
      }
    },
  });
};

onMounted(() => {
  resetForm();
  authStore.resetState();
  setFormConfig(loginFieldsConfig, handleLoginSubmit);
});
</script>

<template>
  <div
    class="px-fluid mx-auto flex min-h-[80vh] w-full items-center justify-center 2xl:max-w-[90%]"
  >
    <div
      class="bg-card border-primary/10 shadow-soft w-full max-w-md rounded-2xl border p-8 text-right"
    >
      <div class="mb-section-fluid">
        <h1 class="text-primary text-fluid-p font-bold">تسجيل الدخول</h1>
        <p class="text-text/60 text-fluid-xs mt-1">
          أدخل بيانات الحساب للوصول الآمن إلى لوحة التحكم
        </p>
      </div>

      <UiBaseForm>
        <template #extra-fields>
          <div class="gap-fluid mt-2 flex flex-col">
            <p
              v-if="authStore.errorMessage"
              class="bg-danger/10 p-fluid text-fluid-sm text-danger rounded-xl"
            >
              {{ authStore.errorMessage }}
            </p>

            <div class="text-text/60 text-fluid-xs mt-2 text-center">
              ليس لديك مطعم مسجل؟
              <NuxtLink
                to="/auth/register"
                class="text-primary font-bold hover:underline"
              >
                إنشاء مطعم جديد
              </NuxtLink>
            </div>
          </div>
        </template>
      </UiBaseForm>
    </div>
  </div>
</template>
