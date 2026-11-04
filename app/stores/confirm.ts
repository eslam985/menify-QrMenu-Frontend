// app/stores/confirm.ts
import { defineStore } from 'pinia'

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const message = ref('')
  const title = ref('تأكيد العملية')
  
  let resolver: ((value: boolean) => void) | null = null

  function ask(msg: string, customTitle = 'تأكيد العملية'): Promise<boolean> {
    message.value = msg
    title.value = customTitle
    isOpen.value = true

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  function handleConfirm() {
    if (resolver) resolver(true)
    isOpen.value = false
    resolver = null
  }

  function handleCancel() {
    if (resolver) resolver(false)
    isOpen.value = false
    resolver = null
  }

  return {
    isOpen,
    message,
    title,
    ask,
    handleConfirm,
    handleCancel,
  }
})