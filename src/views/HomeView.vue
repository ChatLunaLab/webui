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
import { useScreenInfoStore } from '@/stores/screen'
import TopBarIcon from '@/components/layout/TopBarIcon.vue'

const sidebarStore = useSidebarStore()
const screenInfoStore = useScreenInfoStore()
</script>

<template>
  <!-- body -->
  <div class="flex-auto h-full w-full">
    <TopBar class="justify-between">
      <template v-slot:navigation v-if="!screenInfoStore.isMobile">
        <TopBarIcon v-if="!sidebarStore.isOpen " tooltipText="新聊天">
          <NewChatIcon class="size-5" />
        </TopBarIcon>
        <HomeModelSelector key="model" />
      </template>

      <HomeModelSelector key="model" v-if="screenInfoStore.isMobile" />

      <TopBarIcon v-if="screenInfoStore.isMobile" tooltipText="新聊天">
          <NewChatIcon class="size-5" />
        </TopBarIcon>
    </TopBar>
  </div>
</template>
