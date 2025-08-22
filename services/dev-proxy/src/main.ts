import { createApp } from 'vue'

import '@/styles/index.scss'
import '@internal/tailwindcss-config'

import App from './App.vue'

const app = createApp(App)

app.mount('#app')
