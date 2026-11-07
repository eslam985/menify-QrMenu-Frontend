// Menify/frontend/app/stores/staff.ts
import { defineStore } from "pinia";
import { useStaffService } from "@/services/staffService";

export const useStaffStore = defineStore("staff", () => {
  const notiStore = useNotificationStore();
  const confirmStore = useConfirmStore();
  const staffService = useStaffService();

  const staff = ref<Record<string, any>[]>([]);
  const successMessage = ref("");
  const errorMessage = ref("");
  const isLoading = ref(false);

  const staffCount = computed(() => staff.value.length);

  async function getStaff() {
    if (isLoading.value) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.getStaff();

      if (!res || !res.success) return false;

      staff.value = res.data;
      console.log("res.data: ", res.data);
      return res.data;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function createStaff(body: Record<string, any>) {
    if (isLoading.value || Object.keys(body).length < 1) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.createStaff(body);

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      staff.value.push(res.data);

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateStaffRole(staffId: string, role: string) {
    if (isLoading.value || !staffId || !role) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.updateStaffRole(staffId, role);

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      const index = staff.value.findIndex((u) => u.id === staffId);

      if (index !== -1) staff.value.splice(index, 1, res.data);

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteStaff(staffId: string) {
    if (!staffId || isLoading.value) return false;

    const confirm = await confirmStore.ask("هل انت متأكد من حذف هذا الموظف ؟");
    if (!confirm) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.deleteStaff(staffId);

      if (!res || !res.success) return false;

      successMessage.value = res.message;
      notiStore.show(successMessage.value, "success");

      const index = staff.value.findIndex((u) => u.id === staffId);

      if (index !== -1) staff.value.splice(index, 1);

      return res.success;
    } catch (err) {
      const error = err as { data?: { message?: string } };
      errorMessage.value =
        error.data?.message ?? "An unexpected error occurred";
      notiStore.show(errorMessage.value, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    successMessage,
    errorMessage,
    staff,
    staffCount,
    getStaff,
    createStaff,
    updateStaffRole,
    deleteStaff,
  };
});
