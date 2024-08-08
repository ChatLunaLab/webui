<script setup lang="ts">
import { HomeIcon, DotsVerticalIcon, TokensIcon } from '@radix-icons/vue'
import SideBarItem from '../sidebar/SideBarItem.vue'
import HomePresetDropMenu from '../sidebar/HomePresetDropMenu.vue'
import SideBarItemIcon from '../sidebar/SideBarItemIcon.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref } from 'vue'
import Button from '../ui/button/Button.vue'

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
        title: '这是一个测试'
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
        title: '为 TypeScript 提供类型支持12455'
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
        title: '为 TypeScript 提供类型支持111'
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
      }
    ]
  }
]
</script>

<template>
  <ScrollArea>
    <div class="flex flex-col">
      <!-- header -->
      <div class="space-y-1 flex-col flex">
        <SideBarItem
          v-for="label in agentData"
          href="#"
          :key="label"
          :label="label"
          variant="ghost"
        >
          <HomeIcon class="size-5 opacity-50 mr-2" />
          <template v-slot:right>
            <SideBarItemIcon label="选项">
              <Button class="items-center" variant="ghost" size="icon">
                <DotsVerticalIcon class="size-4 opacity-50" />
              </Button>

              <template v-slot:menu>
                <HomePresetDropMenu />
              </template>
            </SideBarItemIcon>
          </template>
        </SideBarItem>

        <SideBarItem label="工作台" variant="ghost">
          <TokensIcon class="size-5 opacity-50 mr-2" />
        </SideBarItem>
      </div>

      <!-- chat contents -->
      <div class="space-y-3 w-fit">
        <div v-for="data in chatData" :key="data.name" class="mt-4 first:mt-6">
          <p class="text-xs text-muted-foreground ml-4 mb-4">
            {{ data.name }}
          </p>

          <ol>
            <li
              v-for="conversation in data.conversations"
              :key="conversation.id"
            >
              <SideBarItem
                :label="conversation.title"
                :variant="
                  conversation.id === currentConversationId
                    ? 'secondary'
                    : 'ghost'
                "
              >
                <template v-slot:right>
                  <SideBarItemIcon label="选项">
                    <Button variant="ghost" size="icon">
                      <DotsVerticalIcon class="size-4 opacity-50" />
                    </Button>

                    <template v-slot:menu>
                      <HomePresetDropMenu />
                    </template>
                  </SideBarItemIcon>
                </template>
              </SideBarItem>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </ScrollArea>
</template>
