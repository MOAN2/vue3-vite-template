<template>
  <div class="main" ml-10 mr-10 mb-20>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home/index' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h2>所有用户</h2>
    <div mt-10>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f6f8fa' }"
      >
        <el-table-column prop="username" label="用户名称" width="100" />
        <el-table-column prop="nickName" label="用户昵称" width="100" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="100">
          <template #default="scope">
            <p>
              {{
                scope.row.gender == 1
                  ? '男'
                  : scope.row.gender == 1
                  ? '女'
                  : '未知'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="用户年龄" width="100" />
        <el-table-column prop="mobile" label="用户电话" width="180" />
        <el-table-column prop="email" label="用户邮箱" width="180" />
        <el-table-column prop="birthday" label="用户生日" width="180" />
        <el-table-column prop="registerTime" label="注册账户时间" width="180" />
        <el-table-column
          prop="firstLoginTime"
          label="首次登陆时间"
          width="180"
        />
        <el-table-column prop="endLoginTime" label="最后登陆时间" width="180" />
        <el-table-column prop="address" label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              <el-icon color="#fff" mr-1><DeleteFilled /></el-icon>
              删除用户
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        mt-10
        w-full
        v-model:current-page="tableParams.pageNo"
        v-model:page-size="tableParams.pageSize"
        :page-sizes="[10, 15, 20, 50]"
        :background="background"
        layout="sizes, prev, pager, next,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import * as api from '@/api/app'
import { onMounted } from 'vue'
import { userStore } from '@/store/user'

const tableParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref([])

onMounted(() => {
  getList()
})

const getList = async () => {
  try {
    const { data } = await api.getUserListApi({
      ...tableParams
    })
    if (data.userModelList) {
      let arr = data.userModelList.filter((item) => {
        return item.deletedAt == 0
      })
      tableData.value = arr
      total.value = arr.length
    }
  } catch (error) {
    console.log(error)
  }
}

const rules = reactive({})

const handleDelete = async (item) => {
  ElMessageBox.alert('确认删除该用户吗？', '删除确认', {
    confirmButtonText: '确定',
    callback: (action) => {
      if (action.includes('confirm')) {
        delUser(item.id)
      }
    }
  })
}

/**
 * 删除用户
 */
const delUser = async (id) => {
  try {
    let userId = Number(id)
    await api.delUserApi({ userId })
    getList()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
    console.log(error)
  }
}

const handleSizeChange = (val) => {
  tableParams.pageSize = val
  getList()
}
const handleCurrentChange = (val) => {
  tableParams.pageNo = val
  getList()
}
</script>
<style lang="scss" scoped></style>
