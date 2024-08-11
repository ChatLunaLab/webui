<script setup lang="ts">
import { Button } from '@/components/ui/button'
import SideBar from '@/components/layout/SideBar.vue'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RouterView } from 'vue-router'
import SideBarContent from '@/components/layout/SideBarContent.vue';
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
