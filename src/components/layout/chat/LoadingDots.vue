<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface LoadingDotsProps {
  /**
   * The size of each dot in pixels
   * @default 1.5
   */
  size?: number

  /**
   * The color class from Tailwind CSS
   * @default 'bg-muted-foreground'
   */
  color?: string

  /**
   * The animation duration in seconds
   * @default 0.8
   */
  duration?: number

  /**
   * The height of the container
   * @default 6
   */
  height?: number

  /**
   * The gap between dots
   * @default 1
   */
  gap?: number
}

const props = withDefaults(defineProps<LoadingDotsProps>(), {
  size: 1.5,
  color: 'bg-muted-foreground',
  duration: 0.8,
  height: 4,
  gap: 1
})

// References to dot elements
const dotRefs = ref<HTMLElement[]>([])
const animationFrameId = ref<number | null>(null)
const isAnimating = ref(true)

// Calculate the bounce height based on dot size
const bounceHeight = computed(() => props.size * 3)

// Animation timing parameters for wave-like effect
const getDelay = (index: number) => (props.duration / 4) * index

// Animation function using requestAnimationFrame
const animate = () => {
  const startTime = Date.now()

  const updateDots = () => {
    const currentTime = Date.now()
    const elapsed = (currentTime - startTime) / 1000 // Convert to seconds

    dotRefs.value.forEach((dot, index) => {
      if (!dot) return

      // Calculate phase with delay for each dot
      const delay = getDelay(index)
      const phase = ((elapsed + delay) % props.duration) / props.duration

      // Simple sine wave for smooth bounce effect
      const yPos = Math.sin(phase * Math.PI) * bounceHeight.value * -1

      // Apply transform
      dot.style.transform = `translateY(${yPos}px)`
    })

    if (isAnimating.value) {
      animationFrameId.value = requestAnimationFrame(updateDots)
    }
  }

  updateDots()
}

// Store dot references
const setDotRef = (el: Element | unknown, index: number) => {
  if (el && el instanceof HTMLElement) {
    dotRefs.value[index] = el
  }
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  isAnimating.value = false
  if (animationFrameId.value !== null) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<template>
  <div
    class="flex items-center"
    :class="`gap-${props.gap}`"
    :style="{ height: `${props.height}px` }"
  >
    <span
      v-for="index in 4"
      :key="index"
      :ref="(el) => setDotRef(el, index - 1)"
      :class="[`w-${props.size} h-${props.size} rounded-full ${props.color}`]"
      :style="{
        transformOrigin: 'center bottom'
      }"
    />
  </div>
</template>

<style scoped>
/* Animation is now controlled by TypeScript */
</style>
