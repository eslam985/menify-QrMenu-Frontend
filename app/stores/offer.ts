import type {
  CreateOfferType,
  ListOffersType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";
import type { OfferResponse } from "@/types/dataType/offerType";
import { defineStore } from "pinia";
import { useOfferService } from "~/services/offerService";

export const useOfferStore = defineStore("offer", () => {
  const notiStore = useNotificationStore();
  const offerService = useOfferService();
  const confirmStore = useConfirmStore();
  const authStore = useAuthStore();

  const offers = ref<OfferResponse[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const isLoaded = ref(false);

  const offersCount = computed(() => offers.value?.length);
  const offersIsActiveCount = computed(
    () => offers.value.filter((offer) => offer.is_active).length,
  );
  const offersIsNotActiveCount = computed(
    () => offers.value.filter((offer) => !offer.is_active).length,
  );

  async function fetchOffers(params?: ListOffersType["query"], force = false) {
    if (isLoading.value) return false;
    if (!force && !params && isLoaded.value) return true;
    isLoading.value = true;
    try {
      const res = await offerService.getOffers(params);

      if (!res || !res.success) return;

      offers.value = res.data || [];
      if (!params) isLoaded.value = true;
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل جلب العروض ! ");
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addOffer(body: CreateOfferType["body"]) {
    if (isSaving.value) return false;

    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor"))
      return false;

    if (typeof body !== "object" || Object.keys(body).length < 1) return false;

    if (
      body.offer_price !== null &&
      body.offer_price !== undefined &&
      body.offer_price < 1
    ) {
      const msg = `سعر  '  ${body.title ?? "الصنف"}  '  لا يجب ان يكون اصغر من 1`;
      notiStore.show(msg, "error");
      return false;
    }

    isSaving.value = true;
    try {
      const res = await offerService.createOffer(body);

      const errMsg = "فشل إضافة العرض";
      const successMsg = body.title
        ? `تم إضافة العرض "${body.title}" بنجاح!`
        : "تم اضافة العرض بنجاح!";

      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      offers.value.push(res.data);
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل اضافة العرض ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function updateOffer(id: string, body: UpdateOfferType["body"]) {
    if (isSaving.value || !id) return false;

    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor"))
      return false;

    if (typeof body !== "object" || Object.keys(body).length < 1) return false;

    if (
      body.offer_price !== null &&
      body.offer_price !== undefined &&
      body.offer_price < 1
    ) {
      const msg = `سعر  '  ${body.title ?? "الصنف"}  '  لا يجب ان يكون اصغر من 1`;
      notiStore.show(msg, "error");
      return false;
    }

    isSaving.value = true;
    try {
      const res = await offerService.updateOffer(id, body);

      const errMsg = "فشل تحديث العرض";
      const successMsg = "تم تحديث العرض بنجاح!";
      const isRes = handleApiResult(res, errMsg, successMsg);
      if (!isRes) return false;

      const index = offers.value.findIndex((o) => o.id === id);

      if (index !== -1 && res.data) offers.value[index] = res.data;
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل تعديل العرض ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  async function removeOffer(id: string) {
    if (isSaving.value || !id) return false;
    if (!authStore.checkRole(authStore.isEditorAndAbove, "Editor"))
      return false;

    const confirmMsg = "هل أنت متأكد من حذف هذا العرض نهائياً؟";
    const isConfirmed = await confirmStore.ask(confirmMsg, "تأكيد الحذف");
    if (!isConfirmed) return false;

    isSaving.value = true;
    try {
      const res = await offerService.deleteOffer(id);

      const errMsg = "فشل حذف العرض";
      const successMsg = "تم حذف العرض بنجاح";
      const isRes = handleApiResult(res, errMsg, successMsg, false);

      if (!isRes) return false;

      offers.value = offers.value.filter((o) => o.id !== id);
      return res.success;
    } catch (err: unknown) {
      handleGlobalError(err, "فشل حذف العرض ! ");
      return false;
    } finally {
      isSaving.value = false;
    }
  }

  return {
    offers,
    isLoading,
    isLoaded,
    isSaving,
    offersCount,
    offersIsActiveCount,
    offersIsNotActiveCount,
    fetchOffers,
    addOffer,
    updateOffer,
    removeOffer,
  };
});
// 153
