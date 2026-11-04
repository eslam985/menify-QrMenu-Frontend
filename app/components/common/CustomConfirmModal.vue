<!-- app/components/common/CustomConfirmModal.vue -->
<script setup lang="ts">
import { useConfirmStore } from '~/stores/confirm'

const confirmStore = useConfirmStore()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="confirmStore.isOpen" @click.self="confirmStore.isOpen = false" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div class="bg-card max-w-sm w-full p-6 rounded-2xl border border-primary/10 shadow-2xl text-right">
        <h3 class="text-lg font-bold text-primary mb-2">{{ confirmStore.title }}</h3>
        <p class="text-sm text-text/80 mb-6 leading-relaxed">{{ confirmStore.message }}</p>

        <div class="flex gap-3">
          <button
            @click="confirmStore.handleConfirm"
            class="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs cursor-pointer hover:opacity-90 transition"
          >
            تأكيد
          </button>
          <button
            @click="confirmStore.handleCancel"
            class="flex-1 py-2.5 rounded-xl bg-card border border-primary/10 text-text font-bold text-xs cursor-pointer hover:bg-primary/5 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>