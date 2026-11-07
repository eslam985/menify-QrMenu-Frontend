export const useStaffService = () => {
  const { apiFetch } = useApi();

  async function getStaff() {
    const res = await apiFetch("/staff", {
      method: "get",
    });

    return res;
  }

  async function createStaff(body: Record<string, any>) {
    const res = await apiFetch("/staff", {
      method: "post",
      body,
    });

    return res;
  }

  async function updateStaffRole(staffId: string, roles: string) {
    const res = await apiFetch(`/staff/${staffId}`, {
      method: "patch",
      roles,
    });

    return res;
  }

  async function deleteStaff(staffId: string) {
    const res = await apiFetch(`/staff/${staffId}`, {
      method: "delete",
    });

    return res;
  }

  return { getStaff, createStaff, updateStaffRole, deleteStaff };
};
