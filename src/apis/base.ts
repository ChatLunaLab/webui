import { useLoginData, usePreferenceStore } from '@/stores'

import axios from 'axios'

const useAxios = () => {
  const { preference } = usePreferenceStore()
  return preference.baseURL
    ? axios.create({
        baseURL: preference.baseURL,
        adapter: 'fetch'
      })
    : axios
}

let instance: ReturnType<typeof useAxios>

let refreshTokenPromise: Promise<any> | null = null

export const apiServer = () => {
  const loginInfo = useLoginData()

  if (instance != null) {
    return instance
  }

  instance = useAxios()

  instance.interceptors.request.use((config) => {
    const accessToken = loginInfo.loginData.accessToken

    if (!accessToken || accessToken.length < 1) {
      return config
    }
    config.headers.Authorization = `Bearer ${loginInfo.loginData.accessToken}`
    return config
  })

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response?.code === 401) {
        if (refreshTokenPromise) {
          return refreshTokenPromise.then(() => {
            return instance(error.config)
          })
        }
        refreshTokenPromise = refreshToken()
        return refreshTokenPromise.then(() => {
          return instance(error.config)
        })
      }
      return Promise.reject(error)
    }
  )

  return instance
}

async function refreshToken() {
  const instance = apiServer()

  return await instance
    .get('/v1/refresh-token', {
      headers: {
        refresh_token: useLoginData().loginData.refreshToken
      }
    })
    .then((res) => {
      useLoginData().set({
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken
      })

      refreshTokenPromise = null
    })
}
