<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { CheckIcon, ChevronDownIcon } from '@radix-icons/vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { onMounted, ref, watchEffect } from 'vue'
import { useModelStore } from '@/stores/model'
import { storeToRefs } from 'pinia'
import { useChatListStore } from '@/stores/chat'
import { useAssistantStore } from '@/stores/assistant'

const { refreshModelList, getCurrentModel } = useModelStore()
const { currentConversationId } = storeToRefs(useChatListStore())
const { currentAssistant } = storeToRefs(useAssistantStore())

const open = ref(false)

const { modelList, currentModel } = storeToRefs(useModelStore())

const props = defineProps<{
  class?: string
}>()

watchEffect(() => {
  const currentConversationIdValue = currentConversationId.value
  if (currentConversationIdValue === '') {
    currentModel.value = currentAssistant.value.model
    return
  }
  currentModel.value =
    getCurrentModel(currentConversationIdValue)?.name ?? currentModel.value
})

onMounted(() => {
  refreshModelList()
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        role="combobox"
        :aria-expanded="open"
        :class="
          cn('my-3 p-3 ease-out duration-300 transition-all', props.class)
        "
      >
        {{
          currentModel
            ? modelList.find((model) => model.name === currentModel)?.name
            : '选择一个模型...'
        }}
        <ChevronDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-[200px] sm:w-[400px] p-1">
      <Command>
        <CommandInput placeholder="搜索模型..." />
        <CommandEmpty>找不到模型</CommandEmpty>

        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="model in modelList"
              :key="model.name"
              :value="model.name"
              @select="
                () => {
                  currentModel = model.name
                  open = false
                }
              "
              class="p-2 flex justify-between"
            >
              <p class="text-sm">{{ model.name }}</p>

              <CheckIcon
                :class="
                  cn(
                    'h-4 w-4',
                    model.name === currentModel ? 'opacity-100' : 'opacity-0'
                  )
                "
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
