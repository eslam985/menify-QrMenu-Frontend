<!-- app/pages/auth/login.vue -->
<script setup lang="ts">
import { useForm, type FormField } from "~/composables/useForm";
import type { LoginUserType } from "@/schemas/userSchema/userSchema";

definePageMeta({ middleware: "guest" });

const authStore = useAuthStore();
const route = useRoute();

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

const safeRedirect = (): string => {
  const r = String(route.query.redirect ?? "");
  return r.startsWith("/") && !r.startsWith("//") && !r.includes("\\")
    ? r
    : "/dashboard";
};

const handleLoginSubmit = async () => {
  if (authStore.isLoading || isSubmitting.value) return;

  isSubmitting.value = true;
  const payload = formDataPayload.value;

  const payloadLogin = {
    email: String(payload.email).trim(),
    password: String(payload.password),
  };

  const isSuccess = await authStore.login(
    payloadLogin as LoginUserType["body"],
  );

  if (isSuccess) {
    resetForm();
    await navigateTo(safeRedirect());
  } else if (authStore.subscriptionInactive) {
    await navigateTo("/subscription-inactive");
    resetForm();
  }
};

onMounted(() => {
  resetForm();
  authStore.resetState();
  setFormConfig(loginFieldsConfig, handleLoginSubmit);
});
</script>

<template>
  <div
    class="mx-auto flex min-h-[80vh] w-full items-center justify-center px-4 2xl:max-w-[90%]"
  >
    <div
      class="bg-card border-primary/10 shadow-soft w-full max-w-md rounded-2xl border p-8 text-right"
    >
      <div class="mb-6">
        <h1 class="text-primary text-2xl font-bold">تسجيل الدخول</h1>
        <p class="text-text/60 mt-1 text-xs">
          أدخل بيانات الحساب للوصول الآمن إلى لوحة التحكم
        </p>
      </div>

      <UiBaseForm>
        <template #extra-fields>
          <div class="gap-fluid mt-2 flex flex-col">
            <p
              v-if="authStore.errorMessage"
              class="rounded-xl bg-red-500/10 p-3 text-sm text-red-500"
            >
              {{ authStore.errorMessage }}
            </p>

            <div class="text-text/60 mt-2 text-center text-xs">
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
