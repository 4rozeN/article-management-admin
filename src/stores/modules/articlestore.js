import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticleStore = defineStore(
  'article-draft',
  () => {
    const articleDraft = ref('')

    // 草稿不保存img等媒体文件
    const setArticleDraft = (draftObj) => {
      articleDraft.value = draftObj
    }

    const getArticleDraft = () => {
      return articleDraft.value
    }

    const clearArticleDraft = () => {
      articleDraft.value = ''
    }

    return {
      articleDraft,
      setArticleDraft,
      getArticleDraft,
      clearArticleDraft
    }
  },
  {
    persist: true
  }
)
