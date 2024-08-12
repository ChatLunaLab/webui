<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ref } from 'vue'
import UserInfoMenu from '../menu/UserInfoMenu.vue'

interface SideBarUserCardProps {
  class?: string
  name: string
  avatar: string
}

const open = ref(false)

defineProps<SideBarUserCardProps>()
</script>

<template>
  <DropdownMenu v-model:open="open">
    <DropdownMenuTrigger>
      <Card
        :class="
          cn(
            'w-full rounded-none rounded-t-xl flex items-center justify-start h-14 hover:bg-secondary hover:cursor-pointer',
            $attrs.class ?? ''
          )
        "
      >
        <CardContent
          class="p-0 m-[6px] mx-[14px] h-full w-full flex gap-4 items-center"
        >
          <img :src="avatar" class="w-7 h-7 rounded-full" />
          <p class="leading-none font-medium text-sm">{{ name }}</p>
        </CardContent>
      </Card>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[260px]">
      <UserInfoMenu />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
