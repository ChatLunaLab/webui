<script setup lang="ts">
import { ref } from 'vue'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

export interface SideBarItemProps {
  href?: string
  label: string
  variant: 'ghost' | 'secondary'
}

withDefaults(defineProps<SideBarItemProps>(), {
  href: '#'
})

const hover = ref(false)
</script>

<template>
  <a
    :href="href"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="
      cn(
        buttonVariants({ variant, size: 'lg' }),
        variant === 'ghost' &&
          'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
        'justify-start mx-2 px-2.5',
        $attrs.class ?? ''
      )
    "
  >
    <slot />
    <span class="mx-1 overflow-hidden">{{ label }}</span>
    <div v-if="hover || variant == 'secondary'" class="ml-auto">
      <slot name="right" />
    </div>
  </a>
</template>
