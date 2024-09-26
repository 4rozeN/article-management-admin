<script setup>
import richEditor from '@/components/richEditor.vue'
import { Delete, Edit, Plus, Link, Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { useUploadService } from '@/api/upload'
import {
  useArticleService, // 新接口
  useArticleCategoryService,
  updateArticleByIdService,
  deleteArticleByIdService,
  addArticleService
} from '@/api/article'
import dayjs from 'dayjs' // 导入dayjs格式化日期
import { useArticleStore } from '@/stores'
import { useRouter } from 'vue-router'

const useStore = useArticleStore()
const baseUploadUrl = import.meta.env.VITE_BASE_UPLOAD_URL
const formModel = ref({
  id: '',
  title: '',
  content: '',
  cover_img: '',
  state: false,
  article_category: 3 // 接收分类的id，该id非documentId而是真实id，用于接口提交
})
const oprationType = ref('')
const showDrawer = ref(false)
const direction = ref('rtl')
const loading = ref(false)
const form = ref(null) // 定义form用于接收模板引用进行表单提交预校验
const disabled = ref(false) // 定义disabled用于控制分页禁用状态
const currentPage = ref(1) // 定义当前页数
const pageSize = ref(10) // 定义每页显示的数量
const pageCount = ref(30) // 定义总页数
const totalCount = ref(30) // 定义总数据条目数
const articleList = ref([])
const articleCategoryList = ref([])
const router = useRouter()

// 提供方法重置表单
const resetFormModel = () => {
  // 直接重置 formModel 的内容
  formModel.value = {
    title: '',
    content: '',
    cover_img: '',
    state: false,
    article_category: null
  }
}

// 将格式化代码抽离，封装为格式化函数供调用
const formatArticleList = (articles) => {
  return articles.map((item) => {
    return {
      ...item,
      // 格式化日期
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      state: item.state ? '已发布' : '草稿', // 处理 state
      // 更新封面图片
      cover_img: item.cover_img ? baseUploadUrl + item.cover_img.url : ''
    }
  })
}

// 获取文章列表，支持分页、条件查询和模糊查询
const getArticleList = async (page, pageSize, conditionObj = {}, keyword = '') => {
  const res = await useArticleService(page, pageSize, conditionObj, keyword) // 使用新接口
  // console.log('查询结果:', res)

  currentPage.value = res.data.meta.pagination.page
  pageCount.value = res.data.meta.pagination.pageCount
  totalCount.value = res.data.meta.pagination.total
  articleList.value = res.data.data

  // 格式化文章列表
  articleList.value = formatArticleList(res.data.data)
  // console.log('格式化后的文章列表:', articleList.value)
}

// 获取分类列表
const getArticleCategoryList = async () => {
  const res = await useArticleCategoryService()
  articleCategoryList.value = res.data.data
  // console.log('getArticleCategoryList', articleCategoryList.value)
}
onMounted(async () => {
  await getArticleList(1, 10)
  await getArticleCategoryList()
})

// 页面展示数据数量变化响应函数
const handleSizeChange = async (size) => {
  pageSize.value = size
  await getArticleList(currentPage.value, size, currentCondition.value) // 使用当前条件
}

// 当前页码变化响应函数
const handleCurrentChange = async (page) => {
  currentPage.value = page
  await getArticleList(page, pageSize.value, currentCondition.value) // 使用当前条件
}

// 条件查询的返回项
const categoryRow = ref('')
const stateRow = ref('')
// 当前的查询条件
const currentCondition = ref({
  id: null,
  state: null
})

// 条件查询的响应事件
const handleQuery = async () => {
  const conditionObj = {
    id: categoryRow.value || null, // 分类ID
    state: stateRow.value || null // 文章状态
  }

  currentCondition.value = conditionObj // 保存当前条件

  loading.value = true
  await getArticleList(currentPage.value, pageSize.value, conditionObj)
    .then(() => {
      loading.value = false
    })
    .catch((err) => {
      ElMessage.error('查询失败：' + err)
    })
}

// 条件查询重置按钮的响应事件
const handleReset = async () => {
  categoryRow.value = ''
  stateRow.value = ''
  currentCondition.value = { id: null, state: null } // 重置条件
  await getArticleList(currentPage.value, pageSize.value) // 重新拉取文章列表
  ElNotification({
    title: 'Success',
    message: '重置成功',
    type: 'success',
    position: 'bottom-left'
  })
}

// 定义模糊查询的输入框
const inputQuery = ref('')
// 模糊搜索的响应事件
const handleQueryByTitle = async () => {
  // 对输入的内容进行正则校验，是否存在非法字符
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/
  if (!reg.test(inputQuery.value)) {
    ElMessage.error('搜索内容为空或包含非法字符，请重新输入！')
    return
  }
  // 调用接口查询
  await getArticleList(1, 10, {}, inputQuery.value)
    .then(() => {
      // 查询成功
      ElNotification({
        title: 'Success',
        message: '搜索成功',
        type: 'success',
        position: 'bottom-left'
      })
    })
    .catch((err) => {
      ElMessage.error('查询失败：' + err)
    })
}

// 编辑文章的响应事件
const onEditArticle = (row) => {
  // console.log('row', row)
  // 设置操作类型
  oprationType.value = 'edit'
  // 将文章数据渲染到表格上
  formModel.value = {
    id: row.documentId,
    title: row.title,
    content: row.content,
    state: row.state,
    article_category: row.article_category.id // 该id非documentId而是真实id
  }
  if (row.cover_img) {
    // console.log('row.cover_img：', row.cover_img)
    formModel.value.cover_img = row.cover_img
    // 设置预览图
    preImgUrl.value = row.cover_img
  } else {
    // 没有封面图，清空预览图
    preImgUrl.value = ''
  }
  // 打开弹层
  showDrawer.value = true
  // console.log('弹层被触发，表单内容为：', formModel.value)
}
// 删除文章的响应事件
const onDeleteArticle = (row) => {
  // console.log(row)
  deleteArticleByIdService(row.documentId)
  ElMessageBox.confirm('确定要删除该文章吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  // 重新拉取文章列表
  getArticleList(currentPage.value, pageSize.value)
}
// 表单校验
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 20, message: '文章标题长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 1, max: 5000, message: '文章内容长度在 1 到 5000 个字符', trigger: 'blur' }
  ],
  cover_img: [{ required: true, message: '请上传文章封面图', trigger: 'blur' }],
  state: [{ required: true, message: '请选择文章状态', trigger: 'change' }],
  article_category: [{ required: true, message: '请选择文章分类', trigger: 'blur' }]
}
// 处理弹层关闭事件
const handleClose = () => {
  ElMessageBox.confirm('您确定要关闭此弹层吗？未保存的修改可能丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      handleCancel()
    })
    .catch(() => {
      ElMessage.info('操作取消')
    })
}
// 处理弹层取消事件
const handleCancel = () => {
  // 清空表单
  resetFormModel()
  // 重置操作类型
  oprationType.value = ''
  // 清空预览
  URL.revokeObjectURL(preImgUrl.value) // 清理 URL
  preImgUrl.value = '' // 清除预览 URL
  // 关闭弹层
  showDrawer.value = false
}

// 预览图片的URL
const preImgUrl = ref('')
const beforeImgUpload = (rawFile) => {
  // 定义一个可以上传的图片类型数组，进行白名单筛选
  const allowTypes = ['image/jpeg', 'image/png']
  // 进行类型和大小校验
  if (rawFile.type !== '' && !allowTypes.includes(rawFile.type)) {
    ElMessageBox.confirm('您上传的图片格式不正确！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  // 返回false，阻止文件上传
  return false
}
// 选择文件后触发的事件
const onSelectFIle = (file) => {
  // console.log('选择了文件：', file)
  // 生成本地预览 URL
  preImgUrl.value = URL.createObjectURL(file.raw)
  // 存入表单
  formModel.value.cover_img = file.raw
}

// 移除文件后触发的事件
const handleRemove = () => {
  URL.revokeObjectURL(preImgUrl.value) // 清理 URL
  preImgUrl.value = '' // 清除预览 URL
}

// 新增文章的响应事件
const onAddArticle = () => {
  // 设置操作类型
  oprationType.value = 'add'
  // 直接先重置一遍 formModel 的内容
  resetFormModel()
  // console.log('新增文章弹层被触发，表单内容为：', formModel.value)
  // 查询store是否有草稿存在
  const draft = useStore.getArticleDraft()
  // 如果draft为空
  if (draft) {
    // 存在草稿，将草稿内容渲染到表单上
    formModel.value = {
      title: draft.title,
      content: draft.content,
      cover_img: draft.cover_img,
      state: false,
      article_category: draft.article_category // 该id非documentId而是真实id
    }
  } else {
    // 没有草稿直接重置表单
    resetFormModel()
    // 设置预览图
    preImgUrl.value = ''
  }
  // 打开弹层
  showDrawer.value = true
}

// 走提交的响应事件
const handleSubmit = async () => {
  // 展示加载中效果
  loading.value = true
  // 表单校验
  await form.value.validate()
  // 打印表单数据
  // console.log('表单数据：', formModel.value)
  // 判断是否有封面图
  if (preImgUrl.value) {
    // 判断是否是url地址，如果是，则说明没有被更改过，直接提交无需上传
    if (!preImgUrl.value.startsWith('http')) {
      // console.log('提交-当前封面被更换为本地图片')
      // 上传封面图
      const uploadRes = await useUploadService(formModel.value.cover_img)
      // 将上传后的图片id赋值给formModel.value.cover_img
      // console.log('上传后的图片：', uploadRes)
      formModel.value.cover_img = uploadRes.data[0].id
    } else {
      // console.log('没有更改封面图')
      // 说明没有被更改过，将表单中的cover_img删除掉
      delete formModel.value.cover_img
    }
  }

  // 走发布，state为true
  formModel.value.state = true
  // 判断操作类型
  if (oprationType.value === 'add') {
    // 新增文章
    // console.log('提交表单数据：', formModel.value)
    await addArticleService(formModel.value)
    ElMessage.success('文章发布成功！')
  } else if (oprationType.value === 'edit') {
    // console.log('提交表单数据：', formModel.value)
    await updateArticleByIdService(formModel.value.id, formModel.value)
    ElMessage.success('文章修改成功！')
  } else {
    // 其他操作类型
    ElMessage.error('当前操作异常！')
  }
  // 关闭弹层
  handleCancel()
  // 重置表单
  resetFormModel()
  // 重置操作类型
  oprationType.value = ''
  // 关闭加载中效果
  loading.value = false
  // 重新拉取文章列表
  await getArticleList(currentPage.value, pageSize.value)
  // 给予提示
  ElNotification({
    title: 'Success',
    message: '文章列表更新成功！',
    type: 'success',
    position: 'bottom-left'
  })
}
// 走保存草稿的响应事件
const handleSaveDraft = () => {
  // 获取表单数据
  useStore.setArticleDraft(formModel.value)
  // 关闭弹层
  handleCancel()
  // 给予提示
  ElNotification({
    title: 'Success',
    message: '文章已保存为草稿！',
    type: 'info',
    position: 'bottom-left'
  })
}
// 清除草稿的响应事件
const handleClearDraft = () => {
  // 展示加载中效果
  loading.value = true
  // 调用store中的方法清除草稿
  useStore.clearArticleDraft()
  // 关闭弹层
  handleCancel()
  // 关闭加载中效果
  loading.value = false
  // 给予提示
  ElNotification({
    title: 'Success',
    message: '草稿已清除！',
    type: 'info',
    position: 'bottom-left'
  })
}

// 提供方法，用于点击文章标题时，跳转到预览页面
const onClickTitle = (row) => {
  // console.log('点击标题：', row)
  // 跳转到预览页面
  router.push({ name: 'ArticlePreview', params: { id: row.documentId } })
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle()">发布文章</el-button>
    </template>
    <!-- 定义表头操作项 -->
    <el-form
      inline
      style="display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: center"
    >
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
        <el-button type="primary" @click="handleQuery()">查询</el-button>
        <el-button @click="handleReset()">重置</el-button>
      </el-form-item>
      <el-form-item label="搜索文章：" style="margin-left: auto; margin-right: 0%">
        <el-input
          v-model="inputQuery"
          @keyup.enter="handleQueryByTitle()"
          maxlength="10"
          show-word-limit
          type="text"
          style="width: 240px"
          placeholder="按标题搜文章"
          :prefix-icon="Search"
        />
      </el-form-item>
    </el-form>
    <!-- 定义主体表格内容 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="350" :show-overflow-tooltip="true">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="onClickTitle(row)"
            ><el-icon> <Link /> </el-icon>{{ row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="封面">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <!-- scope.row.cover_img.url 是文章中的封面图片 URL -->
            <el-image
              v-if="scope.row.cover_img"
              :src="`${scope.row.cover_img}`"
              :preview-src-list="[`${scope.row.cover_img}`]"
              style="width: auto; height: 30px; cursor: pointer"
              fit="cover"
              @click.stop
              :preview-teleported="true"
              :lazy="true"
            >
              <template #error>
                <div
                  style="
                    width: 100px;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <span>加载失败</span>
                </div>
              </template>
            </el-image>
            <div
              v-else
              style="
                width: auto;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span>暂无图片</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="article_category.category_name"></el-table-column>
      <el-table-column label="发表时间" prop="createdAt"></el-table-column>
      <el-table-column label="更新时间" prop="updatedAt"></el-table-column>
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
    <!-- 分页组件 -->
    <div class="pagination" style="display: flex; justify-content: center; margin-top: 20px">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20]"
        :size="'default'"
        :disabled="disabled"
        :background="true"
        layout="sizes, prev, pager, next"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 回到顶部组件 -->
    <div class="back-to-top">
      <el-backtop :visibility-height="100" :right="100" :bottom="100" />
    </div>
    <!-- 定义弹层 -->
    <el-drawer
      v-model="showDrawer"
      :direction="direction"
      :lock-scroll="true"
      :before-close="handleClose"
      :size="'50%'"
    >
      <template #header>
        <h4>当前操作为：{{ formModel.title ? '编辑或预览文章' : '新增文章' }}</h4>
      </template>
      <template #default>
        <!-- 定义内容 -->
        <div class="content">
          <el-form
            ref="form"
            :model="formModel"
            :rules="rules"
            label-width="100px"
            style="padding-right: 30px"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="formModel.title" minlength="1" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="article_category">
              <el-select
                v-model="formModel.article_category"
                placeholder="请选择文章分类"
                size="default"
                style="width: 100%"
              >
                <el-option
                  v-for="item in articleCategoryList"
                  :key="item.id"
                  :label="item.category_name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章封面图" prop="cover_img">
              <el-upload
                class="cover-img-uploader"
                :auto-upload="false"
                :before-upload="beforeImgUpload"
                :on-remove="handleRemove"
                :on-change="onSelectFIle"
              >
                <img v-if="preImgUrl" :src="preImgUrl" class="cover-img" />
                <el-icon v-else class="cover-img-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <div class="editor">
                <richEditor v-model="formModel.content"></richEditor>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!-- 定义footer -->
      <template #footer>
        <div style="flex: auto">
          <el-button v-if="oprationType === 'add'" type="danger" @click="handleClearDraft()"
            >清除草稿</el-button
          >
          <el-button v-if="oprationType === 'add'" type="info" @click="handleSaveDraft()"
            >保存草稿</el-button
          >
          <el-button type="primary" @click="handleSubmit()">发布文章</el-button>
        </div>
      </template>
    </el-drawer>
  </page-container>
</template>

<style lang="scss" scoped>
.cover-img-uploader {
  :deep() {
    .cover-img {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: #409eff;
    }

    .el-icon.cover-img-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  height: 200px;
}
</style>
