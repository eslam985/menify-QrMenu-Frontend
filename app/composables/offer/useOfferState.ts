// /frontend/app/composables/offer/useOfferState.ts
import type { CreateOfferType } from "@/schemas/offerSchema/offerSchema";
type OfferPayloadItem = NonNullable<CreateOfferType["body"]["items"]>[number];

import type {
  OfferItemFormRow,
  OfferResponse,
} from "@/types/dataType/offerType";
import { useOfferSearch } from "~/composables/offer/useOfferSearch";

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

  const items = ref<OfferItemFormRow[]>([]);
  const startsAt = ref("");
  const endsAt = ref("");
  const isActive = ref(true);
  const errorMessage = ref("");

  const id = computed(() =>
    route.params.id !== "new" ? (route.params.id as string) : null,
  );

  const loadOfferData = async (force = false) =>
    await offerStore.fetchOffers({}, force);

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
    const isSuccess = await loadOfferData(true);
    if (isSuccess) notiStore.show("تم تحديث العروض بنجاح", "success");
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

  const parseOfferPrice = (rawPrice: unknown): number | null => {
    const isEmpty =
      rawPrice === "" || rawPrice === null || rawPrice === undefined;

    if (isEmpty) return null;

    return Number(rawPrice);
  };

  const formatOfferItemsForApi = (
    rows: OfferItemFormRow[],
  ): OfferPayloadItem[] => {
    const result: OfferPayloadItem[] = [];

    for (const row of rows) {
      if (row.menu_item_id) {
        result.push({
          menu_item_id: row.menu_item_id,
          quantity: row.quantity,
        });

        continue;
      }

      if (row.custom_label) {
        result.push({
          custom_label: row.custom_label,
          quantity: row.quantity,
        });
      }
    }

    return result;
  };

  const buildOfferPayload = (formData: Record<string, unknown>) => {
    const description = formData.description
      ? String(formData.description)
      : null;

    const offerPrice = parseOfferPrice(formData.offer_price);
    const formattedItems = formatOfferItemsForApi(items.value);

    const oneDayInMs = 24 * 60 * 60 * 1000;
    const defaultEndDate = new Date(Date.now() + oneDayInMs).toISOString();
    const endsAtIso = endsAt.value
      ? new Date(endsAt.value).toISOString()
      : defaultEndDate;

    const payload: Record<string, unknown> = {
      ...formData,
      description,
      offer_price: offerPrice,
      ends_at: endsAtIso,
      is_active: isActive.value,
      items: formattedItems,
    };

    if (startsAt.value) {
      payload.starts_at = new Date(startsAt.value).toISOString();
    }

    return payload;
  };

  const getCategoryIdForMenuItem = (menuItemId?: string | null): string => {
    if (!menuItemId) return "";

    const foundItem = itemStore.items.find((item) => item.id === menuItemId);
    if (!foundItem) return "";

    return foundItem.category_id;
  };

  const mapOfferItemsToFormRows = (
    offerItems?: OfferResponse["items"],
  ): OfferItemFormRow[] => {
    if (!offerItems || offerItems.length === 0) {
      return [];
    }

    const result: OfferItemFormRow[] = [];

    for (const item of offerItems) {
      if (item.custom_label) {
        result.push({
          custom_label: item.custom_label,
          quantity: item.quantity,
        });
        continue;
      }

      const categoryId = getCategoryIdForMenuItem(item.menu_item_id);

      result.push({
        menu_item_id: item.menu_item_id || "",
        selected_category_id: categoryId,
        quantity: item.quantity,
      });
    }

    return result;
  };

  const populateOfferData = (offer: OfferResponse) => {
    startsAt.value = formatForDateTimeInput(offer.starts_at);
    endsAt.value = formatForDateTimeInput(offer.ends_at);

    isActive.value = offer.is_active ?? true;

    items.value = mapOfferItemsToFormRows(offer.items);

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
// 220
