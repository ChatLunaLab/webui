<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { useSidebarStore } from '@/stores/ui'
import { Button } from '@/components/ui/button'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import MobileSidebarIcon from '@/components/icons/MobileSidebarIcon.vue'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useScreenInfoStore } from '@/stores/screen'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import TopBarIcon from './TopBarIcon.vue'
import { storeToRefs } from 'pinia'

const sidebarStore = useSidebarStore()

const screenInfoStore = useScreenInfoStore()

const { isMobile } = storeToRefs(screenInfoStore)
const { isOpen } = storeToRefs(sidebarStore)


interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div class = 'sticky w-full top-0'>
  <div
    id="top_bar"
    :class="cn('w-full flex h-14 items-center bg-background ', props.class)"
  >
    <div class="flex items-center overflow-hidden">
      <TopBarIcon
        :click="sidebarStore.toggle"
        v-if="!isOpen || isMobile"
        tooltipText="展开边栏"
        :tooltip="false"
      >
        <MobileSidebarIcon
          v-if="isMobile"
          class="size-5 opacity-60"
        />
        <DesktopSidebarIcon
          v-if="!isMobile"
          class="size-5 opacity-60"
        />
      </TopBarIcon>
      <slot name="navigation" />
    </div>

    <slot />
  </div>
  <Separator class="w-full" orientation="horizontal" />
  </div>
</template>
