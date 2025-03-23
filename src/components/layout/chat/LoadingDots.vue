<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
  duration: 0.4,
  height: 4,
  gap: 1
})

// Track which dot is currently visible (1-indexed to match v-for)
const activeDotIndex = ref(1)

// Timer reference for cleanup
let timer: number | null = null

// Function to cycle through dots
const cycleDots = () => {
  activeDotIndex.value =
    activeDotIndex.value >= 3 ? 1 : activeDotIndex.value + 1
}

onMounted(() => {
  // Start the animation cycle when component is mounted
  // Divide the total duration by 3 to maintain the same overall animation speed
  const intervalTime = (props.duration * 1000) / 3
  timer = window.setInterval(cycleDots, intervalTime)
})

onBeforeUnmount(() => {
  // Clean up the timer when component is unmounted
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div
    class="flex items-center"
    :class="`gap-${props.gap}`"
    :style="{
      height: `${props.height}px`
    }"
  >
    <span
      v-for="index in 3"
      :key="index"
      :class="[
        `w-${props.size} h-${props.size} rounded-full ${props.color}`,
        {
          'opacity-100': index === activeDotIndex,
          'opacity-0': index !== activeDotIndex
        }
      ]"
    />
  </div>
</template>

<style scoped>
/* Transition for smooth opacity changes */
span {
  transition: opacity 0.15s ease-in-out;
}
</style>
