<script setup lang="ts">
import { SideBar, SideBarContent } from '@/components/layout/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentRoute = router.currentRoute
</script>

<template>
  <RouterView
    v-if="
      currentRoute.name == null ||
      currentRoute.name === 'auth' ||
      currentRoute.name === 'settings'
    "
  />

  <TooltipProvider v-else>
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
