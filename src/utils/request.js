import axios from 'axios'
import { useUserJwtStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// axios.create创建一个实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 根据打包命令动态使用
  timeout: 60000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 以下为jwt模式
    const useJwt = useUserJwtStore()
    if (useJwt.jwt) {
      config.headers.Authorization = 'Bearer ' + useJwt.jwt
    } else if (useJwt.sessionJwt) {
      config.headers.Authorization = 'Bearer ' + useJwt.sessionJwt
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 以下为jwt模式
    // 处理业务响应
    if (res.error) {
      // 业务失败给予提示
      ElMessage.error(res.error.message || '服务异常')
      return Promise.reject(res.error.message)
    }
    // 业务正常返回
    return res
  },
  (err) => {
    // 以下为jwt模式
    // 处理请求中的401无权限或jwt失效情况
    console.log(err.response)
    if (err.response.data && err.response.data.error.status === 401) {
      router.push('/login')
    }
    // 处理请求响应失败的默认情况
    ElMessage.error(err.response.data.error.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
