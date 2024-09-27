<script setup>
import { ref, watch } from 'vue'
import avatar from '@/assets/avatar.jpg'
import { useUploadService } from '@/api/upload'
import { userGetProfileService, userProfileUpdateService } from '@/api/user'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const props = defineProps({
  // 上传的文件以何种方式流向服务器：base64 或 blob
  uploadFileType: {
    type: String,
    default: Blob
  },
  // 预览图的宽度
  previewWidth: {
    type: Number,
    default: 200
  },
  // 预览图的比例
  previewScale: {
    type: Array,
    default: () => [1, 1]
  },
  // 允许上传的文件类型list
  allowTypeList: {
    type: Array,
    default: () => ['image/jpeg', 'image/png']
  },
  // 限制上传图片的大小
  limitSize: {
    type: Number,
    default: 2
  },
  // 设定裁剪框的比例
  fixedNumber: {
    type: Array,
    default: () => [1, 1]
  }
})

// 默认的无头像时显示的图片
const defaultAvatar = avatar
// 选择的头像原图URL
const originImgUrl = ref('')
// 确认裁剪后，保存的需要上传的图片
const imgNeedUpload = ref(null)
// 选择的文件名
const noCropper = ref(true)
// 更换图片的验证，限制图片格式和大小
const beforeAvatarUpload = (file) => {
  // console.log('选择的文件：', file)
  // 确保允许的文件类型中有 file.type
  const isJPG = props.allowTypeList.some((type) => file.type.includes(type))
  const isLtXM = file.size / 1024 / 1024 < props.limitSize

  if (!isJPG) {
    ElMessage.error('上传的头像图片只能是 JPG 或 PNG 格式！')
    return false // 提示格式错误，返回 false
  }

  if (!isLtXM) {
    ElMessage.error(`上传的头像图片大小不能超过 ${props.limitSize}MB！`)
    return false // 提示大小错误，返回 false
  }

  return true // 类型和大小都符合，返回 true
}

// 更换图片时触发的事件
const onSelectFIle = (file) => {
  // 先清空之前的预览图片
  if (originImgUrl.value) {
    URL.revokeObjectURL(originImgUrl.value)
  }
  console.log('文件更换：', file)
  noCropper.value = true // 重置状态
  // 校验图片
  if (!beforeAvatarUpload(file.raw)) {
    return
  }
  // 生成本地预览图片
  originImgUrl.value = URL.createObjectURL(file.raw)
  imgNeedUpload.value = file.raw
  // console.log('生成原图图片：', originImgUrl.value)
}

// 定义变量拿到用户信息
const imgId = ref('')
const userInfo = ref({})
// 上传头像
const uploadAvatar = async () => {
  if (noCropper.value) {
    ElMessageBox.confirm('您确定不需要裁剪图片直接上传吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        // 上传头像
        await useUploadService(imgNeedUpload.value)
          .then(async (res) => {
            await userAvatarUpdate(res)
            ElMessage.success('头像上传成功！')
          })
          .catch((err) => {
            ElMessage.error('头像上传失败！error: ', err)
          })
      })
      .catch(() => {
        // 放弃上传
        return
      })
  }

  if (!imgNeedUpload.value) {
    ElMessage.error('请先选择需要上传的图片！')
  }

  if (props.uploadFileType.toLocaleLowerCase() === 'base64') {
    // 校验Base64
    validateBase64(imgNeedUpload.value)
    // 上传头像
    await useUploadService(imgNeedUpload.value, 'base64fileImg')
      .then(async (res) => {
        await userAvatarUpdate(res)
        ElMessage.success('头像上传成功！')
      })
      .catch((err) => {
        ElMessage.error('头像上传失败！error: ', err)
      })
  } else if (props.uploadFileType.toLocaleLowerCase() === 'blob') {
    validateBlob(imgNeedUpload.value)
    // 上传头像
    await useUploadService(imgNeedUpload.value)
      .then(async (res) => {
        await userAvatarUpdate(res)
        ElMessage.success('头像上传成功！')
      })
      .catch((err) => {
        ElMessage.error('头像上传失败！error: ', err)
      })
  } else {
    ElMessage.error('上传裁剪文件出错！请检查裁剪结果类型！')
    return
  }
  // 清空图片
  imgNeedUpload.value = null
  croppingImgUrl.value = null
  originImgUrl.value = null
  // 先清空之前的预览图片
  if (originImgUrl.value) {
    URL.revokeObjectURL(originImgUrl.value)
  }
}
// 提供方法在头像上传后更新用户头像
const userAvatarUpdate = async (res) => {
  // 获取上传成功后返回的图片id非documentId
  imgId.value = res.data[0].id
  // console.log('上传成功的图片id：', res.data[0].id)
  // 将得到的id更新到用户的头像字段中
  userInfo.value = await userGetProfileService()
  // console.log('用户信息：', userInfo.value)
  let dataObj = {
    avatar: imgId.value
  }
  // console.log('用户信息：', userInfo.value.data.id)
  await userProfileUpdateService(userInfo.value.data.id, dataObj)
    .then(() => {
      ElMessage.success('头像更新成功！请刷新页面查看')
    })
    .catch((err) => {
      ElMessage.error('头像更新失败！error: ', err)
    })
}

// 提供方法提示裁剪器加载状态
const imgLoad = (e) => {
  // console.log('裁剪器加载图片完毕：', e)
  if (e === 'success') {
    ElNotification({
      title: '裁剪器加载成功',
      message: '裁剪器加载成功，可以进行裁剪操作',
      type: 'success',
      position: 'bottom-left'
    })
  } else {
    ElNotification({
      title: '裁剪器加载失败',
      message: '裁剪器加载失败，网络异常或图片格式错误',
      type: 'error',
      position: 'bottom-left'
    })
  }
}
// 定义裁剪模板引用变量
const cropper = ref(null)
// 定义变量拿到实时选取数据和样式
const croppingImgUrl = ref(null)
const getStyle = ref({
  width: '',
  height: ''
}) // 预览样式
const previews = ref({}) // 预览img图片
const previewsStyle = ref({}) // 预览img样式
const tempScale = ref(0) // 临时比例
// 提供方法实时预览图片
const realTime = (data) => {
  previews.value = data // 预览img图片
  tempScale.value = props.previewWidth / data.w
  previewsStyle.value = {
    width: data.w + 'px',
    height: data.h + 'px',
    margin: 'auto',
    overflow: 'hidden',
    zoom: tempScale.value,
    position: 'relative',
    border: '1px solid #ccc',
    borderRadius: '50%',
    textAlign: 'center'
  }
  // console.log(data)
}
// 提供方法对Blob进行类型和大小校验
const validateBlob = (blob) => {
  const allowedTypes = props.allowTypeList // 允许的文件类型
  const maxSize = props.limitSize * 1024 * 1024 // 5MB

  const type = blob.type
  const size = blob.size

  if (!allowedTypes.includes(type)) {
    console.error('不允许的文件类型:', type)
    return false // 不允许的文件类型
  }

  if (size > maxSize) {
    console.error('文件大小超过限制:', size)
    return false // 文件过大
  }

  return true // 验证通过
}

// 提供方法对Base64进行类型和大小校验
const validateBase64 = (base64) => {
  const allowedTypes = props.allowTypeList // 允许的文件类型
  const maxSize = props.limitSize * 1024 * 1024 // 5MB

  const [prefix, base64Data] = base64.split(',')
  const mime = prefix.match(/:(.*?);/)[1] // 获取 MIME 类型
  const size =
    (base64Data.length * 3) / 4 - (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0) // 估算大小

  if (!allowedTypes.includes(mime)) {
    console.error('不允许的文件类型:', mime)
    return false // 不允许的文件类型
  }

  if (size > maxSize) {
    console.error('文件大小超过限制:', size)
    return false // 文件过大
  }

  return true // 验证通过
}
// 转换blob为file
const blobToFile = (blob) => {
  const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
  return file
}
// base64转blob
const dataURItoBlob = (dataURI) => {
  // base64 解码
  let byteString = window.atob(dataURI.split(',')[1])
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}
// 提供方法处理裁剪确认按钮
const handleCropper = () => {
  noCropper.value = false // 重置状态
  // 判断父组件指定的上传文件类型
  if (props.uploadFileType.toLocaleLowerCase() === 'base64') {
    // 获取裁剪图片的base64数据
    cropper.value.getCropData((data) => {
      imgNeedUpload.value = data // 确保 base64 存在
      // 转换base64为blob
      const blob = dataURItoBlob(data)
      console.log('base64转为blob：', blob)
      // 转换blob为jpg图片
      console.log('blob转为file：', blobToFile(blob))
      originImgUrl.value = URL.createObjectURL(blob)
      console.log('同步到原图图片：', originImgUrl.value)
    })
  } else if (props.uploadFileType.toLocaleLowerCase() === 'blob') {
    // 获取裁剪图片的blob数据
    cropper.value.getCropBlob((blob) => {
      imgNeedUpload.value = blob // 确保 blob 存在
      originImgUrl.value = URL.createObjectURL(blob)
    })
  } else {
    ElMessage.error('无法识别指定文件流类型！请检查 uploadFileType 属性是否正确！')
  }
}

// 提供方法处理重置裁剪按钮
const handleCropperReset = () => {
  cropper.value.refresh()
}

// 提供方法处理旋转
const handleRotateLeft = () => {
  cropper.value.rotateLeft()
}
const handleRotateRight = () => {
  cropper.value.rotateRight()
}
watch(
  () => props,
  () => {
    // get的预览样式
    getStyle.value = {
      // 预览图片的样式
      width: props.previewWidth + 'px',
      height: props.previewWidth / props.fixedNumber[0] + 'px'
    }
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="avatar-page">
    <el-row :gutter="20">
      <!-- 左侧上传区域 -->
      <el-col :span="8">
        <div class="left-section">
          <div class="left-title">
            <span>更换头像</span>
          </div>
          <div class="avatar-upload-wrapper">
            <el-upload
              class="avatar-uploader"
              :on-change="onSelectFIle"
              :auto-upload="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="originImgUrl"
                :src="originImgUrl"
                class="avatar"
                style="width: 400px; height: auto"
              />
              <img v-else :src="defaultAvatar" class="avatar" />
            </el-upload>
            <br />
            <el-button type="primary" size="large" @click="uploadAvatar">确认上传</el-button>
          </div>
        </div>
      </el-col>

      <!-- 中间裁剪区域 -->
      <el-col :span="8">
        <div class="center-section">
          <div class="left-title">
            <span>裁剪头像</span>
          </div>
          <span v-show="!originImgUrl" style="font-size: smaller; color: #666"
            >当您选择了图片之后，这里将会展示裁剪框，您可以对图片进行裁剪，然后点击确认裁剪按钮将裁剪结果将同步到左侧上传区域。</span
          >
          <div v-if="originImgUrl" class="cropper-editor">
            <!-- 裁剪器 -->
            <vueCropper
              ref="cropper"
              :img="originImgUrl"
              :autoCrop="true"
              :outputSize="1"
              :fixed="true"
              :fixedNumber="[1, 1]"
              :canMove="true"
              :viewMods="1"
              :aspectRatio="1"
              :centerBox="true"
              @realTime="realTime"
              @imgLoad="imgLoad"
              style="width: auto; height: 300px"
            ></vueCropper>
            <el-button type="primary" size="small" @click="handleRotateLeft()">向左旋转</el-button>
            <el-button type="primary" size="small" @click="handleRotateRight()">向右旋转</el-button>
            <el-button type="primary" size="small" @click="handleCropperReset()"
              >重置裁剪</el-button
            >
            <el-button type="primary" size="small" @click="handleCropper()">确认裁剪</el-button>
          </div>
        </div>
      </el-col>

      <!-- 右侧预览区域 -->
      <el-col :span="8">
        <div class="preview-images">
          <div class="left-title">
            <span>预览区域</span>
          </div>
          <span v-show="!originImgUrl" style="font-size: smaller; color: #666"
            >当您裁剪图片时，这里将会展示预览效果。</span
          >
          <p v-show="croppingImgUrl">预览效果</p>

          <div :style="getStyle" class="show-preview">
            <div :style="previewsStyle">
              <img :style="previews.img" :src="previews.url" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.avatar-page {
  padding: 20px;
  height: 75vh;
  /* border-radius: 8px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

.section-title {
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.left-section,
.center-section,
.preview-images {
  /* background-color: #fff; */
  /* border-radius: 8px; */
  padding: 20px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); */
}

.left-section {
  text-align: center;
}

.left-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.avatar-upload-wrapper {
  padding: 20px;
  text-align: center;
}

.avatar {
  /* border-radius: 50%; */
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar:hover {
  transform: scale(1.1);
}

.upload-button {
  margin-top: 20px;
}

.center-section {
  padding: 30px;
  text-align: center;
}

.cropper-editor {
  display: inline-block;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-images {
  text-align: center;
}

.preview-sizes {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-top: 20px;
}
</style>
