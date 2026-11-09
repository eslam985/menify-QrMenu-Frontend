<script setup lang="ts">
import { RolesList } from "~/stores/auth";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
  requiredRole: RolesList.Admin,
});
</script>

<template>
  <div class="w-full">
    <DashboardStaffHeader />
    <DashboardStaffTable />
  </div>
</template>
