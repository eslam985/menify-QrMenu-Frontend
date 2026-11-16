import type { CartItem } from "@/types/dataType/menuItemType";
import { defineStore } from "pinia";

const STORAGE_PREFIX = "tabloz_cart_";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const currentSlug = ref<string | null>(null);
  let isInitializing = false;


  const getRouteSlug = (): string | null => {
    try {
      const route = useRoute();
      const slug = route?.params?.slug;
      if (typeof slug === "string") return slug;
      if (Array.isArray(slug) && slug[0]) return slug[0];
    } catch(err) {
      // route may not be available outside Nuxt context
      console.error(err)
      return null;
    }
    return null;
  };

  /**
   * Loads the saved cart for a specific restaurant from `localStorage`.
   * Call this when entering a restaurant's public menu page or automatically via route.
   */
  const initCart = (slug?: string) => {
    const targetSlug = slug || currentSlug.value || getRouteSlug();
    if (!targetSlug) return;

    currentSlug.value = targetSlug;

    if (import.meta.client) {
      isInitializing = true;
      try {
        // Support both tabloz_cart_ and tabloz_cart_ for backwards compatibility
        const saved =
          localStorage.getItem(`${STORAGE_PREFIX}${targetSlug}`) ||
          localStorage.getItem(`tabloz_cart_${targetSlug}`);
        items.value = saved ? (JSON.parse(saved) as CartItem[]) : [];
      } catch (err) {
        console.error("Failed to load cart from localStorage:", err);
        items.value = [];
      } finally {
        nextTick(() => {
          isInitializing = false;
        });
      }
    }
  };

  // Automatically sync changes to localStorage for the active restaurant
  watch(
    items,
    (newItems) => {
      if (isInitializing) return;

      const slug = currentSlug.value || getRouteSlug();
      if (!slug) return;

      if (!currentSlug.value) {
        currentSlug.value = slug;
      }

      if (import.meta.client) {
        try {
          if (!newItems || newItems.length === 0) {
            localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
            localStorage.removeItem(`tabloz_cart_${slug}`);
          } else {
            localStorage.setItem(
              `${STORAGE_PREFIX}${slug}`,
              JSON.stringify(newItems),
            );
          }
        } catch (err) {
          console.error("Failed to save cart to localStorage:", err);
        }
      }
    },
    { deep: true },
  );

  // Auto-init on client if route has a slug
  if (import.meta.client) {
    try {
      const route = useRoute();
      watch(
        () => route?.params?.slug,
        (newSlug) => {
          const s = Array.isArray(newSlug) ? newSlug[0] : newSlug;
          if (s && s !== currentSlug.value) {
            initCart(s);
          }
        },
        { immediate: true },
      );
    } catch {
      // In case useRoute is not available
    }
  }

  /**
   * Adds an item to the cart or increments its quantity if it already exists.
   */
  const addItem = (item: CartItem, quantity: number = 1) => {
    if (!currentSlug.value) {
      const slug = getRouteSlug();
      if (slug) initCart(slug);
    }

    const qtyToAdd = quantity > 0 ? quantity : 1;
    const existingItem = items.value.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += qtyToAdd;
    } else {
      items.value.push({
        id: item.id,
        category_id: item.category_id,
        title: item.title,
        price: Number(item.price) || 0,
        image_url: item.image_url,
        quantity: item.quantity && item.quantity > 0 ? item.quantity : qtyToAdd,
      } as CartItem);
    }
  };

  /**
   * Decrements an item's quantity by 1, or removes it if quantity reaches 0.
   */
  const removeItem = (itemId: string) => {
    const existingItem = items.value.find((i) => i.id === itemId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      existingItem.quantity -= 1;
    } else {
      deleteItem(itemId);
    }
  };

  /**
   * Completely removes an item from the cart regardless of its quantity.
   */
  const deleteItem = (itemId: string) => {
    items.value = items.value.filter((i) => i.id !== itemId);
  };

  /**
   * Empties the current restaurant's cart.
   */
  const clearCart = () => {
    items.value = [];
    const slug = currentSlug.value || getRouteSlug();
    if (import.meta.client && slug) {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
        localStorage.removeItem(`tabloz_cart_${slug}`);
      } catch (err) {
        console.error("Failed to clear cart from localStorage:", err);
      }
    }
  };

  const totalPrice = computed<number>(() =>
    items.value.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
      0,
    ),
  );

  const totalItemsCount = computed<number>(() =>
    items.value.reduce((sum, item) => sum + (item.quantity || 1), 0),
  );

  return {
    items,
    currentSlug,
    initCart,
    addItem,
    removeItem,
    deleteItem,
    clearCart,
    totalPrice,
    totalItemsCount,
  };
});
