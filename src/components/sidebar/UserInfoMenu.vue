<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { computed, inject, watch } from 'vue'
import type { Ref } from 'vue'
import { GearIcon } from '@radix-icons/vue'
</script>

<template>
  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuItem class="h-9">
    <GearIcon class="size-4 mr-2" />
    <span class="text-sm">设置</span>
  </DropdownMenuItem>
  <DropdownMenuItem class="h-9">
    <GearIcon class="size-4 mr-2" />
    <span class="text-sm">存档聊天</span>
  </DropdownMenuItem>
  <DropdownMenuItem class="h-9">
    <GearIcon class="size-4 mr-2" />
    <span class="text-sm">管理面板</span>
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem class="h-9">
    <TrashIcon class="size-4 mr-2 stroke-red-500" />
    <span class="text-red-500">退出登录</span>
  </DropdownMenuItem>
</template>
