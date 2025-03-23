<script setup lang="ts">
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
  size: 8,
  color: 'bg-muted-foreground',
  duration: 0.4,
  height: 8,
  gap: 0.35
})

// Calculate animation delay for each dot
const getAnimationDelay = (index: number) => {
  return `${(index * 0.15).toFixed(2)}s`
}
</script>

<template>
  <div
    class="flex items-center"
    :style="{
      height: `${props.height}px`,
      gap: `${props.gap}rem`
    }"
  >
    <span
      v-for="index in 3"
      :key="index"
      :class="[
        props.color,
        'animate-pulse opacity-0 rounded-full transition-opacity duration-300 ease-in-out'
      ]"
      :style="{
        width: `${props.size}px`,
        height: `${props.size}px`,
        animationDuration: `${props.duration * 2}s`,
        animationDelay: getAnimationDelay(index - 1),
        animationFillMode: 'both',
        animationIterationCount: 'infinite'
      }"
    />
  </div>
</template>
