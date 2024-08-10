<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import MobileSidebarIcon from '@/components/icons/MobileSidebarIcon.vue'
import TopBarIcon from '../topbar/TopBarIcon.vue'
import { watch } from 'vue'

const sidebarStore = useSidebarStore()

const screenInfoStore = useScreenInfoStore()

const text = 'chatluna'.repeat(5000)
</script>

<template>
  <div id="chat-root" class="flex flex-1 grow w-full flex-col h-full">
    <div id="chat-content" class="h-full">
      <p>{{ text }}</p>
    </div>
  </div>
</template>
