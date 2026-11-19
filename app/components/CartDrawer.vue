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

const clearCart = () => {
  cartStore.clearCart();
  isCartOpen.value = false;
};
onMounted(() => {
  cartStore.initCart();
});
</script>

<template>
  <div>
    <!-- بدل السطر القديم في CartDrawer.vue -->
    <div
      v-if="cartStore.items.length > 0"
      class="fixed inset-x-0 bottom-3 z-40 mx-auto w-[92%] max-w-xl"
    >
      <button
        @click="isCartOpen = true"
        class="bg-card gap-fluid border-primary/20 p-fluid shadow-glow flex w-full cursor-pointer flex-row-reverse items-center justify-between rounded-xl border font-bold transition hover:opacity-95"
      >
        <div class="gap-fluid flex items-center">
          <span class="px-fluid text-fluid-sm text-primary rounded-lg py-1">
            {{ totalItemsCount }}
          </span>
          <span class="btn-primary">عرض الفاتورة</span>
        </div>
        <span class="text-fluid-p">
          اجمالي الفاتورة
          <span class="text-success"
            >({{ formatPrice(cartStore.totalPrice) }}
            {{ publicMenuStore.restaurant?.currency || "EGP" }})</span
          >
        </span>
      </button>
    </div>

    <div
      v-if="isCartOpen"
      @click.self="isCartOpen = false"
      class="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-sm"
    >
      <div
        class="bg-card p-fluid border-primary/10 flex h-full max-w-md flex-col border-l shadow-2xl md:w-full"
      >
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
            @click="clearCart"
            class="btn-danger flex justify-between gap-1"
          >
            <Icon name="lucide:trash-2" class="h-4 w-4 self-center" /> مسح الكل
          </button>
        </div>

        <div class="gap-fluid flex flex-1 flex-col overflow-y-auto py-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="gap-fluid bg-bg p-fluid border-primary/5 flex items-center justify-between rounded-xl border"
          >
            <div class="flex-1">
              <h4 class="text-(length:--text-fluid-sm) font-bold">
                {{ item.title }}
              </h4>
              <div class="text-fluid-xs mt-1 flex items-center justify-between">
                <span class="text-text/70">
                  {{ item.quantity }} × {{ formatPrice(item.price) }}
                  {{ publicMenuStore.restaurant?.currency || "EGP" }}
                </span>
                <span class="text-success font-bold">
                  {{ formatPrice(item.price * item.quantity) }}
                  {{ publicMenuStore.restaurant?.currency || "EGP" }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="cartStore.removeItem(item.id)"
                class="bg-card hover:bg-danger flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg font-bold transition hover:text-white"
              >
                -
              </button>
              <span class="text-fluid-sm w-4 text-center font-bold">{{
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

        <div class="border-primary/10 gap-fluid flex flex-col border-t pt-4">
          <div
            class="text-fluid-p flex items-center justify-between font-black"
          >
            <span>الإجمالي الكلي:</span>

            <span class="text-success text-fluid-h3 font-black">
              {{ formatPrice(cartStore.totalPrice) }}
              <span class="ext-fluid-xs">
                {{ publicMenuStore.restaurant?.currency }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
