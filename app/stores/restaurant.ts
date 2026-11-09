import type { RestaurantResponse } from "@/types/dataType/restaurantType";
import { defineStore } from "pinia";
import { useRestaurantService } from "~/services/restaurantService";

export const useRestaurantStore = defineStore("restaurant", () => {
  const restaurantService = useRestaurantService();
  const notiStore = useNotificationStore();

  const restaurant = ref<RestaurantResponse | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const restaurantStatus = computed(
    () => (restaurant.value as { status?: string } | null)?.status,
  );

  const subscription_ends_at = computed(
    () =>
      (restaurant.value as { subscription_ends_at?: string } | null)
        ?.subscription_ends_at,
  );

  const joinIn = computed(
    () => (restaurant.value as { created_at?: string } | null)?.created_at,
  );

  async function fetchRestaurant() {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    try {
      const res = await restaurantService.getRestaurant();

      if (!res || !res.success) return false;
      console.log("res.data: ", res.data);
      successMessage.value = res.message;
      restaurant.value = res.data;
      return res.data;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateRestaurant(body: Record<string, unknown>) {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    try {
      const res = await restaurantService.updateRestaurant(body);

      if (!res || !res.success) return false;

      console.log("res.data: ", res.data);
      successMessage.value = res.message || "تم رفع صورة الصنف بنجاح!";
      notiStore.show(successMessage.value, "success");

      restaurant.value = res.data;
      return res.data;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadLogo(formData: FormData) {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    try {
      const res = await restaurantService.uploadLogo(formData);
      if (!res || !res.success) return false;

      console.log(res);
      restaurant.value = res.data;

      notiStore.show(res.message || "تم رفع صورة الصنف بنجاح!", "success");
      return res;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteLogo() {
    isLoading.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    try {
      const res = await restaurantService.deleteLogo();
      if (!res || !res.success) return false;

      console.log(res);
      restaurant.value = res.data;

      notiStore.show(res.message || "تم حذف الصورة نجاح", "success");
      return res;
    } catch (err: unknown) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    restaurant,
    isLoading,
    errorMessage,
    successMessage,
    restaurantStatus,
    subscription_ends_at,
    joinIn,
    fetchRestaurant,
    updateRestaurant,
    uploadLogo,
    deleteLogo,
  };
});
