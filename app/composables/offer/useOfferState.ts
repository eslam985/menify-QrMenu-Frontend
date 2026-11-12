import { useOfferSearch } from "~/composables/offer/useOfferSearch";

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
  };
};
