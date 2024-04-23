<template>
  <div class="main -flex-column-center-center" pl-10 pr-10 pb-20>
    <div class="form" w-250 p-10>
      <h2>个人信息</h2>
      <div class="-flex-row-space-around-center">
        <el-form
          ref="formRef"
          :model="form"
          :rules="registerRules"
          size="large"
        >
          <el-form-item prop="username" label="账号">
            <el-input
              v-if="isEdit"
              clearable
              v-model="form.username"
              placeholder="账号"
              prefix-icon="User"
            />
            <p font-size-5 v-else>{{ form.username }}</p>
          </el-form-item>

          <el-form-item prop="nickName" label="昵称">
            <el-input
              v-if="isEdit"
              clearable
              v-model="form.nickName"
              maxlength="10"
              placeholder="昵称"
              prefix-icon="Ship"
            />
            <p font-size-5 v-else>{{ form.nickName }}</p>
          </el-form-item>

          <el-form-item prop="mobile" label="电话">
            <el-input
              v-if="isEdit"
              clearable
              v-model.number="form.mobile"
              placeholder="电话号码"
              prefix-icon="Phone"
            />
            <p font-size-5 v-else>{{ form.mobile }}</p>
          </el-form-item>

          <el-form-item prop="email" label="邮箱">
            <el-input
              v-if="isEdit"
              clearable
              v-model="form.email"
              placeholder="邮箱"
              prefix-icon="Message"
            />
            <p font-size-5 v-else>{{ form.email }}</p>
          </el-form-item>

          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="form.gender" v-if="isEdit">
              <el-radio label="男" />
              <el-radio label="女" />
              <el-radio label="未知" />
            </el-radio-group>
            <p font-size-5 v-else>
              {{ form.gender == 1 ? '男' : form.gender == 2 ? '女' : '未知' }}
            </p>
          </el-form-item>

          <el-form-item prop="age" label="年龄">
            <el-select-v2
              v-if="isEdit"
              v-model="form.age"
              placeholder="年龄"
              :options="ageOp"
            />
            <p font-size-5 v-else>{{ form.age }}岁</p>
          </el-form-item>

          <el-form-item prop="birthday" label="生日">
            <el-date-picker
              v-if="isEdit"
              v-model="form.birthdayDate"
              type="date"
              format="YYYY-MM-DD"
              placeholder="选择生日日期"
            />
            <p font-size-5 v-else>{{ form.birthday }}</p>
          </el-form-item>
          <el-form-item prop="name" label="用户权限" v-if="!isEdit">
            <p font-size-5>{{ form.name }}</p>
          </el-form-item>
          <el-form-item prop="registerTime" label="账号注册时间" v-if="!isEdit">
            <p font-size-5>{{ form.registerTime }}</p>
          </el-form-item>

          <el-button
            v-if="isEdit"
            class="mt-4"
            size="default"
            type="primary"
            @click="edit(formRef)"
          >
            提交
          </el-button>
          <el-button
            v-if="isEdit"
            class="mt-4"
            size="default"
            type="primary"
            @click="cancel"
          >
            取消
          </el-button>
          <el-button
            v-if="!isEdit"
            class="mt-4"
            size="default"
            type="primary"
            @click="handleEdit"
          >
            编辑
          </el-button>
          <el-button
            v-if="!isEdit"
            class="mt-4"
            size="default"
            type="primary"
            @click="dialogVisible = true"
          >
            修改密码
          </el-button>
        </el-form>
        <img :src="info" alt="info" width="500" v-if="!isEdit" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="修改密码" width="500">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            clearable
            show-password
            placeholder="请输入新密码"
            prefix-icon="Lock"
            v-model="pwdForm.newPassword"
          />
        </el-form-item>
        <el-form-item label="再次确认" prop="confirmNewPassword">
          <el-input
            clearable
            show-password
            placeholder="请再次输入新密码"
            prefix-icon="Lock"
            v-model="pwdForm.confirmNewPassword"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="pwdConfirm(pwdFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-backtop :bottom="100">
      <el-icon size="20"><CaretTop /></el-icon>
    </el-backtop>
  </div>
</template>
<script setup>
import info from '@/assets/svg/info.svg'
import { registerRules } from '@/views/login/utils/rule'
import { formatDate } from '@/views/login/utils/day'
import { ref, reactive, onMounted } from 'vue'
import { userStore } from '@/store/user'
import * as api from '@/api/app'
import { ElMessage } from 'element-plus'
const formRef = ref()
const user = userStore()
const isEdit = ref(false)
const form = ref({
  age: 0,
  avatarUrl: '',
  birthday: '',
  birthdayDate: '',
  code: ' ',
  createdTime: ' ',
  deletedAt: 0,
  email: ' ',
  endLoginTime: null,
  firstLoginTime: null,
  gender: 0,
  hasAdmin: 0,
  id: '',
  mobile: '',
  name: ' ',
  nickName: '',
  realName: '',
  registerTime: ' ',
  updatedTime: ' ',
  username: ' '
})

/** 密码正则（密码格式应为6-10位数字、字母、符号的任意两种组合） */
const REGEXP_PWD = /^[A-Za-z0-9]{6,10}$/
const pwdFormRef = ref()
// 修改密码弹窗
const dialogVisible = ref(false)
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

/** 修改密码校验 */
const pwdRules = reactive({
  oldPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'))
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为6-10位数字、字母任意组合'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  newPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为6-10位数字、字母任意组合'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmNewPassword: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为6-10位数字、字母任意组合'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const pwdConfirm = async () => {
  try {
    if (pwdForm.newPassword !== pwdForm.confirmNewPassword) {
      return ElMessage({ type: 'error', message: '两次输入密码不一致' })
    }
    await api.updatePwdApi({
      userId: user.getInfo.userId,
      ...pwdForm
    })
    ElMessage({ type: 'success', message: '修改成功' })
    dialogVisible.value = false
  } catch (error) {
    ElMessage({ type: 'error', message: '修改失败，请重试' })
  }
}

const ageOp = Array.from({ length: 100 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))

onMounted(() => {
  getInfo()
})

let lastDate = ''
const handleEdit = () => {
  form.value.gender =
    form.value.gender == 1 ? '男' : form.value.gender == 2 ? '女' : '未知'
  console.log(form.value, 'form.value')
  lastDate = form.value.birthdayDate
  // form.value.birthday = new Date(form.value.birthday)
  isEdit.value = true
}

const getInfo = async () => {
  try {
    const { data } = await api.getUserListApi({
      pageNo: 1,
      pageSize: 10000
    })
    if (data.userModelList) {
      let arr = data.userModelList.filter((item) => {
        return item.deletedAt == 0
      })

      let userId = user.getInfo.userId
      arr = arr.filter((item) => {
        if (Number(item.id) === userId) {
          return item
        }
      })
      form.value = arr[0]
      form.value.birthdayDate = arr[0].birthday
      form.value.birthday = formatDate(new Date(form.value.birthdayDate))
    }
  } catch (error) {
    console.log(error)
  }
}

const edit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (form.value.birthdayDate === null) {
        return ElMessage({ message: '生日不能为空', type: 'error' })
      }
      editApi()
    } else {
      return fields
    }
  })
}

const editApi = async () => {
  try {
    const params = {
      userId: user.getInfo.userId,
      username: form.value.username,
      nickName: form.value.nickName,
      mobile: form.value.mobile,
      email: form.value.email,
      gender: form.value.gender == '男' ? 1 : form.value.gender == '女' ? 2 : 3,
      age: form.value.age,
      birthday: formatDate(new Date(form.value.birthdayDate))
    }

    await api.updateUserApi(params)
    ElMessage({ message: '编辑成功', type: 'success' })
    form.value.birthday = formatDate(new Date(form.value.birthdayDate))
    isEdit.value = false
    lastDate = ''
  } catch (error) {
    ElMessage({ message: '编辑失败，请重试', type: 'error' })
    isEdit.value = false
  }
}
const cancel = () => {
  console.log(form.value, 'form.value')
  isEdit.value = false
  form.value.birthdayDate = lastDate
  lastDate = ''
}
</script>
<style lang="scss" scoped>
.main {
  margin-top: -40px;
  background-color: #f6f8fa;
  li {
    list-style: none;
  }
  p {
    margin: 0;
  }
}
.form {
  background-color: #ffffff;
  border-radius: 10px;
}
</style>
