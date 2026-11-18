<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    dir="rtl"
    class="bg-bg text-text px-fluid flex min-h-[75vh] w-full items-center justify-center py-8"
  >
    <div
      class="bg-card border-primary/15 shadow-soft p-section-fluid w-full max-w-lg rounded-3xl border text-center"
    >
      <div
        class="bg-primary/10 border-primary/20 text-primary mb-fluid mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border"
      >
        <Icon name="lucide:compass" class="h-10 w-10" />
      </div>

      <h1 class="text-primary text-fluid-h1 font-black tracking-tight">
        {{ error.status || 404 }}
      </h1>

      <h2 class="text-text text-fluid-h3 mt-3 font-bold">
        {{
          error.status === 404
            ? "عذراً، هذه الصفحة غير موجودة"
            : "حدث خطأ غير متوقع"
        }}
      </h2>

      <p class="text-text/60 text-fluid-sm mt-2 leading-relaxed">
        تأكد من صحة الرابط الذي تحاول الوصول إليه أو عد إلى الصفحة الرئيسية.
      </p>

      <button
        type="button"
        @click="handleClearError"
        class="btn-primary p-fluid mt-6 inline-flex items-center justify-center gap-2"
      >
        <Icon name="lucide:home" class="h-4 w-4" />
        <span>العودة للرئيسية</span>
      </button>
    </div>
  </div>
</template>
