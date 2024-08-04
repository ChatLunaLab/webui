import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useScreenInfoStore = defineStore('screenInfo', () => {
  const screenWidth = ref(window.innerWidth)
  const screenBreakpoint = ref('')

  const isMobile = computed(() => {
    return screenBreakpoint.value === 'xs'
  })

  const handleResize = () => {
    screenWidth.value = window.innerWidth

    if (window.innerWidth >= 1536) {
      screenBreakpoint.value = '2xl'
    } else if (window.innerWidth >= 1280) {
      screenBreakpoint.value = 'xl'
    } else if (window.innerWidth >= 1024) {
      screenBreakpoint.value = 'lg'
    } else if (window.innerWidth >= 768) {
      screenBreakpoint.value = 'md'
    } else if (window.innerWidth >= 640) {
      screenBreakpoint.value = 'sm'
    } else {
      screenBreakpoint.value = 'xs'
    }
  }

  window.addEventListener('resize', handleResize)

  return {
    screenBreakpoint,
    screenWidth,
    isMobile
  }
})
