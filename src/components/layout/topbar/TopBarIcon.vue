<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { useSidebarStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useScreenInfoStore } from '@/stores/screen'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const sidebarStore = useSidebarStore()
const screenInfoStore = useScreenInfoStore()

interface Props {
  tooltipText?: string
  click?: () => void
  tooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tooltipText: 'tooltip',
  click: () => {},
  tooltip: true,
})
</script>

<template>
  <Tooltip v-if="tooltip">
    <TooltipTrigger as-child>
      <Button @click="props.click" class="m-2" variant="ghost" size="icon">
        <slot />
        <span class="sr-only">{{ props.tooltipText }}</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent>{{ props.tooltipText }}</TooltipContent>
  </Tooltip>
  <Button v-else @click="props.click" class="m-2" variant="ghost" size="icon">
    <slot />
    <span class="sr-only">{{ props.tooltipText }}</span>
  </Button>
</template>
