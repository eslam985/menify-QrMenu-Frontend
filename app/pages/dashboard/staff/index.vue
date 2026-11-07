<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})


</script>

<template>
  <div class="w-full">
    <DashboardStaffHeader/>
    <DashboardStaffTable/>
  </div>
</template>