import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(persist)
export default pinia

// 将modules文件夹下的所有被暴露的属性或函数，暴露出去
export * from './modules/user'
export * from './modules/counter'
