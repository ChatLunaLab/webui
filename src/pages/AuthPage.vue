<script setup lang="ts">
import NewChatIcon from '@/components/icons/NewChatIcon.vue'
import { useSidebarStore } from '@/stores/ui'
import SignupForm from '@/components/layout/auth/SignupForm.vue'
import SignInForm from '@/components/layout/auth/SigninForm.vue'
import { Separator } from '@/components/ui/separator'
import { ref, provide, reactive } from 'vue'

const status = ref('signin')

provide('status', status)
</script>

<template>
  <!-- body -->
  <div class="flex flex-col h-full w-full">
    <div class="m-8 flex-none">
      <img
        class="size-8"
        src="https://avatars.githubusercontent.com/u/139454032?s=200&v=4"
      />
    </div>
    <div class="lg:p-8 flex-none">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <Transition
          enter-active-class="duration-300 ease-out"
          enter-from-class="transform opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="transform opacity-0"
        >
          <SignupForm v-if="status === 'signup'" />
          <SignInForm v-else />
        </Transition>
      </div>
    </div>

    <div
      class="text-center text-sm text-muted-foreground flex-grow absolute bottom-[10px] w-full px-4"
    >
      <div class="flex justify-between px-20">
        <span>copyright © 2025</span>
        <span>Powered by ChatLuna WebUI</span>
      </div>
    </div>
  </div>
</template>
