import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { computedAsync } from '@vueuse/core'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(true)
  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const delayStatus = computedAsync(async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 300)
    })
    return isOpen.value
  }, isOpen.value)

  return { isOpen, toggle, delayStatus }
})
