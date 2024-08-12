<script setup lang="ts">
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { useSidebarStore } from '@/stores/ui'
import { HomeModelSelector } from '@/components/layout/selector'
import { TopBar, TopBarIcon } from '@/components/layout/topbar'
import { useScreenInfoStore } from '@/stores/screen'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserInfoMenu } from '@/components/layout/menu'
import { ChatRootLayout, ChatMessageBar } from '@/components/layout/chat'

const sidebarStore = useSidebarStore()
const screenInfoStore = useScreenInfoStore()
</script>

<template>
  <!-- body -->
  <div class="flex-1 h-full w-full">
    <div class="flex flex-col h-[100vh] w-full">
      <TopBar class="justify-between ">
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
              class="mr-6 w-6 h-6 rounded-full hover:cursor-pointer hover:opacity-60"
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
