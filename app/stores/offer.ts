// app/stores/offer.ts
import { defineStore } from "pinia";
import { useOfferService } from "~/services/offerService";
import type { OfferResponse } from "@/types/dataType/offerType";
import type {
  ListOffersType,
  CreateOfferType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";


export const useOfferStore = defineStore("offer", () => {
  const notiStore = useNotificationStore();
  const offerService = useOfferService();
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();

  const offers = ref<OfferResponse[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const offersCount = computed(() => offers.value?.length);
  const offersIsActiveCount = computed(() => offers.value.filter((offer) => offer.is_active).length);
  const offersIsNotActiveCount = computed(() => offers.value.filter((offer) => !offer.is_active).length);

  // جلب قائمة العروض
  async function fetchOffers(params?: ListOffersType['query']) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await offerService.getOffers(params);

      if (!res) return;

      offers.value = res.data || [];
    } catch (err: any) {
      error.value = err?.data?.message || "فشل تحميل العروض";
      notiStore.show(error.value!, "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // إضافة عرض جديد
  async function addOffer(body: CreateOfferType["body"]) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value) return false;

    isLoading.value = true;
    try {
      const res = await offerService.createOffer(body);
      if (!res.success) {
        notiStore.show(res.message || "فشل إضافة العرض", "error");
        return false;
      }

      offers.value.unshift(res.data);
      notiStore.show(
        res.message || `تم إضافة العرض "${body.title}" بنجاح!`,
        "success",
      );
      return true;
    } catch (err: any) {
      notiStore.show(err?.data?.message || "فشل إضافة العرض", "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // تحديث عرض
  async function updateOffer(id: string, body: UpdateOfferType["body"]) {
    if (!authStore.isEditorAndAbove) {
      notiStore.show(
        "هذا الإجراء يتطلب صلاحية محرر (Editor) أو أعلى!",
        "error",
      );
      return false;
    }

    if (isLoading.value || !id) return false;

    isLoading.value = true;
    try {
      const res = await offerService.updateOffer(id, body);
      const index = offers.value.findIndex((o) => o.id === id);
      if (index !== -1 && res.data) {
        offers.value[index] = res.data;
      }
      notiStore.show(res.message || "تم تحديث العرض بنجاح!", "success");
      return true;
    } catch (err: any) {
      notiStore.show(err?.data?.message || "فشل تحديث العرض", "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // حذف عرض
  async function removeOffer(id: string) {
    if (isLoading.value || !id) return false;
    if (!authStore.isAdmin) {
      notiStore.show("عذراً، حذف العروض متاح للآدمن (Admin) فقط.", "error");
      return false;
    }

    const isConfirmed = await confirmStore.ask(
      "هل أنت متأكد من حذف هذا العرض نهائياً؟",
      "تأكيد الحذف",
    );
    if (!isConfirmed) return false;

    isLoading.value = true;
    try {
      await offerService.deleteOffer(id);
      offers.value = offers.value.filter((o) => o.id !== id);
      notiStore.show("تم حذف العرض بنجاح!", "success");
      return true;
    } catch (err: any) {
      notiStore.show(err?.data?.message || "فشل حذف العرض", "error");
      console.error(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    offers,
    isLoading,
    error,
    offersCount,
    offersIsActiveCount,
    offersIsNotActiveCount,
    fetchOffers,
    addOffer,
    updateOffer,
    removeOffer,
  };
});
