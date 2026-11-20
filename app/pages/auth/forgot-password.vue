<!-- app/pages/auth/forgot-password.vue -->
<script setup lang="ts">
definePageMeta({ middleware: "guest" });

const authStore = useAuthStore();
const email = ref("");

const handleSubmit = async () => {
  if (!email.value.trim()) {
    authStore.errorMessage = "يرجى إدخال البريد الإلكتروني";
    return;
  }

  await authStore.requestPasswordReset(email.value.trim().toLowerCase());
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
      <div v-if="authStore.successMessage" class="gap-fluid flex flex-col">
        <div
          class="bg-success/10 p-fluid text-fluid-sm text-success flex items-start gap-2 rounded-xl"
        >
          <Icon name="heroicons:check-circle" class="mt-0.5 shrink-0" />
          <span>{{ authStore.successMessage }}</span>
        </div>

        <div class="flex justify-center mt-fluid">
          <NuxtLink 
            to="/auth/reset-password"
            class="btn-primary p-fluid text-center"
          >
            أدخل رمز التحقق →
          </NuxtLink>
        </div>

        <div class="text-text/60 text-fluid-xs text-center">
          <button
            class="text-primary font-medium hover:underline"
            :disabled="authStore.isLoading"
            @click="handleSubmit"
          >
            إعادة إرسال الرمز
          </button>
        </div>
      </div>

      <!-- Form -->
      <form
        v-else
        class="gap-fluid flex flex-col"
        @submit.prevent="handleSubmit"
      >
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

        <p
          v-if="authStore.errorMessage"
          class="bg-danger/10 p-fluid text-fluid-sm text-danger rounded-xl"
        >
          {{ authStore.errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="authStore.isLoading || authStore.isLoaded || !email"
          class="btn-primary"
        >
          <Icon v-if="authStore.isLoading" name="svg-spinners:3-dots-fade" />
          <span>{{
            authStore.isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"
          }}</span>
        </button>

        <div class="text-text/60 text-fluid-xs text-center">
          تذكرت كلمة المرور؟
          <NuxtLink
            to="/auth/login"
            class="text-primary font-bold hover:underline"
          >
            تسجيل الدخول
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
