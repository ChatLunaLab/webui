<script setup lang="ts">
import { buttonVariants } from '../ui/button'
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
import { ref, watch } from 'vue'
import UserInfoMenu from './UserInfoMenu.vue'

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
            'w-full rounded-none rounded-t-xl flex items-center justify-start h-12 hover:bg-secondary hover:cursor-pointer',
            $attrs.class ?? ''
          )
        "
      >
        <CardContent
          class="p-0 m-[8px] mx-[14px] h-full w-full flex gap-4 items-center"
        >
          <img :src="avatar" class="w-6 h-6 rounded-full" />
          <p class="leading-none font-medium text-sm">{{ name }}</p>
        </CardContent>
      </Card>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[260px]">
      <UserInfoMenu />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
