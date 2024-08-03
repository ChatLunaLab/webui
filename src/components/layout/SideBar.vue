<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { ref } from 'vue'
import { simpleNumberAnimation } from '@/lib/utils'

const collapse = ref(true)

const desktopSidebarWidth = ref(260)

const toggleSidebar = () => {
  console.log(!collapse.value ? 260 : 0)
  ;(async () => {
    for await (const width of simpleNumberAnimation(
      desktopSidebarWidth.value,
      !collapse.value ? 260 : 0,
      300
    )) {
      desktopSidebarWidth.value = width
    }
    collapse.value = !collapse.value
  })()
}
</script>

<template>
  <div
    id="desktop_sidebar_container"
    :class="
      cn(
        'flex-shrink-0 h-full flex overflow-x-hidden',
        'easy-in-out transition-transform'
      )
    "
    :style="{
      width: desktopSidebarWidth + 'px',
      visibility: collapse ? 'visible' : 'hidden'
    }"
  >
    <aside class="bg-background flex flex-col h-full w-full">
      <div class="w-full flex justify-between h-14 bg-background items-center">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="toggleSidebar"
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
