// app/stores/notification.ts
import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('')
  const type = ref<NotificationType>('info')
  const isVisible = ref(false)
  
  // خصائص الإيقاف المؤقت وشريط التقدم
  const duration = ref(4000)
  const remaining = ref(4000)
  const isPaused = ref(false)
  
  let startTime = 0
  let timerId: NodeJS.Timeout | null = null

  function show(msg: string, alertType: NotificationType = 'info', customDuration = 4000) {
    clearTimer()
    message.value = msg
    type.value = alertType
    duration.value = customDuration
    remaining.value = customDuration
    isVisible.value = true
    isPaused.value = false
    
    startTimer()
  }

  function startTimer() {
    startTime = Date.now()
    timerId = setTimeout(() => {
      clear()
    }, remaining.value)
  }

  function pauseTimer() {
    if (isPaused.value || !isVisible.value) return
    isPaused.value = true
    if (timerId) clearTimeout(timerId)
    const elapsed = Date.now() - startTime
    remaining.value = Math.max(0, remaining.value - elapsed)
  }

  function resumeTimer() {
    if (!isPaused.value || !isVisible.value) return
    isPaused.value = false
    startTimer()
  }

  function clearTimer() {
    if (timerId) clearTimeout(timerId)
    timerId = null
  }

  function clear() {
    clearTimer()
    isVisible.value = false
    message.value = ''
    isPaused.value = false
  }

  return {
    message,
    type,
    isVisible,
    duration,
    remaining,
    isPaused,
    show,
    clear,
    pauseTimer,
    resumeTimer,
  }
})