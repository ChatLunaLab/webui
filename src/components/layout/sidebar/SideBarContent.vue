<script setup lang="ts">
import { HomeIcon, TokensIcon } from '@radix-icons/vue'
import SideBarTextItem from './SideBarTextItem.vue'
import SideBarAgentItem from './SideBarIconItem.vue'
import { ref } from 'vue'
import SideBarUserCard from './SideBarUserCard.vue'
import { useConversation } from '@/stores/conversation'
import { storeToRefs } from 'pinia';

const { groupedConversationList } = storeToRefs(useConversation())


const agentData = ['默认', '猫娘', '角色 tag 生成 角色 tag 生成 角色 tag 生成']

const currentConversationId = ref('')
</script>

<template>
  <div class="flex h-full flex-col p-2 w-full overflow-x-hidden overflow-y-auto">
    <!-- header -->
    <div class="flex flex-col w-full">
      <SideBarAgentItem
        v-for="label in agentData"
        href="#"
        :key="label"
        :label="label"
        variant="ghost"
      >
        <HomeIcon class="size-5 opacity-50 flex-shrink-0" />
      </SideBarAgentItem>

      <SideBarAgentItem :showDots="false" label="工作台" variant="ghost">
        <TokensIcon class="size-5 opacity-50 flex-shrink-0" />
      </SideBarAgentItem>
    </div>

    <!-- chat contents -->
    <div class="space-y-3 w-full grow">
      <div v-for="data in groupedConversationList" :key="data.time" class="mt-4 first:mt-6">
        <p class="text-xs text-muted-foreground ml-2 mb-4">
          {{ data.time }}
        </p>

        <ol>
          <li v-for="conversation in data.conversations" :key="conversation.id">
            <SideBarTextItem
              :label="conversation.title ?? '未命名对话'"
              :variant="
                conversation.id === currentConversationId
                  ? 'secondary'
                  : 'ghost'
              "
            ></SideBarTextItem>
          </li>
        </ol>
      </div>
    </div>
  </div>
  <SideBarUserCard />
</template>
