<script setup>
import { Message, Lock, Key } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import {
  userResetPasswordService,
  userGetProfileService,
  userForgotPasswordService
} from '@/api/user'
import { useUserJwtStore } from '@/stores'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const useUserStore = useUserJwtStore()
const mailChecked = ref(false)
const countId = ref('')
const form = ref()
const formModel = ref({
  email: '',
  password: '',
  confirmPassword: '',
  code: ''
})
const rules = {
  email: [
    { required: true, message: '邮箱不能为空！', trigger: 'change' },
    { type: 'email', message: '邮箱格式不正确！', trigger: 'change' }
  ],
  password: [
    { required: true, message: '密码不能为空！', trigger: 'change' },
    {
      pattern: /^\S{6,16}$/,
      message: '密码长度必须在6到16个字符之间！',
      trigger: 'change'
    }
  ],
  confirmPassword: [
    { required: true, message: '密码不能为空！', trigger: 'change' },
    {
      pattern: /^\S{6,16}$/,
      message: '密码长度必须在6到16个字符之间！',
      trigger: 'change'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码输入不一致！'))
        } else {
          callback()
        }
      }
    }
  ],
  code: [{ required: true, message: '验证码不能为空！', trigger: 'change' }]
}

const handleSubmit = async () => {
  // 校验表单
  await form.value.validate()
  await userGetProfileService()
  // console.log(res)
  await userForgotPasswordService(formModel.value)
  ElMessage.success('密码重置邮件已发送至邮箱，请注意查收')
  mailChecked.value = true
}

onMounted(async () => {
  const res = await userGetProfileService()
  countId.value = res.data.username
})

const useRoute = useRouter()
const pswSubmit = async () => {
  // 校验表单
  await form.value.validate()
  // 显示loading
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await userResetPasswordService(formModel.value)
  loading.close()
  // 重置jwt
  useUserStore.removeJwt()
  ElMessage.success('密码重置成功，请重新登录')
  // 跳转登录页面
  useRoute.push('/login')
}
</script>

<template>
  <div class="user-password">
    <el-row class="pswd-page">
      <el-col :span="8"></el-col>
      <el-col :span="8" class="form">
        <el-form
          :model="formModel"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          v-if="!mailChecked"
        >
          <el-form-item class="title">
            <h1>密码重置</h1>
          </el-form-item>
          <p v-show="countId">您的账号名为：{{ countId }}</p>
          <p style="font-size: small">
            请输入账号的邮箱地址，我们将发送密码重置邮件
          </p>
          <el-form-item prop="email">
            <el-input
              v-model="formModel.email"
              :prefix-icon="Message"
              placeholder="请输入账号的邮箱地址"
            ></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="$router.go(-1)">
              ← 返回
            </el-link>
            <el-button type="primary" class="button" @click="handleSubmit()"
              >确认</el-button
            >
          </el-form-item>
        </el-form>

        <el-form ref="form" size="large" v-else>
          <el-form-item class="title">
            <h1>密码重置</h1>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="formModel.confirmPassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="请再次输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="formModel.code"
              :prefix-icon="Key"
              placeholder="请输入重置邮件的code校验码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-link type="info" :underline="false" @click="$router.go(-1)">
              ← 返回
            </el-link>
            <el-button type="primary" class="button" @click="pswSubmit()"
              >确认</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.user-password {
  background-color: #f5f5f5;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      /* 右对齐 */
      margin-left: auto;
      width: 20%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
