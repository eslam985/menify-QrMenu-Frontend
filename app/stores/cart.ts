import { defineStore } from "pinia";
import type { CartItem } from "@/types/dataType/menuItemType";

export const useCartStore = defineStore("cart", () => {
  // استخدام useCookie من نكسك لحفظ البيانات بأمان وتجنب مشاكل الـ Hydration والتفريغ مع الـ Reload
  // الصلاحية 24 ساعة (يوم كامل) كما طلبت
  const items = useCookie<CartItem[]>("menify_cart", {
    default: () => [],
    maxAge: 60 * 60 * 24,
  });

  const addItem = (item: CartItem) => {
    // عمل نسخة من مصفوفة العناصر لتحديث الـ Cookie بشكل صحيح
    const currentItems = [...(items.value || [])];
    const existingItem = currentItems.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...item, quantity: 1 });
    }
    items.value = currentItems;
  };

  const removeItem = (itemId: string) => {
    let currentItems = [...(items.value || [])];
    const existingItem = currentItems.find((i) => i.id === itemId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else {
        currentItems = currentItems.filter((i) => i.id !== itemId);
      }
    }
    items.value = currentItems;
  };

  const clearCart = () => {
    items.value = [];
  };

  const totalPrice = computed<number>(() => {
    return (items.value || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  });

  const totalItemsCount = computed<number>(() => {
    return (items.value || []).reduce((sum, item) => sum + item.quantity, 0);
  });

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    totalPrice,
    totalItemsCount,
  };
});
