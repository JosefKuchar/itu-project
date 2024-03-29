/**
 * Frontend entry point
 *
 * @author Josef Kuchař (xkucha28)
 */

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstore from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstore)
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
