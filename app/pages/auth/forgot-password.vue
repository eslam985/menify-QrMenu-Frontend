<!-- app/pages/auth/forgot-password.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useAuthService } from "@/services/authService";

definePageMeta({ middleware: "guest" });

const { requestPasswordReset } = useAuthService();

const email = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value.trim()) {
    errorMessage.value = "يرجى إدخال البريد الإلكتروني";
    return;
  }

  isLoading.value = true;
  try {
    const res = await requestPasswordReset(email.value.trim().toLowerCase());
    if (res?.success) {
      successMessage.value =
        "إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة بكود التحقق خلال دقيقة.";
    }
  } catch (err: any) {
    const msg = err?.data?.message ?? err?.message ?? "حدث خطأ، يرجى المحاولة لاحقاً.";
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
      class="bg-card border-primary/10 shadow-soft w-full max-w-md rounded-2xl border p-8 text-right"
    >
      <!-- Header -->
      <div class="mb-section-fluid">
        <h1 class="text-primary text-fluid-p font-bold">نسيت كلمة المرور؟</h1>
        <p class="text-text/60 text-fluid-xs mt-1">
          أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور.
        </p>
      </div>

      <!-- Success state -->
      <div v-if="successMessage" class="gap-fluid flex flex-col">
        <div
          class="bg-success/10 p-fluid text-fluid-sm text-success rounded-xl flex items-start gap-2"
        >
          <Icon name="heroicons:check-circle" class="mt-0.5 shrink-0" />
          <span>{{ successMessage }}</span>
        </div>
        <NuxtLink
          to="/auth/reset-password"
          class="bg-primary text-white p-fluid rounded-xl text-center font-semibold hover:opacity-90 transition-opacity"
        >
          أدخل رمز التحقق →
        </NuxtLink>
        <div class="text-text/60 text-fluid-xs text-center">
          <button
            class="text-primary hover:underline font-medium"
            :disabled="isLoading"
            @click="handleSubmit"
          >
            إعادة إرسال الرمز
          </button>
        </div>
      </div>

      <!-- Form -->
      <form v-else class="gap-fluid flex flex-col" @submit.prevent="handleSubmit">
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
            class="border-primary/20 focus:border-primary focus:ring-primary/20 bg-background text-text placeholder:text-text/40 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 transition-all"
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
          class="bg-primary text-white p-fluid rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Icon v-if="isLoading" name="svg-spinners:3-dots-fade" />
          <span>{{ isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق" }}</span>
        </button>

        <div class="text-text/60 text-fluid-xs text-center">
          تذكرت كلمة المرور؟
          <NuxtLink to="/auth/login" class="text-primary font-bold hover:underline">
            تسجيل الدخول
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
