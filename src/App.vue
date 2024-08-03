<script setup lang="ts">
import { Button } from '@/components/ui/button'
import SideBar from '@/components/layout/SideBar.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { TooltipProvider } from '@/components/ui/tooltip'

</script>

<template>
  <TooltipProvider >
  <div class="relative h-screen w-screen flex flex-1 flex-row bg-background dark:bg-background " id="home">
    <SideBar >
      <Button>Hello</Button>
    </SideBar>
    <!-- body -->
    <div class = "flex-auto">

      <TopBar>

      </TopBar>

    </div>
  </div>
  </TooltipProvider>
</template>
