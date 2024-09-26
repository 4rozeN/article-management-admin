<script setup>
import { onMounted, ref } from 'vue'
import avatar from '@/assets/avatar.jpg'
import { userGetProfileService } from '@/api/user'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs' // 导入dayjs格式化日期
// 提供变量接收查询数据
const userInfo = ref({})
const avataraft = ref('')
// 获取用户信息
const getUserInfo = async () => {
  await userGetProfileService()
    .then((res) => {
      userInfo.value = res.data
    })
    .catch((err) => {
      console.log(err)
      ElMessage.error('服务异常，获取用户信息失败')
    })
  console.log(userInfo.value)
}
// 页面加载时获取用户信息
onMounted(async () => {
  await getUserInfo()
  // 拼接头像地址
  avataraft.value = import.meta.env.VITE_BASE_UPLOAD_URL + userInfo.value.avatar.url
})
// 计算入职时间
const getJoinTime = () => {
  // dayjs格式化时间
  const createdAt = dayjs(userInfo.value.createdAt).format('YYYY-MM-DD HH:mm:ss')
  // 获取年份
  const year = String(createdAt).slice(0, 4)
  // 获取当前年份
  const currentYear = new Date().getFullYear()
  // 计算距今年份的年数
  const joinYear = currentYear - Number(year)
  if (joinYear <= 3) {
    if (joinYear === 0) return '刚刚入职'
    return `入职${year}年`
  } else if (joinYear > 3) {
    return '资深员工'
  } else {
    return '未知'
  }
}
const joinTime = getJoinTime()
</script>

<template>
  <el-descriptions title="当前用户信息" border>
    <el-descriptions-item :rowspan="2" :width="140" label="用户头像" align="center">
      <el-image style="width: 100px; height: 100px" :src="avataraft || avatar" />
    </el-descriptions-item>
    <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
    <el-descriptions-item label="联系电话">{{ userInfo.telphone }}</el-descriptions-item>
    <el-descriptions-item label="邮箱地址">{{ userInfo.email }}</el-descriptions-item>
    <el-descriptions-item label="标签">
      <el-tag size="small">{{ userInfo.blocked ? '已封禁' : '账号正常' }}</el-tag>
      &nbsp;
      <el-tag size="small">{{ joinTime }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="系统操作须知">这里可以写一些系统操作须知</el-descriptions-item>
  </el-descriptions>
</template>

<style lang="scss" scoped></style>
