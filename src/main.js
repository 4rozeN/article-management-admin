import { createApp } from 'vue'
// 导入stores包下的index.js简化代码
import pinia from './stores'
import App from './App.vue'
import router from './router'
import '@/assets/main.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
