<script setup lang="ts">
import { HomeIcon, DotsVerticalIcon } from '@radix-icons/vue'
import SideBarItem from '../sidebar/SideBarItem.vue'
import HomePresetDropMenu from '../sidebar/HomePresetDropMenu.vue'
import SideBarItemIcon from '../sidebar/SideBarItemIcon.vue'
import { ref } from 'vue';

const presetData = ['默认', '猫娘', '角色 tag 生成']
const selectPreset = ref(presetData[0])
</script>

<template>
  <div class="flex flex-col">
    <!-- header -->
    <div class="space-y-1 flex-col flex">
      <SideBarItem
        v-for="label in presetData"
        href="#"
        :key="label"
        :label="label"
        :variant="label == selectPreset ? 'secondary' : 'ghost'"
      >
        <HomeIcon class="size-5 opacity-50 mr-3" />
        <template v-slot:right>
          <SideBarItemIcon label="选项">
            <Button class="m-2" variant="ghost" size="icon">
              <DotsVerticalIcon class="ml-auto size-4 opacity-50" />
            </Button>

            <template v-slot:menu>
              <HomePresetDropMenu />
            </template>
          </SideBarItemIcon>
        </template>
      </SideBarItem>
    </div>
  </div>
</template>
