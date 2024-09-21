<script setup>
import { useUserStore, useTotalStore } from '@/stores'
const userStore = useUserStore()
const totalStore = useTotalStore()

const login = () => {
  userStore.setToken('Bearer 123456')
}
const logout = () => {
  userStore.removeToken()
}
</script>

<template>
  <div>我是App组件</div>
  <p>{{ userStore.token }}</p>
  <el-button @click="login">登录</el-button>
  <el-button @click="logout">退出登录</el-button>
  <hr />
  <p>{{ totalStore.total }}</p>
  <el-button @click="totalStore.increment">加1</el-button>
  <el-button @click="totalStore.decrement">减1</el-button>
  <hr />
</template>

<style scoped></style>
