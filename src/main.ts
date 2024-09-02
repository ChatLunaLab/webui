import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import { useColorMode } from '@vueuse/core'
import hljs from 'highlight.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './assets/index.css'
import './assets/hijs.css'

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

// watch dark mode

watch(darkMode.state, (newValue) => {
  hljs.configure({
    classPrefix: newValue === 'dark' ? 'dark hljs-' : 'hljs-'
  })
}, { immediate: true })
