import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Preference } from '@/lib/types'

export const usePreferenceStore = defineStore(
  'preference',
  () => {
    const preference = reactive<Preference>({
      baseURL: "http://127.0.0.1:6140"
    })

    const set = (preference: Preference) => {
      Object.assign(preference, preference)
    }

    return {
      preference,
      set
    }
  },
  {
    persist: true,
  }
)
