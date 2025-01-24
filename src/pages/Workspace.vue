<script setup lang="ts">
import { TopBar, TopBarIcon } from '@/components/layout/topbar'
import WorkspaceNav from '@/components/layout/workspace/WorkspaceNav.vue';

</script>

<template>
  <!-- body -->
  <div class="flex-1 h-full w-full">
    <div class="flex flex-col h-[100vh] w-full">
      <TopBar class="justify-between">
        <template v-slot:navigation>
          <WorkspaceNav class="ml-6" />
        </template>
      </TopBar>
    </div>
  </div>
</template>
