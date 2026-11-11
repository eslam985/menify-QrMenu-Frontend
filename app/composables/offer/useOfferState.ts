import { useOfferSearch } from "~/composables/offer/useOfferSearch";
import type { OfferResponse } from "@/types/dataType/offerType";
import type {
  CreateOfferType,
  UpdateOfferType,
} from "@/schemas/offerSchema/offerSchema";
import { type FormField } from "~/composables/useForm";
export interface itemsType {
  menu_item_id?: string;
  custom_label?: string;
  selected_category_id?: string;
  quantity: number;
}

export const useOfferState = () => {
  const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } =
    useOfferSearch();
  const formInstance = useForm();
  const { setFormConfig, formDataPayload, isSubmitting, resetForm } =
    formInstance;
  provide("current_form_instance", formInstance);

  const router = useRouter();

  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const offerStore = useOfferStore();
  const itemStore = useItemStore();
  const authStore = useAuthStore();

  const offerId = ref<string | null>(null);
  const items = ref<itemsType[]>([]);
  const startsAt = ref("");
  const endsAt = ref("");
  const isActive = ref(true);
  const errorMessage = ref("");
  const isEditMode = computed(() => Boolean(offerId.value));

  const addMenuItemToOffer = () => {
    items.value.push({
      menu_item_id: "",
      selected_category_id: "",
      quantity: 1,
    });
  };

  const addCustomItemToOffer = () => {
    items.value.push({ custom_label: "", quantity: 1 });
  };

  const removeItemFromOffer = (index: number) => {
    items.value.splice(index, 1);
  };

  const handleRefresh = async () => {
    try {
      await offerStore.fetchOffers();
      notiStore.show("تم تحديث العروض بنجاح", "success");
    } catch (err: unknown) {
      notiStore.show("فشل تحديث العروض", "error");
    }
  };

  const filteredOffers = computed(() => {
    let result = offerStore.offers;

    if (statusFilter.value === "active") {
      result = result.filter((o) => o.is_active);
    } else if (statusFilter.value === "paused") {
      result = result.filter((o) => !o.is_active);
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          (o.description && o.description.toLowerCase().includes(query)),
      );
    }

    return result;
  });

  const offerFieldsConfig: FormField[] = [
    {
      column: "title",
      value: "",
      label: "عنوان العرض (مثال: عرض الويك إند الكبير)",
      required: true,
      type: "text",
      colspan: "col-span-3 md:col-span-2",
    },
    {
      column: "offer_price",
      value: "",
      label: "سعر العرض (ج.م) - اختياري",
      required: false,
      type: "number",
      colspan: "col-span-3 md:col-span-1",
    },
    {
      column: "description",
      value: "",
      label: "تفاصيل ووصف العرض",
      required: false,
      type: "textarea",
      colspan: "col-span-3",
    },
  ];

  const populateOfferData = (offer: OfferResponse) => {
    startsAt.value = offer.starts_at
      ? new Date(offer.starts_at).toISOString().slice(0, 16)
      : "";

    endsAt.value = offer.ends_at
      ? new Date(offer.ends_at).toISOString().slice(0, 16)
      : "";

    isActive.value = offer.is_active ?? true;
    items.value = offer.items ? JSON.parse(JSON.stringify(offer.items)) : [];

    setFormConfig(offerFieldsConfig, handleSubmit, {
      title: offer.title || "",
      offer_price: offer.offer_price ?? "",
      description: offer.description || "",
    });
  };

  const handleSubmit = async () => {
    errorMessage.value = "";
    isSubmitting.value = true;
    let success = false;

    if (isEditMode.value && offerId.value) {
      if (!offerId.value) return;

      success = await offerStore.updateOffer(
        offerId.value,
        formDataPayload.value as UpdateOfferType["body"],
      );
    } else {
      success = await offerStore.addOffer(
        formDataPayload.value as CreateOfferType["body"],
      );
    }

    if (success) {
      resetForm();
      router.push("/dashboard/offers");
    }

    isSubmitting.value = false;
  };

  const loadData = async () => {
    const tasks: Promise<unknown>[] = [];

    if (categoryStore.categoriesCount < 1)
      tasks.push(categoryStore.fetchCategories());

    if (itemStore.items?.length < 1) tasks.push(itemStore.fetchItems());

    if (tasks.length > 0) await Promise.all(tasks);

    if (isEditMode.value && offerId.value) {
      let targetOffer = offerStore.offers.find((o) => o.id === offerId.value);

      if (!targetOffer) {
        await offerStore.fetchOffers();
        targetOffer = offerStore.offers.find((o) => o.id === offerId.value);
      }

      if (targetOffer) populateOfferData(targetOffer);
    } else {
      resetForm();
      setFormConfig(offerFieldsConfig, handleSubmit);
    }
  };

  return {
    router,
    categoryStore,
    notiStore,
    authStore,
    offerStore,
    itemStore,
    items,
    filteredOffers,
    startsAt,
    endsAt,
    isActive,
    errorMessage,
    searchQuery,
    statusFilter,
    formDataPayload,
    isSubmitting,
    offerId,
    isEditMode,
    offerFieldsConfig,
    setSearchQuery,
    setStatusFilter,
    setFormConfig,
    resetForm,
    populateOfferData,
    handleSubmit,
    loadData,
    addMenuItemToOffer,
    addCustomItemToOffer,
    removeItemFromOffer,
    handleRefresh,
  };
};
