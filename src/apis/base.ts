import { usePreferenceStore } from '@/stores'
import axios from 'axios'


export const useAxios = () => {
  const { preference } = usePreferenceStore()
  return preference.baseURL ? axios.create({
    baseURL: preference.baseURL,
    adapter: 'fetch'
  }) : axios
}
