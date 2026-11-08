<!-- /Menify/frontend/app/pages/dashboard/staff/new-employee/index.vue -->
<script setup lang="ts">

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

</script>

<template>
  <DashboardStaffEmployeeModel />
</template>
