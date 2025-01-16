import axios from 'axios'

import { usePreferenceStore } from '@/stores/preference'
import type { ChatLunaConversation } from '@/lib/types'

const { preference } = usePreferenceStore()

// create an axios instance
const service = axios.create({
  baseURL: preference.baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

/* interceptors.request.use(
  config => {
   // 在发送请求之前做些什么
    console.log('在发送请求之前触发')//示例代码
   return config;
 }, function (error) {
   // 对请求错误做些什么
   return Promise.reject(error);
}); */

export async function getConversationList(): Promise<ChatLunaConversation[]> {
  return service.get('/conversations').then(res => res.data)
}
