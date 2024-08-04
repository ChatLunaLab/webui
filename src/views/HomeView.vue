<script setup lang="ts">
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { useSidebarStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import HomeModelSelector from '@/components/layout/HomeModelSelector.vue'
import TopBar from '@/components/layout/TopBar.vue'

const sidebarStore = useSidebarStore()
</script>

<template>
  <!-- body -->
  <div class="flex-auto h-full w-full">
    <TopBar>
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
    </TopBar>
  </div>
</template>
