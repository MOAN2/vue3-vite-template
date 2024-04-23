<script setup>
import { useRouter } from 'vue-router'
import { loginRules, registerRules } from '@/views/login/utils/rule'
import { bg, illustration, traveling } from './utils/static'
import { formatDate } from './utils/day'
import { ref, reactive } from 'vue'
import { menuStore } from '@/store/menu'
import { userStore } from '@/store/user'

import { loginApi, registerApi } from '@/api/app'
import { manageRoutes, baseRoutes } from '@/config/resouce'
import { jwtDecode } from 'jwt-decode'

const menu = menuStore()
const user = userStore()
const router = useRouter()
const loading = ref(false)
const isDay = ref(true)

const isLogin = ref(true)
// 登陆表单
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: ''
})
const login = async () => {
  try {
    const { data } = await loginApi({
      account: loginForm.username,
      password: loginForm.password
    })

    if (data) {
      localStorage.setItem('token', data.token)
      const code = jwtDecode(data.token)

      console.log(code)
      let isManage = code.hasAdmin ? true : false
      if (isManage) {
        menu.addMenuList(manageRoutes)
      } else {
        menu.addMenuList(baseRoutes)
      }
      user.saveInfo(code)

      // 存入菜单到本地
      localStorage.setItem('user', JSON.stringify(code))
      localStorage.setItem('menu', JSON.stringify(menu.getMenuList))

      ElMessage({
        message: '登陆成功',
        type: 'success',
        duration: 1000
      })

      router.push('/home/index')
    }
  } catch (error) {
    loading.value = false

    ElMessage({
      message: error,
      type: 'error',
      duration: 1000
    })
  }
}

const onLogin = async (formEl) => {
  try {
    loading.value = true
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        login()
      } else {
        loading.value = false
        return fields
      }
    })
  } catch (error) {
    loading.value = false
  }
}
// 注册
const registerFormRef = ref()
const registerForm = reactive({
  username: '',
  password: '',
  nickName: '',
  mobile: '',
  email: '',
  gender: '未知',
  age: 0,
  birthday: ''
})
const ageOp = Array.from({ length: 100 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))

const onRegister = async (formEl) => {
  loading.value = true
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const params = {
        ...registerForm,
        birthday: formatDate(registerForm.birthday),
        gender:
          registerForm.gender == '男' ? 1 : registerForm.gender == '女' ? 2 : 3
      }
      console.log(params, 'valid regsiter')
      register(params)
    } else {
      loading.value = false
      return fields
    }
  })
}

const register = async (params) => {
  try {
    await registerApi(params)
    ElMessage({ message: '注册成功', type: 'success' })
    isLogin.value = true
    loading.value = false
  } catch (error) {
    loading.value = false
    ElMessage({
      message: error,
      type: 'error',
      duration: 1000
    })
    console.log(error)
  }
}
</script>

<template>
  <div class="select-none" :style="{ background: isDay ? 'white' : 'black' }">
    <img :src="bg" class="wave" />
    <div class="switch absolute right-5 top-3" z-100>
      <!-- 主题 -->
      <el-switch
        v-model="isDay"
        inline-prompt
        active-icon="Sunny"
        inactive-icon="Moon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img-left">
        <img :src="isDay ? traveling : illustration" alt="illustration" />
      </div>
      <div class="login-box" z-99 relative>
        <div class="login-form">
          <img src="@/assets/logo.png" w-15 h-15 mb-1 />
          <p font-size-6 font-500 color="#3a84ee">
            {{ isLogin ? '欢迎登陆' : '欢迎注册' }}
          </p>
          <!-- 登陆表单 -->
          <el-form
            v-if="isLogin"
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                clearable
                v-model="loginForm.username"
                placeholder="账号/电话号码/邮箱"
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                clearable
                show-password
                v-model="loginForm.password"
                placeholder="密码"
                prefix-icon="Lock"
              />
            </el-form-item>

            <el-button
              class="w-full mt-4"
              size="default"
              type="primary"
              :loading="loading"
              @click="onLogin(loginFormRef)"
            >
              登录
            </el-button>
            <el-button
              class="w-full mt-4"
              size="default"
              type="primary"
              plain
              @click="isLogin = false"
            >
              注册
            </el-button>
          </el-form>
          <!-- 注册表单 -->
          <el-form
            v-if="!isLogin"
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            size="large"
          >
            <el-form-item prop="username" label="账号">
              <el-input
                clearable
                v-model="registerForm.username"
                placeholder="账号"
                prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <el-input
                clearable
                show-password
                v-model="registerForm.password"
                placeholder="密码"
                prefix-icon="Lock"
              />
            </el-form-item>

            <el-form-item prop="nickName" label="昵称">
              <el-input
                clearable
                v-model="registerForm.nickName"
                maxlength="10"
                placeholder="昵称"
                prefix-icon="Ship"
              />
            </el-form-item>

            <el-form-item prop="mobile" label="电话">
              <el-input
                clearable
                v-model.number="registerForm.mobile"
                placeholder="电话号码"
                prefix-icon="Phone"
              />
            </el-form-item>

            <el-form-item prop="email" label="邮箱">
              <el-input
                clearable
                v-model="registerForm.email"
                placeholder="邮箱"
                prefix-icon="Message"
              />
            </el-form-item>

            <el-form-item prop="gender" label="性别">
              <el-radio-group v-model="registerForm.gender">
                <el-radio label="男" />
                <el-radio label="女" />
                <el-radio label="未知" />
              </el-radio-group>
            </el-form-item>

            <el-form-item prop="age" label="年龄">
              <el-select-v2
                v-model="registerForm.age"
                placeholder="年龄"
                :options="ageOp"
              />
            </el-form-item>

            <el-form-item prop="birthday" label="生日">
              <el-date-picker
                v-model="registerForm.birthday"
                type="date"
                format="YYYY-MM-DD"
                placeholder="选择生日日期"
              />
            </el-form-item>

            <el-button
              class="w-full mt-4"
              size="default"
              type="primary"
              :loading="loading"
              @click="onRegister(registerFormRef)"
            >
              注册
            </el-button>
            <el-button
              class="w-full mt-4"
              size="default"
              type="primary"
              plain
              @click="isLogin = true"
            >
              返回登陆
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
:deep(.el-button + .el-button) {
  margin-left: 0;
}
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;

  width: 100%;
}

.login-container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 18rem;
  padding: 0 2rem;
}

.img-left {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 1;
}

.img-left img {
  width: 500px;
}

.login-box {
  display: flex;
  align-items: center;
  text-align: center;
}

.login-form {
  width: 360px;
}

.avatar {
  width: 350px;
  height: 80px;
}

.login-form h2 {
  text-transform: uppercase;
  margin: 15px 0;
  color: #999;
  font: bold 200% Consolas, Monaco, monospace;
}

@media screen and (max-width: 1180px) {
  .login-container {
    grid-gap: 9rem;
  }

  .login-form {
    width: 290px;
  }

  .login-form h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  .img-left img {
    width: 360px;
    transition: all;
  }
}

@media screen and (max-width: 968px) {
  .wave {
    display: none;
  }

  .img-left {
    display: none;
  }

  .login-container {
    grid-template-columns: 1fr;
  }

  .login-box {
    justify-content: center;
  }
}
</style>
