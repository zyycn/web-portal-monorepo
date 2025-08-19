import { createApp } from 'vue'

import './styles/index.scss'

import '@internal/tailwindcss-config'
import '@internal/tailwindcss-config/preflight'

import App from './App.vue'

createApp(App).mount('#app')
