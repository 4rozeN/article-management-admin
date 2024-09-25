<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useArticleService, useArticleCategoryService } from '@/api/article'
import dayjs from 'dayjs' // 导入dayjs格式化日期

const articleList = ref([])
const articleCategoryList = ref([])

const getArticleList = async () => {
  const res = await useArticleService()
  articleList.value = res.data.data
  // 格式化日期
  articleList.value.forEach((item) => {
    item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
  })
  // 处理state显示，true为已发布；false为草稿
  articleList.value.forEach((item) => {
    item.state = item.state ? '已发布' : '草稿'
  })
}
const getArticleCategoryList = async () => {
  const res = await useArticleCategoryService()
  articleCategoryList.value = res.data.data
  console.log('getArticleCategoryList', articleCategoryList.value)
}
onMounted(async () => {
  await getArticleList()
  await getArticleCategoryList()
})

const categoryRow = ref('')
const stateRow = ref('')
const onEditArticle = (row) => {
  console.log(row)
}
const onDeleteArticle = (row) => {
  console.log(row)
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary">发布文章</el-button>
    </template>
    <!-- 定义表头操作项 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select
          v-model="categoryRow"
          placeholder="请选择分类"
          size="default"
          style="width: 200px"
        >
          <el-option
            v-for="item in articleCategoryList"
            :key="item.id"
            :label="item.category_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select
          v-model="stateRow"
          placeholder="请选择文章状态"
          size="default"
          style="width: 200px"
        >
          <el-option label="已发布" value="true"></el-option>
          <el-option label="草稿" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 定义主体表格内容 -->
    <el-table :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="article_category.category_name"></el-table-column>
      <el-table-column label="发表时间" prop="createdAt"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>
</template>

<style lang="scss" scoped></style>
