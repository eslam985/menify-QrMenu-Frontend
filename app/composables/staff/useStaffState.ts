import { useCategorySearch } from "~/composables/category/useCategorySearch";

export const useStaffState = () => {
  const router = useRouter();
  const route = useRoute();

  const { searchQuery } = useCategorySearch();
  const notiStore = useNotificationStore();
  const staffStore = useStaffStore();
  const authrStore = useAuthStore();
  const authStore = useAuthStore();

  const employeeId = computed(() => fromRouteQuery(route.params.id));
  const isEditMode = computed(() => Boolean(employeeId.value));
  const isAdmin = computed(() => authrStore.isAdmin);
  const DEFAULT_AVATAR: string =
    "https://res.cloudinary.com/dbahqgo8j/image/upload/blogger/iaeclevshfanh5j6x9ew.webp";

  const handleRefresh = async () => {
    const isSuccess = await staffStore.getStaff();

    if (isSuccess) notiStore.show("تم تحديث البيانات بنجاح", "success");
  };

  const handleDelete = async (staffId: string) => {
    if (!staffId) return;
    await staffStore.deleteStaff(staffId);
  };

  const role = (role: string): "Admin" | "Editor" | "User" | "N/A" => {
    if (!role) return "N/A";

    if (role === "5150") return "Admin";
    if (role === "1984") return "Editor";
    if (role === "2001") return "User";

    return "N/A";
  };

  const filteredEmployee = computed(() => {
    if (!searchQuery.value) return staffStore.staff;

    const query = searchQuery.value.toLowerCase().trim();

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
    authrStore,
    employeeId,
    isEditMode,
    isAdmin,
    authStore,
    DEFAULT_AVATAR,
    searchQuery,
    handleRefresh,
    handleDelete,
    role,
    filteredEmployee,
    loadData,
  };
};
