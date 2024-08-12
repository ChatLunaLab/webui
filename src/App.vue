<script setup lang="ts">
import { SideBar, SideBarContent } from '@/components/layout/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RouterView } from 'vue-router'
</script>

<template>
  <TooltipProvider>
    <div
      class="relative h-screen w-screen flex flex-row bg-background dark:bg-background"
      id="home"
    >
      <SideBar>
        <SideBarContent />
      </SideBar>

      <RouterView />
    </div>
  </TooltipProvider>
</template>
