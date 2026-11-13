import { useOfferSearch } from "~/composables/offer/useOfferSearch";
import type { CreateOfferType } from "@/schemas/offerSchema/offerSchema";
import type { OfferResponse } from "@/types/dataType/offerType";

export interface itemsType {
  menu_item_id?: string;
  custom_label?: string;
  selected_category_id?: string;
  quantity: number;
}

export const useOfferState = () => {
  const { searchQuery, statusFilter, setSearchQuery, setStatusFilter } =
    useOfferSearch();

  const router = useRouter();
  const route = useRoute();

  const categoryStore = useCategoryStore();
  const notiStore = useNotificationStore();
  const offerStore = useOfferStore();
  const itemStore = useItemStore();
  const authStore = useAuthStore();

  const items = ref<itemsType[]>([]);
  const startsAt = ref("");
  const endsAt = ref("");
  const isActive = ref(true);
  const errorMessage = ref("");

  const id = computed(() =>
    route.params.id !== "new" ? (route.params.id as string) : null,
  );

  const loadOfferData = async () => {
    await offerStore.fetchOffers();
  };
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
      await loadOfferData();
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

  const buildOfferPayload = (formData: Record<string, any>) => {
    const description = formData.description || null;

    const rawPrice = formData.offer_price;
    const offer_price: number | null =
      rawPrice !== "" && rawPrice !== null && rawPrice !== undefined
        ? Number(rawPrice)
        : null;

    const ends_at: string = endsAt.value
      ? new Date(endsAt.value).toISOString()
      : new Date(Date.now() + 86400000).toISOString();

    const startsAtPayload = startsAt.value
      ? { starts_at: new Date(startsAt.value).toISOString() }
      : {};

    const offerItems: NonNullable<CreateOfferType["body"]["items"]> =
      items.value.flatMap<NonNullable<CreateOfferType["body"]["items"]>[number]>(
        (i) => {
          if ("menu_item_id" in i && i.menu_item_id) {
            return [{ menu_item_id: i.menu_item_id, quantity: i.quantity }];
          }
          return i.custom_label
            ? [{ custom_label: i.custom_label, quantity: i.quantity }]
            : [];
        },
      );

    return {
      ...formData,
      ...startsAtPayload,
      ends_at,
      description,
      offer_price,
      is_active: isActive.value,
      items: offerItems,
    };
  };
  const populateOfferData = (offer: OfferResponse) => {
    startsAt.value = offer.starts_at
      ? new Date(offer.starts_at).toISOString().slice(0, 16)
      : "";

    endsAt.value = offer.ends_at
      ? new Date(offer.ends_at).toISOString().slice(0, 16)
      : "";

    isActive.value = offer.is_active ?? true;
    items.value = offer.items ? JSON.parse(JSON.stringify(offer.items)) : [];

    return {
      title: offer.title || "",
      offer_price: offer.offer_price ?? "",
      description: offer.description || "",
    };
  };

  return {
    router,
    route,
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
    id,
    setSearchQuery,
    setStatusFilter,
    addMenuItemToOffer,
    addCustomItemToOffer,
    removeItemFromOffer,
    handleRefresh,
    loadOfferData,
    buildOfferPayload,
    populateOfferData,
  };
};
