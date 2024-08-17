import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Preference } from '@/lib/types'

export const usePreference = defineStore(
  'preference',
  () => {
    const value = reactive<Preference>({})

    const set = (preference: Preference) => {
      Object.assign(value, preference)
    }

    return {
      value,
      set
    }
  },
  {
    persist: true,
    
  }
)
