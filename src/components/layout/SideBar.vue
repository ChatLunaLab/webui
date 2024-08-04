<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { useSidebarStore } from '@/stores/ui'

const sidebarStore = useSidebarStore()
</script>

<template>
  <div
    id="desktop_sidebar_container"
    :class="
      cn(
        'h-full flex',
        'relative ease-out duration-300 transition-all overflow-hidden',
        sidebarStore.isOpen === true ? 'w-[260px] visible' : 'w-[0px]',
        !sidebarStore.delayStatus && !sidebarStore.isOpen ? 'hidden' : 'visible'
      )
    "
  >
    <aside class="bg-background flex flex-col h-full w-full">
      <div class="w-full flex justify-between h-14 bg-background items-center">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="sidebarStore.toggle"
              class="m-2"
              variant="ghost"
              size="icon"
            >
              <DesktopSidebarIcon class="size-5" />
              <span class="sr-only">关闭边栏</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>关闭边栏</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button class="m-2" variant="ghost" size="icon">
              <NewChatIcon class="size-5" />
              <span class="sr-only">新聊天</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>新聊天</TooltipContent>
        </Tooltip>
      </div>

      <slot />
    </aside>

    <Separator class="h-full" orientation="vertical"></Separator>
  </div>
</template>
