<script setup>
import { userRegisterService, userLoginService } from '@/api/user'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserJwtStore } from '@/stores'
const useUserJwt = useUserJwtStore()

const isRegister = ref(false)
const shouldRemember = ref(false)
const form = ref()

const formModel = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const rules = {
  username: [
    { required: true, message: '用户名不能为空！', trigger: 'change' },
    {
      min: 2,
      max: 8,
      message: '用户名长度必须在2到8个字符之间！',
      trigger: 'change'
    }
  ],
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
  ]
}

const register = async () => {
  // 清空localStorage和sessionStorage中可能存在的jwt
  useUserJwt.removeJwt()
  await form.value.validate()
  // 说明校验通过
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功！')
  isRegister.value = false
}

const router = useRouter()
const login = async () => {
  // 清空localStorage和sessionStorage中可能存在的jwt
  useUserJwt.removeJwt()
  // 校验表单
  await form.value.validate()
  // 校验通过
  const res = await userLoginService(formModel.value)
  // console.log(res)
  // 判断是否勾选了 记住我 的功能
  if (shouldRemember.value === true) {
    // 保存到 localStorage 中
    useUserJwt.setJwt(res.data.jwt)
  } else {
    // 保存到 sessionStorage 中
    useUserJwt.setSessionJwt(res.data.jwt)
  }
  ElMessage.success('登录成功！')
  isRegister.value = false
  // 跳转到首页
  router.push('/')
}

watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            :prefix-icon="Message"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="formModel.confirmPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="register()"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form :model="formModel" :rules="rules" ref="form" size="large" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="shouldRemember">记住我</el-checkbox>
            <el-link
              type="primary"
              :underline="false"
              @click="router.push('user/password')"
              >忘记密码？</el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login()"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/login_title.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
