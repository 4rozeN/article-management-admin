import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserJwtStore = defineStore(
  'admin-userJwt',
  () => {
    const jwt = ref('')
    const sessionJwt = ref('')

    // 设置jwt到 Pinia 和 localStorage 中
    const setJwt = (newJwt) => {
      jwt.value = newJwt
    }

    // 设置jwt到 sessionStorage 中
    const setSessionJwt = (newJwt) => {
      sessionJwt.value = newJwt
      sessionStorage.setItem('session-jwt', newJwt)
    }

    const removeJwt = () => {
      jwt.value = ''
      sessionJwt.value = ''
      sessionStorage.removeItem('session-jwt')
    }

    // 在页面加载时尝试从 localStorage 和 sessionStorage 中恢复 JWT 和 sessionJwt
    const loadJwt = () => {
      const sessionJwtStored = sessionStorage.getItem('session-jwt')
      if (sessionJwtStored) {
        sessionJwt.value = sessionJwtStored
      } else {
        const localJwt = localStorage.getItem('admin-userJwt')
        if (localJwt) {
          jwt.value = localJwt
        }
      }
    }

    // 在应用启动时自动加载 JWT 和 sessionJwt
    loadJwt()

    return {
      jwt,
      sessionJwt,
      setJwt,
      setSessionJwt,
      removeJwt
    }
  },
  {
    persist: {
      omit: ['sessionJwt']
    }
  }
)
