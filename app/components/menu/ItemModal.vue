<!-- tabloz/frontend/app/components/menu/ItemModal.vue -->
<script setup lang="ts">
import { usePublicMenuState } from "~/composables/menu/usePublicMenu";
import type { CartItem } from "~/types/dataType/menuItemType";

import { useShowModal } from "#imports";
const { closeModal: closeItemModal } = useShowModal("item-model");
const { cartStore, publicMenuStore } = usePublicMenuState();

defineProps<{ item: CartItem }>();

const handleAdd = (selectedItem: any) => {
  cartStore.addItem(selectedItem);
  closeItemModal();
};
</script>

<template>
  <div
    @click.self="closeItemModal"
    class="p-fluid animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
  >
    <div
      dir="rtl"
      class="bg-card text-text shadow-soft border-primary/10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border"
    >
      <div class="bg-bg relative h-56 w-full">
        <img
          v-if="item?.image_url || publicMenuStore.restaurant?.logo_url"
          :src="
            item?.image_url || publicMenuStore.restaurant?.logo_url || undefined
          "
          :alt="item?.title"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="bg-primary/10 text-primary flex h-full w-full items-center justify-center"
        >
          <Icon name="lucide:utensils" class="h-16 w-16 opacity-50" />
        </div>
      </div>

      <div class="gap-fluid p-section-fluid flex flex-col">
        <div class="bg-bg rounded-card p-fluid mb-fluid">
          <h2 class="text-text text-fluid-h2 mb-fluid font-bold">
            {{ item?.title }}
          </h2>
          <p class="text-primary text-fluid-p mt-1 font-black">
            <span>السعر</span>
            {{
              formatPrice(item?.price ?? "") +
              " " +
              publicMenuStore.restaurant?.currency
            }}
          </p>
        </div>

        <p
          v-if="item?.description"
          class="text-text/80 text-(length:--text-fluid-sm) leading-relaxed"
        >
          {{ item?.description }}
        </p>

        <div class="gap-fluid flex justify-center">
          <button
            @click="handleAdd(item)"
            class="btn-primary flex justify-center gap-1"
          >
            <Icon name="lucide:shopping-bag" class="h-5 w-5 self-center" />
            إضافة إلى الفاتورة
          </button>

          <button
            @click="closeItemModal"
            class="btn-danger flex justify-center gap-1"
          >
            <span class="mb-1 self-center">رجوع</span>
            <Icon name="lucide:x" class="h-5 w-5 self-center" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
