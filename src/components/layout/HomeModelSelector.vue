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
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { ref } from 'vue'
import ScrollArea from '../ui/scroll-area/ScrollArea.vue'

const models = [
  {
    id: 'gpt-3.5-turbo',
    object: 'model',
    created: 1677610602,
    owned_by: 'openai'
  },
  {
    id: 'gpt-3.5-turbo-0125',
    object: 'model',
    created: 1706048358,
    owned_by: 'system'
  },
  {
    id: 'gpt-3.5-turbo-1106',
    object: 'model',
    created: 1698959748,
    owned_by: 'system'
  },
  {
    id: 'gpt-3.5-turbo-0613',
    object: 'model',
    created: 1686587434,
    owned_by: 'openai'
  },
  {
    id: 'gpt-3.5-turbo-0301',
    object: 'model',
    created: 1677649963,
    owned_by: 'openai'
  },
  {
    id: 'gpt-4o',
    object: 'model',
    created: 1715367049,
    owned_by: 'system'
  },
  {
    id: 'gpt-4o-2024-05-13',
    object: 'model',
    created: 1715368132,
    owned_by: 'system'
  },
  {
    id: 'gpt-4o-mini',
    object: 'model',
    created: 1715367049,
    owned_by: 'system'
  },
  {
    id: 'gpt-4o-mini-2024-07-18',
    object: 'model',
    created: 1715367049,
    owned_by: 'system'
  },
  {
    id: 'gpt-4',
    object: 'model',
    created: 1678604602,
    owned_by: 'openai'
  }
]

const open = ref(false)

const currentModel = ref('gpt-3.5-turbo')
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        role="combobox"
        :aria-expanded="open"
        :class="cn('m-3 p-3 ease-out duration-300 transition-all ')"
      >
        {{
          currentModel
            ? models.find((model) => model.id === currentModel)?.id
            : '选择一个模型...'
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-[200px] sm:w-[400px] p-1">
      <Command>
        <CommandInput placeholder="搜索模型..." />
        <CommandEmpty>找不到模型</CommandEmpty>

        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="model in models"
              :key="model.id"
              :value="model.id"
              @select="
                () => {
                  currentModel = model.id
                  open = false
                }
              "
              class="p-2 flex justify-between"
            >
              <p class="text-sm">{{ model.id }}</p>

              <Check
                :class="
                  cn(
                    'h-4 w-4',
                    model.id === currentModel ? 'opacity-100' : 'opacity-0'
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
