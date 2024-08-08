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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { provide, ref, watch } from 'vue'
import { useScreenInfoStore } from '@/stores/screen'
import HomePresetDropMenu from './HomePresetDropMenu.vue'
import Button from '../ui/button/Button.vue'
import DotsVerticalIcon from '../icons/DotsVerticalIcon.vue'

interface SideBarIconItemProps {
  href?: string
  label: string
  variant: 'ghost' | 'secondary'
}

const open = ref(false)
const screenInfoStore = useScreenInfoStore()

const props = withDefaults(defineProps<SideBarIconItemProps>(), {
  href: '#'
})

const selected = ref(props.variant == 'secondary')

watch(open, (value) => {
  selected.value = value
})
</script>

<template>
  <div>
  <a
    :href="href"
    @mouseover="selected = true"
    @mouseleave="selected = false"
    :class="
      cn(
        buttonVariants({
          variant: selected || open ? 'secondary' : 'ghost',
          size: 'lg'
        }),
        'm-0 gap-4 px-2 my-0 justify-normal items-center h-9 group '
      )
    "
  >
    <slot />

    <div class="w-full grow overflow-hidden text-ellipsis whitespace-nowrap text-sm">
      {{ label }}
    </div>

    <div
      :class="
        cn(
          selected || open ? 'visible' : 'invisible',
          'group-hover:visible flex'
        )
      "
    >
      <DropdownMenu v-model:open="open">
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
</div>
</template>
