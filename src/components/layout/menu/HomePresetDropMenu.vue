<script setup lang="ts">
import {
  DropdownMenuItem} from '@/components/ui/dropdown-menu'
import { Pencil2Icon, Share2Icon, TrashIcon } from '@radix-icons/vue'
</script>

<template>
  <DropdownMenuItem>
    <Pencil2Icon class="size-4 mr-2" />
    编辑
  </DropdownMenuItem>
  <DropdownMenuItem>
    <Share2Icon class="size-4 mr-2" />
    分享
  </DropdownMenuItem>
  <DropdownMenuItem>
    <TrashIcon class="size-4 mr-2 text-red-500" />
    <span class="text-red-500">删除</span>
  </DropdownMenuItem>
</template>
