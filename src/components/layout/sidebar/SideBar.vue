<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import DesktopSidebarIcon from '@/components/icons/DesktopSidebarIcon.vue'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import MobileSidebarIcon from '@/components/icons/MobileSidebarIcon.vue'
import TopBarIcon from '@/components/layout/topbar/TopBarIcon.vue'
import { watch } from 'vue'

const sidebarStore = useSidebarStore()

const screenInfoStore = useScreenInfoStore()

watch(
  () => screenInfoStore.isMobile,
  (isMobile) => {
    sidebarStore.isOpen = !isMobile
  }
)
</script>

<template>
  <div
    id="sidebar_container"
    v-if="!screenInfoStore.isMobile"
    :class="
      cn(
        'h-full flex flex-shrink-0',
        'relative ease-out duration-300 transition-all overflow-hidden',
        sidebarStore.isOpen === true ? 'w-[260px] visible' : 'w-[0px]',
        !sidebarStore.delayStatus && !sidebarStore.isOpen ? 'hidden' : 'visible'
      )
    "
  >
    <aside class="bg-background flex flex-col h-full w-full">
      <div class="w-full flex justify-between h-14 bg-background items-center">
        <TopBarIcon tooltipText="关闭边栏" :click="sidebarStore.toggle">
          <MobileSidebarIcon
            v-if="screenInfoStore.isMobile"
            class="size-5 opacity-60"
          />
          <DesktopSidebarIcon
            v-if="!screenInfoStore.isMobile"
            class="size-5 opacity-60"
          />
        </TopBarIcon>
      </div>

      <slot />
    </aside>

    <Separator class="h-full" orientation="vertical"></Separator>
  </div>

  <Sheet
    aria-describedby="undefined"
    v-model:open="sidebarStore.isOpen"
    v-if="screenInfoStore.isMobile"
  >
    <SheetContent class="p-0 w-[260px]" :showClose="false" side="left">
      <aside class="bg-background flex flex-col h-full w-full">
        <div
          class="w-full flex justify-between h-14 bg-background items-center"
        >
          <TopBarIcon tooltipText="关闭边栏" :click="sidebarStore.toggle">
            <MobileSidebarIcon
              v-if="screenInfoStore.isMobile"
              class="size-5 opacity-60"
            />
            <DesktopSidebarIcon
              v-if="!screenInfoStore.isMobile"
              class="size-5 opacity-60"
            />
          </TopBarIcon>
        </div>

        <slot />
      </aside>
    </SheetContent>
  </Sheet>
</template>
