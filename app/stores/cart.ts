import type { CartItem } from "@/types/dataType/menuItemType";
import { defineStore } from "pinia";

const STORAGE_PREFIX = "tabloz_cart_";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const currentSlug = ref<string | null>(null);

  /**
   * Loads the saved cart for a specific restaurant from `localStorage`.
   * Call this when entering a restaurant's public menu page.
   */
  const initCart = (slug: string) => {
    if (!slug) return;
    currentSlug.value = slug;

    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
        items.value = saved ? (JSON.parse(saved) as CartItem[]) : [];
      } catch {
        items.value = [];
      }
    }
  };

  // Automatically sync changes to localStorage for the active restaurant
  watch(
    items,
    (newItems) => {
      if (import.meta.client && currentSlug.value) {
        try {
          localStorage.setItem(
            `${STORAGE_PREFIX}${currentSlug.value}`,
            JSON.stringify(newItems),
          );
        } catch (err) {
          console.error("Failed to save cart to localStorage:", err);
        }
      }
    },
    { deep: true },
  );

  /**
   * Adds an item to the cart or increments its quantity if it already exists.
   */
  const addItem = (item: CartItem) => {
    const existingItem = items.value.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        id: item.id,
        title: item.title,
        price: item.price,
        image_url: item.image_url,
        quantity: 1,
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
  };

  const totalPrice = computed<number>(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  const totalItemsCount = computed<number>(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
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
