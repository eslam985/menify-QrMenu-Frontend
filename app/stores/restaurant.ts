import type { RestaurantResponse } from "@/types/dataType/restaurantType";
import { defineStore } from "pinia";
import type { UpdateRestaurantType } from "~/schemas/restaurantSchema/restaurantSchema";
import { useRestaurantService } from "~/services/restaurantService";

export const useRestaurantStore = defineStore("restaurant", () => {
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();
  const restaurantService = useRestaurantService();

  const restaurant = ref<RestaurantResponse | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isLoaded = ref(false);

  const restaurantStatus = computed(() => restaurant.value?.status);
  const subscription_ends_at = computed(
    () => restaurant.value?.subscription_ends_at,
  );
  const joinIn = computed(() => restaurant.value?.created_at);

  async function fetchRestaurant(force = false) {
    if (isLoading.value) return false;
    if (!force && isLoaded.value) return true;

    isLoading.value = true;

    try {
      const res = await restaurantService.getRestaurant();

      if (!res || !res.success || !res.data) return false;

      restaurant.value = res.data;
      isLoaded.value = true;
      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل جلب البيانات ! ");
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateRestaurant(body: UpdateRestaurantType["body"]) {
    if (
      isSaving.value ||
      typeof body !== "object" ||
      Object.keys(body).length < 1
    )
      return false;
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    isSaving.value = true;

    try {
      const res = await restaurantService.updateRestaurant(body);

      const errMsg = "فشل تحديث البيانات ! ";
      const successMsg = "تم تحديث البيانات بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      restaurant.value = res.data;
      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل تحديث البيانات ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function uploadLogo(formData: FormData) {
    if (isSaving.value || !formData) return false;
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    isSaving.value = true;
    try {
      const res = await restaurantService.uploadLogo(formData);
      const errMsg = "فشل رفع الصورة";
      const successMsg = "تم رفع الصورة بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;
      restaurant.value = res.data;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل رفع الصورة");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function deleteLogo() {
    if (isSaving.value) return false;
    if (!authStore.checkRole(authStore.isAdmin, "Admin")) return false;

    const confirmMsg = "هل أنت متأكد من حذف شعار المطعم؟";
    const isConfirmed = await confirmStore.ask(confirmMsg);
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await restaurantService.deleteLogo();
      const errMsg = "فشل حذف الصورة";
      const successMsg = "تم حذف الصورة بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      restaurant.value = res.data;

      return res.success;
    } catch (err) {
      handleGlobalError(err, "فشل حذف الصورة");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    restaurant,
    isLoading,
    isSaving,
    isLoaded,
    restaurantStatus,
    subscription_ends_at,
    joinIn,
    fetchRestaurant,
    updateRestaurant,
    uploadLogo,
    deleteLogo,
  };
});
// 123
