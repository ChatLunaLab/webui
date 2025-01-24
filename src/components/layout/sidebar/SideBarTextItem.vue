<script setup lang="ts">
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
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useScreenInfoStore } from '@/stores/screen'
import SideBarConversationMenu from '../menu/SideBarConversationMenu.vue'
import { DotsVerticalIcon } from '@radix-icons/vue'
import { Button, buttonVariants } from '@/components/ui/button'
import { useRouter } from 'vue-router'

interface SideBarIconItemProps {
  href?: string
  label: string
  variant: 'ghost' | 'secondary'
  conversationId?: string
}

const open = ref(false)
const screenInfoStore = useScreenInfoStore()
const router = useRouter()

const props = withDefaults(defineProps<SideBarIconItemProps>(), {
  href: '#'
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  event.preventDefault() // 阻止默认的链接行为
  emit('click', event)
  router.push(props.href)
}

const hovered = ref(props.variant === 'secondary')
const selected = computed(() => props.variant === 'secondary')
</script>

<template>
  <a
    href="#"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    @click="handleClick"
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
          <SideBarConversationMenu :conversationId="conversationId ?? ''" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </a>
</template>
