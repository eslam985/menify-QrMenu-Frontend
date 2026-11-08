import type { StaffResponse } from '@/types/dataType/staffType'
import type { CreateStaffType, UpdateStaffRoleType } from '@/schemas/staffSchema/staffSchema' 

export const useStaffService = () => {
  const { apiFetch } = useApi();

  async function getStaff() {

    const res = await apiFetch<BaseApiResponse<StaffResponse[]>>("/staff", {
      method: "get",
    });

    return res;
  }

  async function createStaff(body: CreateStaffType['body']) {

    const res = await apiFetch<BaseApiResponse<StaffResponse>>("/staff", {
      method: "post",
      body,
    });

    return res;
  }

  async function updateStaffRole(staffId: string, roles: UpdateStaffRoleType['body']) {

    const res = await apiFetch<BaseApiResponse<StaffResponse>>(`/staff/${staffId}`, {
      method: "PATCH",
      body: { roles },
    });

    return res;
  }


  async function deleteStaff(staffId: string) {

    const res = await apiFetch<BaseApiResponse<{ id: string }>>(`/staff/${staffId}`, {
      method: "delete",
    });

    return res;
  }

  return { getStaff, createStaff, updateStaffRole, deleteStaff };
};
