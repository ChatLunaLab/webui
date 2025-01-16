<script setup lang="ts">
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator} from '@/components/ui/dropdown-menu'
import { GearIcon,ExitIcon } from '@radix-icons/vue'
</script>

<template>
  <DropdownMenuItem class="h-9">
    <span class="text-sm">设置</span>
  </DropdownMenuItem>
  <DropdownMenuItem class="h-9">
    <span class="text-sm">存档聊天</span>
  </DropdownMenuItem>
  <DropdownMenuItem class="h-9">

    <span class="text-sm">管理面板</span>
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem class="h-9">
    <span class="text-red-500">注销</span>
  </DropdownMenuItem>
</template>
