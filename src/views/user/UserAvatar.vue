<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import avatar from '@/assets/avatar.jpg'
import { useUploadService } from '@/api/upload'
import { userGetProfileService, userProfileUpdateService } from '@/api/user'

// 默认的头像图片URL
const defaultAvatar = avatar
// 预览头像
const preImgUrl = ref('')
// 需要上传的图片
const imgNeedUpload = ref(null)
// 选择的文件名
const fileName = ref('')

// 上传前的验证，限制图片格式和大小
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isJPG) {
    ElMessage.error('上传的头像图片只能是 JPG 或 PNG 格式！')
  }
  if (!isLt2M) {
    ElMessage.error('上传的头像图片大小不能超过 2MB！')
  }
  return isJPG && isLt2M
}
// 更换图片时触发的事件
const onSelectFIle = (file) => {
  // 先清空之前的预览图片
  if (preImgUrl.value) {
    URL.revokeObjectURL(preImgUrl.value)
  }
  console.log('选择了文件：', file)
  // 生成本地预览图片
  preImgUrl.value = URL.createObjectURL(file.raw)
  // 得到文件名
  fileName.value = file.name
  // 将文件对象赋值给imgNeedUpload
  imgNeedUpload.value = file.raw
}

const imgId = ref('')
const userInfo = ref({})
// 上传头像
const uploadAvatar = async () => {
  if (!imgNeedUpload.value) {
    ElMessage.error('请先选择需要上传的图片！')
  }
  // 上传头像
  await useUploadService(imgNeedUpload.value)
    .then((res) => {
      ElMessage.success('头像上传成功！')
      userAvatarUpdate(res)
    })
    .catch((err) => {
      ElMessage.error('头像上传失败！error: ', err)
    })
}
// 提供方法更新用户头像
const userAvatarUpdate = async (res) => {
  // 获取上传成功后返回的图片id非documentId
  imgId.value = res.data[0].id
  console.log('上传成功的图片id：', res.data[0].id)
  // 将得到的id更新到用户的头像字段中
  userInfo.value = await userGetProfileService()
  console.log('用户信息：', userInfo.value)
  let dataObj = {
    avatar: imgId.value
  }
  console.log('用户信息：', userInfo.value.data.id)
  await userProfileUpdateService(userInfo.value.data.id, dataObj)
    .then(() => {
      ElMessage.success('头像更新成功！')
      // 刷新页面
      location.reload()
    })
    .catch((err) => {
      ElMessage.error('头像更新失败！error: ', err)
    })
}
</script>

<template>
  <div class="avatar-page">
    <div class="left-section">
      <h2>更换头像</h2>
      <!-- 上传文件 -->
      <div class="avatar-upload-wrapper" style="height: 300px; width: auto">
        <el-upload
          class="avatar-uploader"
          :on-change="onSelectFIle"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="preImgUrl" :src="preImgUrl" class="avatar" />
          <img v-else :src="defaultAvatar" class="avatar" /> </el-upload
        ><br />
        <el-button type="primary" size="large" @click="uploadAvatar">确认上传</el-button>
      </div>
    </div>

    <!-- 右侧显示头像的三种尺寸 -->
    <div class="right-section">
      <h3>头像预览</h3>
      <div class="preview-sizes">
        <!-- 大尺寸头像 -->
        <div class="preview-item">
          <p>大尺寸 (150x150)</p>
          <img :src="preImgUrl || defaultAvatar" alt="Large Avatar" class="avatar-large" />
        </div>
        <!-- 中等尺寸头像 -->
        <div class="preview-item">
          <p>中尺寸 (100x100)</p>
          <img :src="preImgUrl || defaultAvatar" alt="Medium Avatar" class="avatar-medium" />
        </div>
        <!-- 小尺寸头像 -->
        <div class="preview-item">
          <p>小尺寸 (50x50)</p>
          <img :src="preImgUrl || defaultAvatar" alt="Small Avatar" class="avatar-small" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-page {
  display: flex;
  height: 90%;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: #fcfcfcff;
}

.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  margin-bottom: 20px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 头像预览 */
.preview-sizes {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-item {
  text-align: center;
}

.avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-medium {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
