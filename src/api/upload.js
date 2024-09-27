import request from '@/utils/request'

// 只支持单个文件上传
export const useUploadService = async (file, fileName) => {
  const formData = new FormData()

  if (fileName) {
    // 确保完整的 base64 字符串
    formData.append('files', file) // file 应该是完整的 base64 字符串
  } else {
    console.log('files:', formData.get('files'))
    formData.append('files', file) // file 应该是 File 对象
  }

  // 不手动设置 Content-Type，让浏览器自动处理
  return request.post('/api/upload/', formData, {
    headers: {
      // 不需要设置 Content-Type
    }
  })
}
