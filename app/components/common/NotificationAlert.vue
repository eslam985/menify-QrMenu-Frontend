<!-- app/components/common/NotificationAlert.vue -->
<script setup lang="ts">
const notificationStore = useNotificationStore();

const typeClasses = computed(() => {
  switch (notificationStore.type) {
    case "success":
      return "bg-green-500/10 border-green-500/20 text-green-500";
    case "error":
      return "bg-red-500/10 border-red-500/20 text-red-500";
    case "warning":
      return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    case "info":
    default:
      return "bg-primary/10 border-primary/20 text-primary";
  }
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-2 opacity-0"
  >
    <div
      v-if="notificationStore.isVisible"
      @mouseenter="notificationStore.pauseTimer()"
      @mouseleave="notificationStore.resumeTimer()"
      class="shadow-soft relative mb-6 flex w-full items-center justify-between overflow-hidden rounded-xl border p-4 text-sm font-medium transition-all xl:max-w-[30%]"
      :class="typeClasses"
    >
      <div class="z-10 flex items-center gap-3">
        <span v-if="notificationStore.type === 'success'">✅</span>
        <span v-else-if="notificationStore.type === 'error'">❌</span>
        <span v-else-if="notificationStore.type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
        <span>{{ notificationStore.message }}</span>
      </div>

      <button
        @click="notificationStore.clear()"
        class="z-10 cursor-pointer p-1 text-xs opacity-70 hover:opacity-100"
      >
        ✕
      </button>

      <div
        class="animate-progress absolute bottom-0 left-0 h-1 bg-current opacity-30"
        :class="{ paused: notificationStore.isPaused }"
        :style="{ animationDuration: `${notificationStore.duration}ms` }"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-progress {
  animation: progressBar linear forwards;
}

.paused {
  animation-play-state: paused !important;
}
</style>
