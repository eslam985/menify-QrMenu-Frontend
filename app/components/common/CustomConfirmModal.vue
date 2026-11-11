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
      class="p-fluid fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
    >
      <div
        class="bg-card border-primary/10 p-section-fluid w-full max-w-sm rounded-2xl border text-right shadow-2xl"
      >
        <h3 class="text-primary text-fluid-p mb-2 font-bold">
          {{ confirmStore.title }}
        </h3>
        <p class="text-text/80 mb-section-fluid text-fluid-sm leading-relaxed">
          {{ confirmStore.message }}
        </p>

        <div class="gap-fluid flex">
          <button
            @click="confirmStore.handleConfirm"
            class="btn-danger flex-1 transition"
          >
            تأكيد
          </button>
          <button @click="confirmStore.handleCancel" class="btn-primary flex-1">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
