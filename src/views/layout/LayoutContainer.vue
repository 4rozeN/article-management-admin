<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { userGetProfileService } from '@/api/user'
import avatar from '@/assets/avatar.jpg'
import { useUserJwtStore } from '@/stores'
import { useRouter } from 'vue-router'
const user = ref({})
const imgUrl = ref('')
onMounted(async () => {
  const res = await userGetProfileService()
  user.value = res.data
  // 处理图片地址
  imgUrl.value = import.meta.env.VITE_BASE_UPLOAD_URL + user.value.avatar.url
  // console.log(imgUrl.value)
})

const router = useRouter()
const useStore = useUserJwtStore()
const onCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('确认退出登录吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        // 退出登录，清除jwt
        useStore.removeJwt()
        // 进行提示
        ElMessage({
          type: 'success',
          message: '成功退出'
        })
        // 跳转登录页面
        router.push('/')
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消'
        })
      })
  } else {
    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#19b9e7"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon>
            <Management />
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          当前用户：<strong>{{ user.username }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="onCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="imgUrl || avatar" />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <!-- #dropdown为Vue3具名插槽用法，这里是下拉列表 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="profile"
                :icon="User"
                @click="$router.push('/user/profile')"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop" @click="$router.push('/user/avatar')"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item
                command="password"
                :icon="EditPen"
                @click="$router.push('/user/password')"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>文章后台管理平台 ©2024 Created by 4rozen</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/login_title.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    border: #d6d6d6ff solid 1px;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
