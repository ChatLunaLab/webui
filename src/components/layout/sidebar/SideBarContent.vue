<script setup lang="ts">
import { HomeIcon, TokensIcon } from '@radix-icons/vue'
import SideBarTextItem from './SideBarTextItem.vue'
import SideBarAgentItem from './SideBarIconItem.vue'
import { ref } from 'vue'
import SideBarUserCard from './SideBarUserCard.vue'

const agentData = ['默认', '猫娘', '角色 tag 生成 角色 tag 生成 角色 tag 生成']

const currentConversationId = ref('1')
const chatData = [
  {
    name: '今天',
    conversations: [
      {
        id: '1',
        title: '为 TypeScript 提供类型支持1234fsdalhjk;5'
      },
      {
        id: '2',
        title: '这是一个测试sdfnmkasmfndskmfjnhaklfjsndlkfhjsdlkjf'
      },
      {
        id: '3',
        title: '这不是测试'
      }
    ]
  },
  {
    name: '7 天前',
    conversations: [
      {
        id: '7',
        title: '为 TypeScript 提供类型支持'
      },
      {
        id: '8',
        title: '这是一个测试'
      },
      {
        id: '9',
        title: '这不是测试'
      }
    ]
  },
  {
    name: '一个月前',
    conversations: [
      {
        id: '10',
        title: '为 TypeScript 提供类型支持'
      },
      {
        id: '11',
        title: '这是一个测试'
      },
      {
        id: '12',
        title: '这不是测试'
      }
    ]
  },
  {
    name: '2024 年',
    conversations: [
      {
        id: '13',
        title: '为 TypeScript 提供类型支持'
      },
      {
        id: '14',
        title: '这是一个测试'
      },
      {
        id: '15',
        title: '这不是测试'
      }
    ]
  },
  {
    name: '2023 年',
    conversations: [
      {
        id: '16',
        title: '为 TypeScript 提供类型支持'
      },
      {
        id: '17',
        title: '这是一个测试'
      },
      {
        id: '18',
        title: '这不是测试'
      },
      {
        id: '19',
        title: '这是一个测试'
      },
      {
        id: '20',
        title: '这不是测试'
      }
    ]
  }
]
</script>

<template>
  <div class="flex flex-col p-2 w-full overflow-x-hidden overflow-y-auto">
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
    <div class="space-y-3 w-full">
      <div v-for="data in chatData" :key="data.name" class="mt-4 first:mt-6">
        <p class="text-xs text-muted-foreground ml-2 mb-4">
          {{ data.name }}
        </p>

        <ol>
          <li v-for="conversation in data.conversations" :key="conversation.id">
            <SideBarTextItem
              :label="conversation.title"
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
  <SideBarUserCard
    name="dingyi"
    avatar="https://q.qlogo.cn/headimg_dl?dst_uin=2187778735&spec=640&img_type=jpg"
  />
</template>
