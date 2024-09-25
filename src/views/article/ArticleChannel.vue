<script setup>
import { ref, onMounted } from 'vue'
import { useArticleCategoryService, addArticleCategoryService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import { updateArticleCategoryByIdService, deleteArticleCategoryByIdService } from '@/api/article'

const form = ref(null) // 定义form用于接收模板引用
const direction = ref('rtl')
const showDrawer = ref(false)
const loading = ref(false)
const channelList = ref([])
const oprationType = ref('')

const getChannelList = async () => {
  // 发送请求前，将表格设为loading状态
  loading.value = true
  // 发送请求
  const res = await useArticleCategoryService()
  // 关闭loading状态
  loading.value = false
  // 处理请求结果
  channelList.value = res.data.data
}
onMounted(() => {
  getChannelList()
})

const formModel = ref({
  category_name: '',
  category_alias: ''
})
const onAddChannel = () => {
  oprationType.value = 'add'
  showDrawer.value = true
}
const onEditChannel = (row) => {
  formModel.value = {
    id: row.documentId,
    category_name: row.category_name,
    category_alias: row.category_alias
  }
  showDrawer.value = true
  oprationType.value = 'update'
}
const onDelChannel = async (row) => {
  // 显示loading
  loading.value = true
  // 发送删除请求
  await deleteArticleCategoryByIdService(row.documentId)
  // 关闭loading状态
  loading.value = false
  // 刷新列表
  getChannelList()
}
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
const updateCategory = async () => {
  await updateArticleCategoryByIdService(formModel.value.id, formModel.value)
}
const addCategory = async () => {
  await addArticleCategoryService(formModel.value)
}
const handleSubmit = async () => {
  // 显示加载中
  loading.value = true
  // 预校验
  await form.value.validate()
  // 判断是新增还是编辑操作
  if (oprationType.value === 'add') {
    await addCategory()
  } else if (oprationType.value === 'update') {
    await updateCategory()
  } else {
    console.error('未知操作类型')
    return
  }
  // 清空表单
  formModel.value = {
    cate_name: '',
    cate_alias: ''
  }
  // 关闭加载中
  loading.value = false
  // 关闭弹层
  showDrawer.value = false
  // 刷新列表
  getChannelList()
}

const handleCancel = () => {
  // 展示加载中效果
  loading.value = true
  // 清空表单
  formModel.value = {
    cate_name: '',
    cate_alias: ''
  }
  // 重置操作类型
  oprationType.value = ''
  // 关闭弹层
  showDrawer.value = false
  // 关闭加载中效果
  loading.value = false
}

const rules = {
  category_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  category_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel()">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="category_name"></el-table-column>
      <el-table-column label="分类别名" prop="category_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 定义弹层 -->
    <el-drawer v-model="showDrawer" :direction="direction" :before-close="handleClose">
      <template #header>
        <h4>当前分类项为：{{ formModel.cate_name || '新增分类' }}</h4>
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
            <el-form-item label="分类名称" prop="category_name">
              <el-input v-model="formModel.category_name" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="category_alias">
              <el-input v-model="formModel.category_alias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!-- 定义footer -->
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="handleSubmit()">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </page-container>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
