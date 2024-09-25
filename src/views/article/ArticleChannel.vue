<script setup>
import { ref } from 'vue'
import { useArticleCategoryService } from '@/api/article'
import { onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { updateArticleCategoryByIdService, deleteArticleCategoryByIdService } from '@/api/article'

// 定义form用于接收模板引用
const form = ref(null)
const direction = ref('rtl')
const showDrawer = ref(false)
const loading = ref(false)
const channelList = ref([])
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

const onEditChannel = (row) => {
  formModel.value = {
    id: row.documentId,
    cate_name: row.category_name,
    cate_alias: row.category_alias
  }
  showDrawer.value = true
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

const handleSubmit = async () => {
  // 显示加载中
  loading.value = true
  // 预校验
  await form.value.validate()
  // 获取表单数据
  console.log(formModel.value)
  // 发送请求
  await updateArticleCategoryByIdService(formModel.value.id, formModel.value)
  // 关闭加载中
  loading.value = false
  // 关闭弹层
  showDrawer.value = false
  // 刷新列表
  getChannelList()
}

const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
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
      <el-button type="primary">添加分类</el-button>
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
    <el-drawer v-model="showDrawer" :direction="direction">
      <template #header>
        <h4>编辑分类项：{{ formModel.cate_name }}</h4>
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
            <el-form-item label="分类名称" prop="cate_name">
              <el-input v-model="formModel.cate_name" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="cate_alias">
              <el-input v-model="formModel.cate_alias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <!-- 定义footer -->
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="showDrawer = false">取消</el-button>
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
