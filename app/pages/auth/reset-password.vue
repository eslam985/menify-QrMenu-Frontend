<!-- app/pages/auth/reset-password.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useAuthService } from "@/services/authService";

definePageMeta({ middleware: "guest" });

const { confirmPasswordReset } = useAuthService();
const router = useRouter();

const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Client-side validation before hitting the API
const validate = (): string | null => {
  if (!email.value.trim()) return "البريد الإلكتروني مطلوب";
  if (!/^\d{6}$/.test(otp.value.trim()))
    return "رمز التحقق يجب أن يكون 6 أرقام";
  if (newPassword.value.length < 8)
    return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  if (newPassword.value !== confirmPassword.value)
    return "كلمتا المرور غير متطابقتين";
  return null;
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const validationError = validate();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isLoading.value = true;
  try {
    const res = await confirmPasswordReset({
      email: email.value.trim().toLowerCase(),
      otp: otp.value.trim(),
      newPassword: newPassword.value,
    });

    if (res?.success) {
      successMessage.value =
        "تم تغيير كلمة المرور بنجاح! سيتم توجيهك لصفحة الدخول...";
      setTimeout(() => router.push("/auth/login"), 2500);
    }
  } catch (err: any) {
    const msg =
      err?.data?.message ??
      err?.data?.errors?.otp?.[0] ??
      err?.message ??
      "رمز التحقق غير صالح أو منتهي الصلاحية. يرجى طلب كود جديد.";
    errorMessage.value = msg;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="px-fluid mx-auto flex min-h-[80vh] w-full items-center justify-center 2xl:max-w-[90%]"
  >
    <div
      class="bg-card my-section-fluid border-primary/10 shadow-soft w-full max-w-md rounded-2xl border p-8 text-right"
    >
      <!-- Header -->
      <div class="mb-section-fluid">
        <h1 class="text-primary text-fluid-p font-bold">
          إعادة تعيين كلمة المرور
        </h1>
        <p class="text-text/60 text-fluid-xs mt-1">
          أدخل الرمز الذي وصلك على بريدك الإلكتروني مع كلمة المرور الجديدة.
        </p>
      </div>

      <!-- Success state -->
      <div
        v-if="successMessage"
        class="bg-success/10 p-fluid text-fluid-sm text-success flex items-start gap-2 rounded-xl"
      >
        <Icon name="heroicons:check-circle" class="mt-0.5 shrink-0" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form -->
      <form
        v-else
        class="gap-fluid flex flex-col"
        @submit.prevent="handleSubmit"
      >
        <!-- Email -->
        <div class="flex flex-col gap-1">
          <label for="email" class="text-text text-fluid-sm font-medium">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="example@email.com"
            required
            class="border-primary/20 focus:border-primary focus:ring-primary/20 bg-background text-text placeholder:text-text/40 w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2"
          />
        </div>

        <!-- OTP -->
        <div class="flex flex-col gap-1">
          <label for="otp" class="text-text text-fluid-sm font-medium">
            رمز التحقق (6 أرقام)
          </label>
          <input
            id="otp"
            v-model="otp"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            placeholder="000000"
            required
            class="border-primary/20 focus:border-primary focus:ring-primary/20 bg-background text-text placeholder:text-text/40 w-full rounded-xl border px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] transition-all outline-none focus:ring-2"
          />
        </div>

        <!-- New Password -->
        <div class="flex flex-col gap-1">
          <label for="new-password" class="text-text text-fluid-sm font-medium">
            كلمة المرور الجديدة
          </label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            autocomplete="new-password"
            placeholder="8 أحرف على الأقل"
            minlength="8"
            required
            class="border-primary/20 focus:border-primary focus:ring-primary/20 bg-background text-text placeholder:text-text/40 w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2"
          />
        </div>

        <!-- Confirm Password -->
        <div class="flex flex-col gap-1">
          <label
            for="confirm-password"
            class="text-text text-fluid-sm font-medium"
          >
            تأكيد كلمة المرور
          </label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="أعد إدخال كلمة المرور"
            required
            class="border-primary/20 focus:border-primary focus:ring-primary/20 bg-background text-text placeholder:text-text/40 w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2"
          />
        </div>

        <p
          v-if="errorMessage"
          class="bg-danger/10 p-fluid text-fluid-sm text-danger rounded-xl"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isLoading"
          class="bg-primary p-fluid flex items-center justify-center gap-2 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon v-if="isLoading" name="svg-spinners:3-dots-fade" />
          <span>{{ isLoading ? "جاري التحديث..." : "تعيين كلمة المرور" }}</span>
        </button>

        <!-- Links -->
        <div class="gap-fluid flex flex-col text-center">
          <div class="text-text/60 text-fluid-xs">
            لم يصلك الرمز؟
            <NuxtLink
              to="/auth/forgot-password"
              class="text-primary font-bold hover:underline"
            >
              طلب رمز جديد
            </NuxtLink>
          </div>
          <div class="text-text/60 text-fluid-xs">
            <NuxtLink
              to="/auth/login"
              class="text-primary font-bold hover:underline"
            >
              ← العودة لتسجيل الدخول
            </NuxtLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
