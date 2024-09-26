<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleByIdService } from '@/api/article'
import { ElMessage } from 'element-plus'

const router = useRoute()
// 从地址栏参数获得文章id
const articleId = router.params.id
// 定义文章标题和内容变量
const articleTitle = ref('')
const articleContent = ref('')

onMounted(async () => {
  await fetchArticle()
})

// 异步请求文章内容详情
const fetchArticle = async () => {
  await useArticleByIdService(articleId)
    .then((res) => {
      // console.log(res)
      articleTitle.value = res.data.data.title
      articleContent.value = res.data.data.content
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('获取文章内容失败')
    })
}
</script>

<template>
  <page-container :title="articleTitle">
    <div
      class="article-content"
      v-html="articleContent"
      style="border-radius: 3px solid #ccc; padding: 10px"
    ></div>
  </page-container>
</template>
