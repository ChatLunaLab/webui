<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { PlusIcon, ArrowUpIcon } from '@radix-icons/vue'

const sidebarStore = useSidebarStore()

const screenInfoStore = useScreenInfoStore()

const chatInput = ref<HTMLTextAreaElement | null>(null)

const disabled = ref(true)

onMounted(() => {
  chatInput.value?.addEventListener('input', function () {
    this.style.height = 'inherit'

    this.style.height = `${this.scrollHeight > 200 ? 200 : this.scrollHeight}px`

    disabled.value = this.value.length === 0
  })
})
</script>

<template>
  <div
    id="chat-message-bar"
    class="flex w-full flex-col shrink-0 justify-center items-center"
  >
    <div class="flex w-full flex-col">
      <div class="w-full px-2.5 md:px-5">
        <div
          class="bg-accent/70 rounded-[26px] flex justify-between max-w-2xl md:max-w-5xl w-full py-2 mx-auto px-2 items-center"
        >
          <div class="flex w-full items-end gap-2">
            <Button class="rounded-full shrink-0" size="icon" variant="ghost">
              <PlusIcon class="size-5" />
            </Button>
            <textarea
              ref="chatInput"
              class="w-full focus:ring-0 focus-visible:ring-0 max-h-[200px] border-none outline-none placeholder:text-muted-foreground bg-inherit resize-none min-h-[30px]"
              rows="1"
              placeholder="发送一条消息......"
            />
            <Button
              class="rounded-full shrink-0"
              size="icon"
              variant="ghost"
              :disabled="disabled"
            >
              <ArrowUpIcon class="size-5" />
            </Button>
          </div>
        </div>
        <p class="my-1.5 text-xs text-muted-foreground text-center line-clamp-1">
          LLM 可能会生成错误和有害的信息，请核查重要信息
        </p>
      </div>
    </div>
  </div>
</template>
