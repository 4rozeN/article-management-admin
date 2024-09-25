import request from '@/utils/request'

// 只支持单个文件上传
export const useUploadService = (file) => {
  // 文件对象上传
  const formData = new FormData()
  formData.append('files', file)
  return request.post('/api/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
