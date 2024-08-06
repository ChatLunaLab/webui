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
    <TrashIcon class="size-4 mr-2 stroke-red-500" />
    <span class="text-red-500">删除</span>
  </DropdownMenuItem>
</template>
