<!-- app/components/CartDrawer.vue -->
<script setup lang="ts">
const publicMenuStore = usePublicMenuStore();
const cartStore = useCartStore();
const isCartOpen = ref(false);
const totalItemsCount = computed(() =>
  cartStore.totalItemsCount && cartStore.totalItemsCount > 1
    ? cartStore.totalItemsCount + " " + "عناصر"
    : cartStore.totalItemsCount + " " + "عنصر",
);
</script>

<template>
  <div>
    <!-- الشريط العائم أسفل الشاشة -->
    <div
      v-if="cartStore.items.length > 0"
      class="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-xl -translate-x-1/2"
    >
      <button
        @click="isCartOpen = true"
        class="bg-primary p-fluid shadow-glow flex w-full cursor-pointer flex-row-reverse items-center justify-between rounded-xl font-bold text-white transition hover:opacity-95 dark:text-black"
      >
        <div class="flex items-center gap-3">
          <span class="rounded-lg bg-white/20 px-3 py-1 text-sm">
            {{ totalItemsCount }}
          </span>
          <span>عرض الفاتورة</span>
        </div>
        <span class="text-lg">
          اجمالي الفاتورة ({{ formatPrice(cartStore.totalPrice) }}
          {{ publicMenuStore.restaurant?.currency || "EGP" }})
        </span>
      </button>
    </div>

    <!-- نافذة تفاصيل السلة (Drawer) -->
    <div
      v-if="isCartOpen"
      @click.self="isCartOpen = false"
      class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
    >
      <div
        class="bg-card text-text p-fluid border-primary/10 flex h-full w-full max-w-md flex-col border-l shadow-2xl"
      >
        <!-- رأس السلة -->
        <div
          class="border-primary/10 flex items-center justify-between border-b pb-4"
        >
          <button
            @click="isCartOpen = false"
            class="bg-bg text-text hover:bg-primary cursor-pointer rounded-lg p-2 transition hover:text-white"
          >
            <Icon name="lucide:x" class="h-5 w-5" />
          </button>
          <h3 class="text-(length:--text-fluid-h3) font-bold">الحساب</h3>
          <button
            @click="cartStore.clearCart()"
            class="flex cursor-pointer items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-500"
          >
            <Icon name="lucide:trash-2" class="h-4 w-4" /> مسح الكل
          </button>
        </div>

        <!-- قائمة المنتجات -->
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="gap-fluid bg-bg p-fluid border-primary/5 flex items-center justify-between rounded-xl border"
          >
            <div class="flex-1">
              <h4 class="text-(length:--text-fluid-sm) font-bold">
                {{ item.title }}
              </h4>
              <div class="mt-1 flex items-center justify-between text-xs">
                <span class="text-text/70">
                  {{ item.quantity }} × {{ formatPrice(item.price) }}
                  {{ publicMenuStore.restaurant?.currency || "EGP" }}
                </span>
                <span class="text-primary font-bold">
                  {{ formatPrice(item.price * item.quantity) }}
                  {{ publicMenuStore.restaurant?.currency || "EGP" }}
                </span>
              </div>
            </div>

            <!-- أزرار التحكم بالكمية -->
            <div class="flex items-center gap-2">
              <button
                @click="cartStore.removeItem(item.id)"
                class="bg-card flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-bold transition hover:bg-red-500 hover:text-white"
              >
                -
              </button>
              <span class="w-4 text-center text-sm font-bold">{{
                item.quantity
              }}</span>
              <button
                @click="cartStore.addItem(item)"
                class="bg-card hover:bg-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-bold transition hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- الملخص -->
        <div class="border-primary/10 flex flex-col gap-3 border-t pt-4">
          <div class="flex items-center justify-between text-lg font-black">
            <span>الإجمالي الكلي:</span>
            <span class="text-primary"
              >{{ cartStore.totalPrice }}
              {{ publicMenuStore.restaurant?.currency || "EGP" }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
