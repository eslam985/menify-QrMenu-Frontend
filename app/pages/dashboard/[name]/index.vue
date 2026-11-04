<!-- app/pages/menu/[slug]/index.vue -->
<script setup lang="ts">
import BaseForm from '~/components/ui/BaseForm.vue';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const restaurantStore = useRestaurantStore()

</script>

<template>
  <div class="w-full mx-auto">
    <!-- خطأ في التحميل -->
    <div v-if="restaurantStore.errorMessage" class="text-center py-24" dir="rtl">
      <h1 class="text-2xl font-bold text-primary mb-2">
        {{ restaurantStore.errorMessage }}
      </h1>
    </div>

    <template v-else>
      <BaseForm />
    </template>
  </div>
</template>