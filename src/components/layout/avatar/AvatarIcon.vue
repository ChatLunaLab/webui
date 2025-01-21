<script setup lang="ts">
import { useUserInfo } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const { userInfo } = storeToRefs(useUserInfo())

const props = defineProps<{
  src?: string
  firstChar?: string
}>()

const src = computed(() => {
  if (props.src != null) {
    return props.src
  } else {
    return userInfo.value?.avatar
  }
})

const firstChar = computed(() => {
  if (props.firstChar != null) {
    return props.firstChar
  } else {
    return userInfo.value?.username?.charAt(0) || ''
  }
})
</script>
<template>
  <img
    :src="src"
    class="size-6 rounded-full"
    alt="Avatar"
    v-if="src && src !== ''"
  />

  <span
    v-else
    class="size-6 text-sm rounded-full bg-[#00bbf0] flex items-center justify-center text-white"
  >
    {{ firstChar.toUpperCase() }}
  </span>
</template>
