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
export const addArticleCategoryService = (dataObj) => {
  return request.post('/api/article-categories', {
    data: {
      category_name: dataObj.category_name,
      category_alias: dataObj.category_alias
    }
  })
}

// id为documentId且为Path参数，dataObj为含有更新内容的对象
export const updateArticleCategoryByIdService = (id, dataObj) => {
  return request.put(`/api/article-categories/${id}`, {
    data: {
      category_name: dataObj.category_name,
      category_alias: dataObj.category_alias
    }
  })
}

// id为documentId且为Path参数
export const deleteArticleCategoryByIdService = (id) => {
  return request.delete(`/api/article-categories/${id}`)
}

// 获取某文章详情
export const useArticleByIdService = (id) => {
  return request.get(
    `/api/articles/${id}?fields=documentId,title,content,state,createdAt,updatedAt,publishedAt&populate[cover_img][fields]=documentId,name,alternativeText,caption,width,height,ext,mime,url,createdAt,updatedAt&populate[article_category][fields]=documentId,category_name,category_alias,createdAt,updatedAt`
  )
}

// 优化后的分页和条件查询函数，支持分页、条件、模糊查询
export const useArticleService = (page, limit, conditionObj = {}, keyword = '') => {
  let query = `/api/articles?pagination[page]=${page}&pagination[pageSize]=${limit}`

  // 模糊查询：如果有 keyword，则添加模糊查询条件
  if (keyword) {
    query += `&filters[title][$contains]=${keyword}`
  }

  // 条件查询：如果传入了 conditionObj，解析其中的 id 和 state
  if (conditionObj) {
    const { id, state } = conditionObj

    // 动态拼接 id 条件
    if (typeof id === 'number') {
      query += `&filters[article_category][id][$eq]=${id}`
    }

    // 动态拼接 state 条件
    if (state === 'true' || state === 'false') {
      query += `&filters[state][$eq]=${state}`
    }
  }

  // 加入 fields 和 populate 参数，获取所需字段及关联数据
  query += `&fields=documentId,title,content,state,createdAt,updatedAt,publishedAt`
  query += `&populate[cover_img][fields]=documentId,name,alternativeText,caption,width,height,ext,mime,url,createdAt,updatedAt`
  query += `&populate[article_category][fields]=documentId,category_name,category_alias,createdAt,updatedAt`
  // 加入 sort 参数，按更新时间进行排序
  query += `&sort=updatedAt:desc`

  // 发起请求
  return request.get(query)
}

// 创建新文章
export const addArticleService = (dataObj) => {
  const {
    title, // 只提取 title 字段
    content, // 只提取 content 字段
    cover_img, // 只提取 cover_img 字段
    state, // 只提取 state 字段
    article_category // 只提取 article_category 字段
  } = dataObj // 从 dataObj 中解构出所需字段

  const data = {
    title, // 将解构后的字段重新赋值给 data 对象
    content,
    cover_img,
    state,
    article_category
  }

  return request.post('/api/articles', {
    data: data
  })
}

// 更新某文章,id为documentId且为Path参数，dataObj为含有更新内容的对象
export const updateArticleByIdService = (id, dataObj) => {
  const data = {
    title: dataObj.title,
    content: dataObj.content,
    cover_img: dataObj.cover_img,
    state: dataObj.state,
    article_category: dataObj.article_category
  }

  return request.put(`/api/articles/${id}`, {
    data: data
  })
}

// 删除某文章
export const deleteArticleByIdService = (id) => {
  return request.delete(`/api/articles/${id}`)
}
