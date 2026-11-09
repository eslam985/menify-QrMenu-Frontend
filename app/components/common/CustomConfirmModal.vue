<!-- app/components/common/CustomConfirmModal.vue -->
<script setup lang="ts">
const confirmStore = useConfirmStore();
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
    <div
      v-if="confirmStore.isOpen"
      @click.self="confirmStore.isOpen = false"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div
        class="bg-card border-primary/10 w-full max-w-sm rounded-2xl border p-6 text-right shadow-2xl"
      >
        <h3 class="text-primary mb-2 text-lg font-bold">
          {{ confirmStore.title }}
        </h3>
        <p class="text-text/80 mb-6 text-sm leading-relaxed">
          {{ confirmStore.message }}
        </p>

        <div class="flex gap-3">
          <button
            @click="confirmStore.handleConfirm"
            class="flex-1 cursor-pointer rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          >
            تأكيد
          </button>
          <button
            @click="confirmStore.handleCancel"
            class="bg-card border-primary/10 text-text hover:bg-primary/5 flex-1 cursor-pointer rounded-xl border py-2.5 text-xs font-bold transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
