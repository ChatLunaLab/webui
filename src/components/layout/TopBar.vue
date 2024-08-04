<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { useSidebarStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import HomeModelSelector from './HomeModelSelector.vue'

const sidebarStore = useSidebarStore()
</script>

<template>
  <div id="top_bar" class="w-full flex h-14 items-center bg-background">
    <Tooltip v-if="!sidebarStore.isOpen">
      <TooltipTrigger as-child>
        <Button
          @click="sidebarStore.toggle"
          class="m-2"
          variant="ghost"
          size="icon"
        >
          <DesktopSidebarIcon class="size-5" />
          <span class="sr-only">开启边栏</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>开启边栏</TooltipContent>
    </Tooltip>

    <Tooltip v-if="!sidebarStore.isOpen">
      <TooltipTrigger as-child>
        <Button class="m-2" variant="ghost" size="icon">
          <NewChatIcon class="size-5" />
          <span class="sr-only">新聊天</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>新聊天</TooltipContent>
    </Tooltip>

    <HomeModelSelector />
  </div>
  <Separator class="w-full" orientation="horizontal" />
</template>
