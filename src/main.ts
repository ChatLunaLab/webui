import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useColorMode } from '@vueuse/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './assets/index.css'

import App from './App.vue'
import router from './router'

const darkMode = useColorMode({})

// add color-scheme to html tag
document.documentElement.style.setProperty('color-scheme', darkMode.state.value)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
