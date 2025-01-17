import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginInfo, Preference } from '@/lib/types'

export const usePreferenceStore = defineStore(
  'preference',
  () => {
    let preference = reactive<Preference>({
      baseURL: 'http://127.0.0.1:6140/chatluna'
    })

    const set = (newPreference: Preference) => {
      preference = Object.assign(preference, newPreference)
    }

    return {
      preference,
      set
    }
  },
  {
    persist: true
  }
)

export const useLoginData = defineStore(
  'loginData',
  () => {
    let loginData = ref<LoginInfo>({
      accessToken: '',
      refreshToken: ''
    })
    const set = (newData: LoginInfo) => {
     loginData.value = newData
    }
    return {
      loginData,
      set
    }
  },
  {
    persist: true
  }
)
