import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'
// const baseURL = 'http://localhost:1337'

// axios.create创建一个实例
const instance = axios.create({
  baseURL,
  timeout: 60000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const useToken = useUserStore()
    if (useToken.token) {
      config.headers.Authorization = useToken.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 处理业务响应
    if (res.data.code === 0) {
      return res
    }
    // 业务失败给予提示
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理请求中401无权限或token失效情况
    if (err.response && err.response.status === 401) {
      router.push('/login')
    }
    // 处理请求响应失败的默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
