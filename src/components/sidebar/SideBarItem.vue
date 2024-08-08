<script setup lang="ts">
import { ref } from 'vue'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

export interface SideBarItemProps {
  href?: string
  label: string
  variant: 'ghost' | 'secondary'
}

const props = withDefaults(defineProps<SideBarItemProps>(), {
  href: '#'
})

const variantMutable = ref<'ghost' | 'secondary'>(props.variant)
</script>

<template>
  <a
    :href="href"
    @mouseover="variantMutable = 'secondary'"
    @mouseleave="variantMutable = 'ghost'"
    :class="
      cn(
        buttonVariants({ variant: variantMutable, size: 'lg' }),
        variantMutable === 'ghost' &&
          'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
        'flex-nowrap gap-2 ml-3 p-2 justify-start w-full h-9 max-w-[240px] group mr-10'
      )
    "
  >
    <slot />

    <div class="grow overflow-hidden font-normal whitespace-nowrap">
      {{ label }}
    </div>

    <div
      :class="
        cn(
          variantMutable == 'secondary' ? 'visible' : 'invisible',
          'group-hover:visible'
        )
      "
    >
      <slot name="right" />
    </div>
  </a>
</template>
