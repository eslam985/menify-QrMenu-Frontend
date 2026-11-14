import { defineStore } from "pinia";
import { useStaffService } from "@/services/staffService";
import type { StaffResponse } from "@/types/dataType/staffType";
import type {
  CreateStaffType,
  UpdateStaffRoleType,
} from "@/schemas/staffSchema/staffSchema";

import { RolesList } from "~/constants/auth";

export const useStaffStore = defineStore("staff", () => {
  const confirmStore = useConfirmStore();
  const staffService = useStaffService();
  const authStore = useAuthStore();

  const staff = ref<StaffResponse[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isLoaded = ref(false);

  const staffCount = computed(() => staff.value.length);
  const adminsCount = computed(
    () => staff.value.filter((u) => Number(u.roles) === RolesList.Admin).length,
  );
  const editorsCount = computed(
    () => staff.value.filter((u) => Number(u.roles) === RolesList.Editor).length,
  );
  const usersCount = computed(
    () => staff.value.filter((u) => Number(u.roles) === RolesList.User).length,
  );


  function getEmployeeById(id: string) {
    if (!id) return false;

    const result = staff.value.find((emp) => emp.id === id);

    if (!result) return false;

    return result;
  }

  async function getStaff(force = false) {
    if (isLoading.value) return false;
    if (!force && isLoaded.value) return true;

    isLoading.value = true;
    try {
      const res = await staffService.getStaff();

      if (!res || !res.success) return false;

      staff.value = res.data;
      isLoaded.value = true
      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل جلب المستخدمين ! ");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function createStaff(body: CreateStaffType["body"]) {

    if (
      isSaving.value ||
      typeof body !== "object" ||
      Object.keys(body).length < 1
    )
      return false;

    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    isSaving.value = true;
    try {
      const res = await staffService.createStaff(body);

      const errMsg = "فشل إضافة المستخدم";
      const successMsg = "تم اضافة المستخدم بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      staff.value.push(res.data);

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل اضافة المستخدم ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateStaffRole(
    staffId: string,
    roles: UpdateStaffRoleType["body"],
  ) {
    if (isSaving.value || !staffId || !roles) return false;
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    isSaving.value = true;

    try {
      const res = await staffService.updateStaffRole(staffId, roles);

      const errMsg = "فشل تحديث صلاحية المستخدم !";
      const successMsg = "تم تحديث صلاحية المستخدم بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      const index = staff.value.findIndex((u) => u.id === staffId);
      if (index !== -1) staff.value.splice(index, 1, res.data);

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل تحديث صلاحية المستخدم ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteStaff(staffId: string) {
    
    if (!staffId || isSaving.value) return false;
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    const confirm = await confirmStore.ask("هل انت متأكد من حذف هذا الموظف ؟");
    if (!confirm) return false;

    isSaving.value = true;

    try {
      const res = await staffService.deleteStaff(staffId);

      const errMsg = "فشل حذف المستخدم !";
      const successMsg = "تم حذف المستخدم بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg, false);
      if (!isRes) return false;

      staff.value = staff.value.filter((s) => s.id !== staffId);

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل حذف المستخدم ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    isLoading,
    isSaving,
    isLoaded,
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
// 158
