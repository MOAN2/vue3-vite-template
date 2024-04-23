<template>
  <div class="other" w-full>
    <div class="input" w-180 p-3 mb-5>
      <h2>可选房间</h2>
      <div class="-flex-row-flex-start-center" mb-1>
        <h4 mr-5>入住日期</h4>
        <el-date-picker
          v-model="date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          date-format="YYYY-MM-DD"
          @change="handleDate"
        />
      </div>
    </div>
    <el-divider></el-divider>
    <div class="input comments -flex-column-flex-start-center" w-full p-3 mb-5>
      <div
        class="list"
        w-full
        v-for="(item, index) in info.rootTypeList"
        :key="index"
      >
        <div flex>
          <div class="-flex-column-center-center" mr-10>
            <el-avatar shape="square" :size="110" :src="item.img" />
            <p>{{ item.leftInfo }}</p>
          </div>

          <div ml-3 class="-flex-row-space-between-center" w-full mr-3>
            <div class="right" w-10>
              <el-icon><UserFilled /></el-icon>
              <el-icon><UserFilled /></el-icon>
            </div>
            <el-divider direction="vertical" />
            <div class="right" w-80>
              <p class="-text-6-ellipsis">{{ item.middleInfo }}</p>
            </div>
            <el-divider direction="vertical" />
            <div class="right" w-80>
              <p class="-text-6-ellipsis">{{ item.rightInfo }}</p>
            </div>
            <el-divider direction="vertical" />
            <div class="right">
              <p font-size-6 color="#3a84ee" font-600 mr-5>
                <span class="price-old" font-size-4 color="gray">
                  ￥{{ info.price + 129 }}
                </span>
                <span font-size-5>￥</span>
                {{ info.price }}
                <span font-size-4 color="#b2b2b2" font-400></span>
              </p>
              <el-button type="primary" @click="order">预定</el-button>
            </div>
          </div>
        </div>

        <el-divider></el-divider>
      </div>
    </div>

    <div class="input comments -flex-column-flex-start-center" w-full p-3 mb-5>
      <div w-full class="-flex-row-flex-start-center">
        <el-icon color="#e9b555" mr-1><Opportunity /></el-icon>
        <h2 w-50>酒店政策</h2>
      </div>
      <div w-full v-for="(item, index) in info.policyInfoList" :key="index">
        <h4>{{ item.title }}</h4>
        <ul>
          <li>
            <template v-if="item.info.startsWith('http')">
              <img :src="item.info" alt="img" />
            </template>
            <p v-else>{{ item.info }}</p>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="提交预定"
      width="500"
      @close="close"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="预定姓名" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input
            v-model.number="form.mobile"
            autocomplete="off"
            type="text"
          />
        </el-form-item>
        <el-form-item
          label="酒店名称"
          prop="shopName"
          class="-flex-row-center-center"
        >
          <p font-size-5 font-500>{{ form.shopName }}</p>
        </el-form-item>
        <el-form-item
          label="酒店地点"
          prop="area"
          class="-flex-row-center-center"
        >
          <p font-size-5 font-500>{{ form.area }}</p>
        </el-form-item>
        <el-form-item
          label="预定天数"
          prop="travelNum"
          class="-flex-row-center-center"
        >
          <p font-size-5 font-500>{{ form.travelNum }}天</p>
        </el-form-item>
        <el-form-item label="订单总价" class="-flex-row-center-center">
          <p font-size-5 font-500>{{ form.travelNum * info.price }}元</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="orderConfirm(formRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import * as api from '@/api/app'
const date = ref()
const router = useRouter()
const user = userStore()
const dialogVisible = ref(false)

const info = ref({
  rootTypeList: [],
  policyInfoList: []
})
const form = reactive({
  userId: user.getInfo.userId,
  username: '',
  mobile: '',
  shopId: 0,
  type: 2, // 1景点 2酒店
  travelNum: 0,
  shopName: '',
  area: ''
})
const formRef = ref()
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

const order = () => {
  if (!date.value) {
    return ElMessage({
      message: '请先选择日期',
      type: 'warning'
    })
  }
  const travelNum = daysDifference()

  form.shopId = info.value.id
  form.travelNum = travelNum
  form.shopName = info.value.headlineTitle
  form.area = info.value.localtion

  dialogVisible.value = true
}
onMounted(() => {
  getDetail()
})

const daysDifference = () => {
  // 计算两个日期之间的毫秒差值
  var differenceInMilliseconds = Math.abs(
    date.value[1].getTime() - date.value[0].getTime()
  )
  // 一天的毫秒数是 24小时 * 60分钟 * 60秒 * 1000毫秒
  var oneDayInMilliseconds = 24 * 60 * 60 * 1000
  // 计算相差的天数并向下取整
  var differenceInDays = Math.floor(
    differenceInMilliseconds / oneDayInMilliseconds
  )
  return differenceInDays
}
const orderConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleOrder()
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 获取酒店详情
 *
 */
const getDetail = async () => {
  try {
    const { data } = await api.getHotelDetail({
      hotelId: router.currentRoute.value.query.hotelId
    })

    info.value = data
  } catch (error) {
    console.log(error)
  }
}

const initDialog = () => {
  form.travelNum = 1
  form.username = ''
  form.mobile = ''
}
/**
 * 提交订单
 *
 */
const handleOrder = async () => {
  try {
    await api.addOrderApi({
      ...form,
      singlePrice: info.value.price,
      shopId: Number(form.shopId)
    })
    ElMessage({
      message: '预定成功',
      type: 'success'
    })

    close()
  } catch (error) {
    ElMessage({
      message: '预定失败，请重试',
      type: 'error'
    })
    close()

    console.log(error)
  }
}
const close = () => {
  dialogVisible.value = false
  initDialog()
}
</script>

<style scoped lang="scss">
:deep {
  .el-divider__text {
    font-size: 18px;
  }
}
p {
  margin: 5px 0;
}
.input {
  border-radius: 5px;
  background-color: #f6f8fa;
}
.comments {
  background-color: #fff;
  padding: 10px;
}
.price-old {
  text-decoration: line-through;
}
</style>
