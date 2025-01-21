import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { LoginInfo, Preference } from '@/lib/types'
import { computedAsync } from '@vueuse/core'
import { getUserInfo } from '@/apis/auth'

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
    let loginData = reactive<LoginInfo>({
      accessToken: '',
      refreshToken: ''
    })
    const set = (newData: LoginInfo) => {
      const { clear } = useUserInfo()

      clear()
      loginData = Object.assign(loginData, newData)
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

export const useUserInfo = defineStore('userInfo', () => {
  let currentUserInfo = ref<{
    username: string
    email: string
    avatar: string
    bindId: string
  }>({
    username: '',
    email: '',
    avatar: '',
    bindId: ''
  })

  const userInfo = computedAsync(
    async () => {
      if (currentUserInfo.value.username.length > 0) {
        return currentUserInfo.value
      }

      const data = await getUserInfo()
      currentUserInfo.value = data
      return currentUserInfo.value
    },
    null,
    {
      onError: (e) => {
        console.log(e)
      },
      lazy: true
    }
  )

  const clear = () => {
    currentUserInfo.value = {
      username: '',
      email: '',
      avatar: ''
    }
  }

  return {
    userInfo,
    clear
  }
})
