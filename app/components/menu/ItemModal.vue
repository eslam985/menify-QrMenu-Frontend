<script setup lang="ts">
import type { CartItem } from "@/types/dataType/menuItemType";
const props = defineProps<{
  item: CartItem;
}>();

const emit = defineEmits(["close"]);
const cartStore = useCartStore();
const publicMenuStore = usePublicMenuStore();

const handleAddToCart = () => {
  cartStore.addItem(props.item);
  emit("close");
};
</script>

<template>
  <div
    @click.self="emit('close')"
    class="p-fluid animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div
      class="bg-card text-text shadow-soft border-primary/10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border"
    >
      <div class="bg-bg relative h-56 w-full">
        <img
          v-if="item.image_url || publicMenuStore.restaurant?.logo_url"
          :src="
            item.image_url || publicMenuStore.restaurant?.logo_url || undefined
          "
          :alt="item.title"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="bg-primary/10 text-primary flex h-full w-full items-center justify-center"
        >
          <Icon name="lucide:utensils" class="h-16 w-16 opacity-50" />
        </div>

        <button
          @click="emit('close')"
          class="absolute top-4 left-4 cursor-pointer rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
        >
          <Icon name="lucide:x" class="h-5 w-5" />
        </button>
      </div>

      <div class="flex flex-col gap-4 p-6">
        <div>
          <h2 class="text-text text-(length:--text-fluid-h2) font-bold">
            {{ item.title }}
          </h2>
          <p class="text-primary mt-1 text-(length:--text-fluid-p) font-black">
            {{ formatPrice(item.price) }} جنيه
          </p>
        </div>

        <p
          v-if="item.description"
          class="text-text/80 text-(length:--text-fluid-sm) leading-relaxed"
        >
          {{ item.description }}
        </p>

        <button
          @click="handleAddToCart"
          class="bg-primary mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-lg transition hover:opacity-90"
        >
          <Icon name="lucide:shopping-bag" class="h-5 w-5" />
          إضافة إلى الفاتورة
        </button>
      </div>
    </div>
  </div>
</template>
