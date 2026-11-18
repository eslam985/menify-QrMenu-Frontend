<!-- app/error.vue -->

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <NuxtLayout name="default">
    <ErrorNotFound :error="error" />
  </NuxtLayout>
</template>
