import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useColorMode } from '@vueuse/core'

import './assets/index.css'

import App from './App.vue'
import router from './router'

const darkMode = useColorMode({})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
