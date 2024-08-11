<script setup lang="ts">
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { useSidebarStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import HomeModelSelector from '@/components/topbar/HomeModelSelector.vue'
import TopBar from '@/components/topbar/TopBar.vue'
import { useScreenInfoStore } from '@/stores/screen'
import TopBarIcon from '@/components/topbar/TopBarIcon.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import UserInfoMenu from '@/components/sidebar/UserInfoMenu.vue'
import ChatRootLayout from '@/components/chat/ChatLayout.vue'
import ChatMessageBar from '@/components/chat/ChatMessageBar.vue'

const sidebarStore = useSidebarStore()
const screenInfoStore = useScreenInfoStore()
</script>

<template>
  <!-- body -->
  <div class="flex-1 h-full w-full">
    <div class="flex flex-col  h-[100vh] w-full">
      <TopBar class="justify-between px-2 sm:px-6">
        <template v-slot:navigation v-if="!screenInfoStore.isMobile">
          <TopBarIcon v-if="!sidebarStore.isOpen" tooltipText="新聊天">
            <NewChatIcon class="size-5 opacity-60" />
          </TopBarIcon>
          <HomeModelSelector key="model" />
        </template>

        <HomeModelSelector key="model" v-if="screenInfoStore.isMobile" />

        <TopBarIcon v-if="screenInfoStore.isMobile" tooltipText="新聊天">
          <NewChatIcon class="size-5 opacity-60" />
        </TopBarIcon>

        <DropdownMenu v-if="!screenInfoStore.isMobile">
          <DropdownMenuTrigger>
            <img
              src="https://q.qlogo.cn/headimg_dl?dst_uin=2187778735&spec=640&img_type=jpg"
              class="w-6 h-6 rounded-full hover:cursor-pointer hover:opacity-60"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-[160px]">
            <UserInfoMenu />
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBar>

      <ChatRootLayout />

      <ChatMessageBar />
    </div>

  </div>
</template>
