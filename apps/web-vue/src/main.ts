import { nprogress } from '@packages/plugins'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './styles/index.scss'
import './styles/tailwindcss.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(nprogress, router)

app.mount('#app')
