<!-- app/components/CartDrawer.vue -->
<script setup lang="ts">

const publicMenuStore = usePublicMenuStore()
const cartStore = useCartStore()
const isCartOpen = ref(false)
const totalItemsCount = computed(() =>
  cartStore.totalItemsCount && cartStore.totalItemsCount > 1
    ? cartStore.totalItemsCount + ' ' + 'عناصر'
    : cartStore.totalItemsCount + ' ' + 'عنصر'
)

</script>

<template>
  <div>
    <!-- الشريط العائم أسفل الشاشة -->
    <div v-if="cartStore.items.length > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xl">
      <button @click="isCartOpen = true"
        class="w-full bg-primary text-white p-fluid dark:text-black rounded-xl shadow-glow flex flex-row-reverse items-center justify-between font-bold cursor-pointer hover:opacity-95 transition">
        <div class="flex items-center gap-3">
          <span class="bg-white/20 px-3 py-1 rounded-lg text-sm">
            {{ totalItemsCount }}
          </span>
          <span>عرض الفاتورة</span>
        </div>
        <span class="text-lg">
          اجمالي الفاتورة ({{ formatPrice(cartStore.totalPrice) }} {{ publicMenuStore.restaurant?.currency || 'EGP' }})
        </span>
      </button>
    </div>

    <!-- نافذة تفاصيل السلة (Drawer) -->
    <div v-if="isCartOpen" @click.self="isCartOpen = false"
      class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div class="bg-card text-text w-full max-w-md h-full flex flex-col p-fluid shadow-2xl border-l border-primary/10">

        <!-- رأس السلة -->
        <div class="flex items-center justify-between pb-4 border-b border-primary/10">
          <button @click="isCartOpen = false"
            class="p-2 rounded-lg bg-bg text-text hover:bg-primary hover:text-white transition cursor-pointer">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
          <h3 class="text-(length:--text-fluid-h3) font-bold">
            الحساب
          </h3>
          <button @click="cartStore.clearCart()"
            class="text-xs text-red-400 hover:text-red-500 font-semibold cursor-pointer flex items-center gap-1">
            <Icon name="lucide:trash-2" class="w-4 h-4" /> مسح الكل
          </button>
        </div>

        <!-- قائمة المنتجات -->
        <div class="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          <div v-for="item in cartStore.items" :key="item.id"
            class="flex items-center justify-between gap-fluid bg-bg p-fluid rounded-xl border border-primary/5">
            <div class="flex-1">
              <h4 class="font-bold text-(length:--text-fluid-sm)">{{ item.title }}</h4>
              <div class="flex items-center justify-between mt-1 text-xs">
                <span class="text-text/70">
                {{ item.quantity }} × {{ formatPrice(item.price) }} {{ publicMenuStore.restaurant?.currency || 'EGP' }} 
                </span>
                <span class="font-bold text-primary">
                {{ formatPrice(item.price * item.quantity) }} {{ publicMenuStore.restaurant?.currency || 'EGP' }}
              </span>
              </div>
            </div>

            <!-- أزرار التحكم بالكمية -->
            <div class="flex items-center gap-2">
              <button @click="cartStore.removeItem(item.id)"
                class="w-8 h-8 rounded-lg bg-card flex items-center justify-center font-bold hover:bg-red-500 hover:text-white transition cursor-pointer">-</button>
              <span class="text-sm font-bold w-4 text-center">{{ item.quantity }}</span>
              <button @click="cartStore.addItem(item)"
                class="w-8 h-8 rounded-lg bg-card flex items-center justify-center font-bold hover:bg-primary hover:text-white transition cursor-pointer">+</button>
            </div>
          </div>
        </div>

        <!-- الملخص -->
        <div class="pt-4 border-t border-primary/10 flex flex-col gap-3">
          <div class="flex items-center justify-between text-lg font-black">
            <span>الإجمالي الكلي:</span>
            <span class="text-primary">{{ cartStore.totalPrice }} {{ publicMenuStore.restaurant?.currency || 'EGP'
            }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>