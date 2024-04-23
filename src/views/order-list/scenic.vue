<template>
  <div class="main" ml-10 mr-10 mb-20>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home/index' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>景点订单</el-breadcrumb-item>
    </el-breadcrumb>
    <h2>我的景点订单</h2>
    <div mt-10>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f6f8fa' }"
      >
        <el-table-column prop="shopName" label="景点名称" width="280" fixed />
        <el-table-column prop="username" label="订单联系人" width="180" />
        <el-table-column prop="mobile" label="联系人电话" width="180" />
        <el-table-column prop="area" label="景点地址" width="280" />
        <el-table-column prop="travelNum" label="订单人数" width="80" />
        <el-table-column prop="singlePrice" label="景点单价" width="100" />
        <el-table-column prop="createdTime" label="订单创建时间" width="180" />
        <el-table-column prop="updatedTime" label="订单更新时间" width="180" />
        <el-table-column prop="address" label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
            >
              <el-icon mr-1><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              <el-icon color="#fff" mr-1><DeleteFilled /></el-icon>
              删除
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

  <el-dialog v-model="dialogVisible" title="编辑订单" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="预定姓名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input v-model.number="form.mobile" autocomplete="off" type="text" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editConfirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import * as api from '@/api/app'
import { onMounted } from 'vue'
import { userStore } from '@/store/user'

const user = userStore()
const dialogVisible = ref(false)
const tableParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref([])
const form = reactive({
  orderId: 0,
  userId: 0,
  username: '',
  mobile: '',
  travelNum: 0
})
const formRef = ref()

onMounted(() => {
  getList()
})

const getList = async () => {
  try {
    const { data } = await api.getOrderListApi({
      ...tableParams,
      userId: user.getInfo.userId
    })
    if (data.orderList) {
      let arr = data.orderList.filter((item) => {
        return item.type == 1
      })
      tableData.value = arr
      total.value = arr.length
    }
  } catch (error) {
    console.log(error)
  }
}

const rules = reactive({
  username: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 1, max: 10, message: '请输入1-10字符', trigger: 'blur' }
  ],
  mobile: [
    {
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系方式'))
        } else if (!/^1[0-9]{10}$/.test(value)) {
          callback(new Error('请输入中国合法的联系方式，以1开头的11位号码'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    {
      required: true,
      message: '请输入联系方式',
      trigger: 'blur'
    }
  ]
})

const handleDelete = async (item) => {
  ElMessageBox.alert('确认删除这条订单吗？', '删除确认', {
    confirmButtonText: '确定',
    callback: (action) => {
      if (action.includes('confirm')) {
        delOrder(item.id)
      }
    }
  })
}

/**
 * 删除订单
 */
const delOrder = async (id) => {
  try {
    let orderId = Number(id)
    await api.delOrderApi({ orderId })
    getList()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败，请重试')
    console.log(error)
  }
}

/**
 * 编辑订单
 */
const handleEdit = (item) => {
  form.orderId = Number(item.id)
  form.userId = user.getInfo.userId
  form.username = item.username
  form.mobile = item.mobile
  form.travelNum = item.travelNum
  dialogVisible.value = true
}

const editConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      editOrder()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const editOrder = async () => {
  try {
    await api.updateOrderApi(form)
    ElMessage.success('修改成功')
    dialogVisible.value = false
    getList()
  } catch (error) {
    ElMessage.error('修改失败，请重试')
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
