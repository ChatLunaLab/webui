<script setup lang="ts">
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ref, watch } from 'vue'
import { useScreenInfoStore } from '@/stores/screen'
import HomePresetDropMenu from './HomePresetDropMenu.vue'
import Button from '../ui/button/Button.vue'
import { DotsVerticalIcon } from '@radix-icons/vue'
import { mergeConfig } from 'vitest/config'

interface SideBarIconItemProps {
  href?: string
  label: string
  variant: 'ghost' | 'secondary'
  showDots?: boolean
}

const open = ref(false)
const screenInfoStore = useScreenInfoStore()

const props = withDefaults(defineProps<SideBarIconItemProps>(), {
  href: '#',
  showDots: true
})

const hovered = ref(props.variant === 'secondary')
const selected = props.variant === 'secondary'

</script>

<template>
  <a
    :href="href"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    :class="
      cn(
        buttonVariants({
          variant: selected || hovered || open ? 'secondary' : 'ghost',
          size: 'lg'
        }),
        'm-0 gap-4 px-2 my-0 justify-normal items-center h-9 group'
      )
    "
  >
    <slot />

    <div class="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm">
      {{ label }}
    </div>

    <div
      :class="
        cn(
          selected || hovered || open ? 'visible' : 'invisible',
          'group-hover:visible flex'
        )
      "
    >
      <DropdownMenu v-if="showDots" v-model:open="open">
        <DropdownMenuTrigger>
          <Tooltip v-if="!screenInfoStore.isMobile">
            <TooltipTrigger as-child>
              <Button class="items-center" variant="ghost" size="icon">
                <DotsVerticalIcon class="size-4 opacity-50" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>选项</p>
            </TooltipContent>
          </Tooltip>
          <Button v-else class="items-center" variant="ghost" size="icon">
            <DotsVerticalIcon class="size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <HomePresetDropMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </a>
</template>
