<script setup lang="ts">

const props = defineProps<{
  item: any
}>()

const emit = defineEmits(['close'])
const cartStore = useCartStore()
const publicMenuStore = usePublicMenuStore()

const handleAddToCart = () => {
  cartStore.addItem(props.item)
  emit('close')
}
</script>

<template>
  <div @click.self="emit('close')" class="fixed inset-0 z-50 flex items-center justify-center p-fluid bg-black/70 backdrop-blur-sm animate-fade-in">
    <div class="bg-card text-text w-full max-w-lg rounded-xl overflow-hidden shadow-soft border border-primary/10 flex flex-col">
      
      <!-- صورة المنتج أو رأس المودال -->
      <div class="relative h-56 w-full bg-bg">
        <img 
          v-if="item.image_url || publicMenuStore.restaurant?.logo_url" 
          :src="item.image_url || publicMenuStore.restaurant?.logo_url" 
          :alt="item.title" 
          class="w-full h-full object-cover" 
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          <Icon name="lucide:utensils" class="w-16 h-16 opacity-50" />
        </div>
        
        <!-- زر الإغلاق -->
        <button 
          @click="emit('close')"
          class="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
        >
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <!-- تفاصيل الوجبة -->
      <div class="p-6 flex flex-col gap-4">
        <div>
          <h2 class="text-(length:--text-fluid-h2) font-bold text-text">{{ item.title }}</h2>
          <p class="text-(length:--text-fluid-p) font-black text-primary mt-1">{{ formatPrice(item.price) }} جنيه</p>
        </div>

        <p v-if="item.description" class="text-(length:--text-fluid-sm) text-text/80 leading-relaxed">
          {{ item.description }}
        </p>

        <!-- زر الإضافة للسلة -->
        <button 
          @click="handleAddToCart"
          class="w-full py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer mt-2"
        >
          <Icon name="lucide:shopping-bag" class="w-5 h-5" />
          إضافة إلى الفاتورة
        </button>
      </div>

    </div>
  </div>
</template>