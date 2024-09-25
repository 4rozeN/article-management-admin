import request from '@/utils/request'

// 获取文章分类列表
export const useArticleCategoryService = () => {
  return request.get('/api/article-categories')
}

// id为documentId哦
export const useArticleCategoryByIdService = (id) => {
  return request.get(`/api/article-categories/${id}`)
}

// 接口要求传入用data包裹的含category_name和category_alias俩字段的对象
export const addArticleCategoryByIdService = (dataObj) => {
  return request.post('/api/article-categories', dataObj)
}

// id为documentId且为Path参数，dataObj为含有更新内容的对象
export const updateArticleCategoryByIdService = (id, dataObj) => {
  return request.put(`/api/article-categories/${id}`, {
    data: {
      category_name: dataObj.cate_name,
      category_alias: dataObj.cate_alias
    }
  })
}

// id为documentId且为Path参数
export const deleteArticleCategoryByIdService = (id) => {
  return request.delete(`/api/article-categories/${id}`)
}

//
