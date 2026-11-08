// Menify/frontend/app/stores/staff.ts
import { defineStore } from "pinia";
import { useStaffService } from "@/services/staffService";
import type { StaffResponse } from '@/types/dataType/staffType'
import type { CreateStaffType, UpdateStaffRoleType } from '@/schemas/staffSchema/staffSchema' 

export const useStaffStore = defineStore("staff", () => {
  const notiStore = useNotificationStore();
  const confirmStore = useConfirmStore();
  const staffService = useStaffService();

  const staff = ref<StaffResponse[]>([]);
  const successMessage = ref("");
  const errorMessage = ref("");
  const isLoading = ref(false);

  const staffCount = computed(() => staff.value.length);
  const adminsCount = computed(()=> staff.value.filter((u)=> u.roles === '5150').length) 
  const editorsCount = computed(()=> staff.value.filter((u)=> u.roles === '1984').length) 
  const usersCount = computed(()=> staff.value.filter((u)=> u.roles === '2001').length) 

  function getEmployeeById(id: string) {
    if (!id) return false;

    const result = staff.value.find((emp) => emp.id === id);

    if (!result) return false;

    return result;
  }

  async function getStaff() {
    if (isLoading.value) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.getStaff();

      if (!res || !res.success) return false;

      staff.value = res.data;
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

  async function createStaff(body: CreateStaffType['body']) {
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

  async function updateStaffRole(staffId: string, roles: UpdateStaffRoleType['body']) {
    if (isLoading.value || !staffId || !roles) return false;

    isLoading.value = true;
    successMessage.value = "";
    errorMessage.value = "";
    try {
      const res = await staffService.updateStaffRole(staffId, roles);

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
    adminsCount,
    editorsCount,
    usersCount,
    getEmployeeById,
    getStaff,
    createStaff,
    updateStaffRole,
    deleteStaff,
  };
});
