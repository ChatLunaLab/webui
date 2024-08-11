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
import { DotsVerticalIcon } from '@radix-icons/vue'
import Button from '../ui/button/Button.vue'

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
        'm-0 px-2 my-0 justify-normal items-center h-9 group relative w-full'
      )
    "
  >
    <div
      class="grow overflow-hidden whitespace-nowrap text-sm relative ml-[2px] mr-5"
    >
      {{ label }}
      <div
        :class="
          cn(
            'absolute bg-gradient-to-r from-0% from-transparent to-background h-[25px] w-8 bottom-0 right-0',
            (hovered || selected) && 'from-10% w-10 to-secondary/80',
            open && 'from-20% w-10 to-secondary'
          )
        "
      />
    </div>

    <div
      :class="
        cn(
          selected || hovered || open ? 'visible' : 'invisible',
          'group-hover:visible flex absolute bottom-0 right-0 items-center'
        )
      "
    >
      <DropdownMenu v-model:open="open">
        <DropdownMenuTrigger>
          <Tooltip v-if="!screenInfoStore.isMobile">
            <TooltipTrigger as-child>
              <Button
                class="items-center"
                :variant="open ? 'secondary' : 'ghost'"
                size="icon"
              >
                <DotsVerticalIcon class="size-4 opacity-50" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>选项</p>
            </TooltipContent>
          </Tooltip>

          <Button
            v-else
            class="items-center"
            :variant="open ? 'secondary' : 'ghost'"
            size="icon"
          >
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
