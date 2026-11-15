import { useStaffSearch } from "~/composables/staff/useStaffSearch";

export const useStaffState = () => {
  const router = useRouter();
  const route = useRoute();

  const { searchQuery, setSearchQuery } = useStaffSearch();
  const notiStore = useNotificationStore();
  const staffStore = useStaffStore();
  const authStore = useAuthStore();

  const employeeId = computed(() => fromRouteQuery(route.params.id));
  const isEditMode = computed(() => Boolean(employeeId.value));
  const isAdmin = computed(() => authStore.isAdmin);

  const handleRefresh = async () => {
    const isSuccess = await staffStore.getStaff(true);
    if (isSuccess) notiStore.show("تم تحديث البيانات بنجاح", "success");
  };

  const handleDelete = async (staffId: string) => {
    if (!staffId) return;
    await staffStore.deleteStaff(staffId);
  };

  const filteredEmployee = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();
    if (!query) return staffStore.staff;

    return staffStore.staff.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  });

  const loadData = async () => {
    await staffStore.getStaff();
  };

  return {
    router,
    route,
    staffStore,
    authStore,
    employeeId,
    isEditMode,
    isAdmin,
    searchQuery,
    setSearchQuery,
    handleRefresh,
    handleDelete,
    filteredEmployee,
    loadData,
  };
};
