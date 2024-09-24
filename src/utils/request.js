import axios from 'axios'
import { useUserJwtStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

// const baseURL = 'http://big-event-vue-api-t.itheima.net'
const baseURL = 'http://localhost:1337'

// axios.create创建一个实例
const instance = axios.create({
  baseURL,
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

    // 以下为token模式
    // const useToken = useUserStore()
    // if (useToken.token) {
    //   config.headers.Authorization = useToken.token
    // }
    // return config
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

    // 以下为token模式
    // // 处理业务响应
    // if (res.data.code === 0) {
    //   return res
    // }
    // // 业务失败给予提示
    // ElMessage.error(res.data.message || '服务异常')
    // return Promise.reject(res.data)
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

    // 以下为token模式
    // // 处理请求中401无权限或token失效情况
    // if (err.response && err.response.status === 401) {
    //   router.push('/login')
    // }
    // // 处理请求响应失败的默认情况
    // ElMessage.error(err.response.data.message || '服务异常')
    // return Promise.reject(err)
  }
)

export default instance
