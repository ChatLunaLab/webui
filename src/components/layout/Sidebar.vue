<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  collapse: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <aside :data-collapsed="collapse" class="bg-background h-full w-[260px]">
    <slot />
  </aside>
</template>
