<script setup lang="ts">
import { useUserInfo } from '@/stores';
import { storeToRefs } from 'pinia';

const { userInfo } = storeToRefs(useUserInfo())

</script>
<template>

    <img
      :src="userInfo?.avatar"
      class="w-10 h-10 rounded-full"
      alt="Avatar"
      v-if="userInfo?.avatar && userInfo?.avatar !== ''"
    />

    <span v-else class="w-8 h-8 rounded-full bg-[#00bbf0] flex items-center justify-center text-white">
      {{ userInfo?.username[0].toUpperCase() }}
    </span>

</template>
