<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { provide, ref } from 'vue'
import { useScreenInfoStore } from '@/stores/screen'

defineProps<{
  label: string
}>()

const open = ref(false)
const screenInfoStore = useScreenInfoStore()

provide('open-menu', open)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Tooltip v-if="!screenInfoStore.isMobile">
        <TooltipTrigger as-child>
          <slot />
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ label }}</p>
        </TooltipContent>
      </Tooltip>
      <slot v-else />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <slot name="menu" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
