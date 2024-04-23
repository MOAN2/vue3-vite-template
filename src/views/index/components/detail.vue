<template>
  <div class="content" w-full flex>
    <div class="left" w-224 mb-30>
      <h2 class="title">{{ detail.title }}</h2>
      <p ccolor="#b2b2b2" font-size-4 mt-1 mb-3>
        {{ detail.summary }}
      </p>

      <div class="price" w-full p-2 mb-3>
        <div class="-flex-row-space-between-center">
          <div class="-flex-row-flex-start-center">
            <p font-size-6 color="#ee7f31" font-600 mr-5>
              <span font-size-5>￥</span>
              {{ detail.price }}
              <span font-size-4 color="#b2b2b2" font-400>/人起</span>
            </p>
            <p font-size-6 color="#3a84ee" mr-3 font-600>
              4.9
              <span font-size-4 font-400>分</span>
            </p>

            <p font-size-4 color="#3a84ee" mr-3 class="score">99+人评分</p>
          </div>

          <el-button type="primary" @click="order">预定</el-button>
        </div>
        <div class="-flex-row-flex-start-center">
          <el-tag plain type="warning">限时促销</el-tag>
          <el-tag plain type="error" mr-3 ml-3>已减700</el-tag>
        </div>
        <div class="-flex-row-flex-start-center">
          <p font-size-4 color="#666666" mr-2>
            会员权益
            <el-tag plain type="primary" mr-3 ml-3>白银会员</el-tag>
            <span font-size-3 color="gray">最少可得39积分</span>
          </p>
        </div>
      </div>

      <div class="imgs" w-full mb-3 v-if="detail?.summaryPics">
        <el-row h-full w-full>
          <el-col :span="10">
            <img :src="detail?.summaryPics[0]" class="image" w-full h-full />
          </el-col>
          <el-col :span="8" pl-1 pr-1 v-if="detail?.summaryPics[1]">
            <img :src="detail?.summaryPics[1]" class="image" w-full h-full />
          </el-col>
          <el-col :span="6" class="-flex-column-center-center">
            <img
              v-if="detail?.summaryPics[2]"
              :src="detail.summaryPics[2]"
              class="image"
              w-full
              h-full
              pb-1
            />

            <img
              :src="detail.summaryPics[3]"
              class="image"
              w-full
              h-full
              v-if="detail?.summaryPics[3]"
            />
            <div
              class="last-hover -flex-row-center-center"
              @click="openMore"
              v-if="detail.summaryPics.length > 3"
            >
              <span color="#fff" font-size-3>查看更多图片</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="more -flex-column-flex-start-flex-start">
        <div
          mb-1
          class="-flex-row-flex-start-center"
          v-if="detail.characteristic"
        >
          <p font-size-3 color="gray" w-17>产品特色</p>
          <el-tag
            type="primary"
            plain
            v-for="item in detail.characteristic"
            :key="item"
            mr-2
          >
            {{ item || '含导游服务' }}
          </el-tag>
        </div>

        <div mb-1 class="-flex-row-flex-start-center">
          <p font-size-3 color="gray" w-17>服务保障</p>
          <div mr-2 class="-flex-row-flex-start-center" font-size-3.5>
            <el-icon color="#7db444" mr-1><CircleCheck /></el-icon>
            {{ detail.guarantee }}
          </div>
        </div>
        <div mb-1 class="-flex-row-flex-start-center">
          <p font-size-3 color="gray" w-17>供应商</p>
          <div
            font-size-3.5
            mr-2
            class="-flex-row-flex-start-center"
            color="#3a84ee"
          >
            <el-icon mr-1 color="#3a84ee"><HomeFilled /></el-icon>
            {{ detail.supplier }}
          </div>
        </div>
        <div mb-1 class="-flex-row-flex-start-flex-start">
          <p font-size-3 color="gray" w-17>产品卖点</p>

          <p w-full font-size-3.5>
            {{ detail.sellingPoint }}
          </p>
        </div>
      </div>
    </div>
    <div class="right" w-125 h-full pt-4>
      <el-calendar w-full :range="[new Date(), endDdate]">
        <template #date-cell="{ data }">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
          </p>
          <p
            v-if="new Date(data.day) > new Date()"
            font-size-3
            color="#3a84ee"
            font-500
          >
            {{ 300 + Number(data.day.split('-').slice(2).join('')) }}起
          </p>
        </template>
      </el-calendar>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="全部图片" width="60%">
    <div class="swiper" w-full p-5>
      <el-carousel :interval="3000" height="400px" arrow="always">
        <el-carousel-item
          v-for="(item, index) in detail.summaryPics"
          :key="index"
        >
          <img :src="item" class="image" w-full h-full />
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>

  <el-dialog v-model="orderVisible" title="提交预定" width="500" @close="close">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="预定姓名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="联系方式" prop="mobile">
        <el-input v-model.number="form.mobile" autocomplete="off" type="text" />
      </el-form-item>
      <el-form-item
        label="订单人数"
        prop="travelNum"
        class="-flex-row-center-center"
      >
        <el-input
          v-model.number="form.travelNum"
          min="1"
          autocomplete="off"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="景点名称"
        prop="shopName"
        class="-flex-row-center-center"
      >
        <p font-size-5 font-500>{{ form.shopName }}</p>
      </el-form-item>
      <el-form-item
        label="景点地区"
        prop="area"
        class="-flex-row-center-center"
      >
        <p font-size-5 font-500>{{ form.area }}</p>
      </el-form-item>

      <el-form-item label="订单总价" class="-flex-row-center-center">
        <p font-size-5 font-500>{{ form.travelNum * detail.price }}元</p>
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
</template>
<script setup>
import { userStore } from '@/store/user'

import * as api from '@/api/app'
const props = defineProps({
  detail: {
    type: Object,
    default: () => {}
  }
})
const user = userStore()
const orderVisible = ref(false)
const dialogVisible = ref(false)
const openMore = () => {
  console.log('openMore')
  dialogVisible.value = true
}

const endDdate = ref(null)

onMounted(() => {
  let currentDate = new Date()

  // 增加两个月份（注意：getMonth()返回的是0-11的数字，因此需要加2再减去1）
  currentDate.setMonth(currentDate.getMonth() + 2)

  endDdate.value = currentDate
})

const form = reactive({
  userId: user.getInfo.userId,
  username: '',
  mobile: '',
  shopId: 0,
  type: 1, // 1景点 2酒店
  travelNum: 1,
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
  ],
  travelNum: [{ required: true, message: '请选择' }]
})

const order = () => {
  console.log(props.detail)
  form.shopId = props.detail.id

  form.shopName = props.detail.title
  form.area = props.detail.area

  orderVisible.value = true
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
 * 提交订单
 *
 */
const handleOrder = async () => {
  try {
    await api.addOrderApi({
      ...form,
      singlePrice: props.detail.price
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
  orderVisible.value = false
  initDialog()
}
const initDialog = () => {
  form.travelNum = 1
  form.username = ''
  form.mobile = ''
}
</script>
<style lang="scss" scoped>
:deep {
  .el-carousel__arrow {
    font-size: 30px;
    color: #475669;
    font-weight: 500;
    background-color: transparent;
  }
}
div {
  box-sizing: border-box;
}
p {
  margin: 0;
}
.content {
  .price {
    background-color: #fdf9ef;
    border-radius: 5px;
  }
  p {
    font-family: sans-serif;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .score {
    text-decoration: underline;
    cursor: pointer;
  }
}
.last-hover {
  position: absolute;
  width: 25%;
  height: 49%;
  top: 51%;
  background-color: #00000054;

  text-align: center;
}
.last-hover:hover {
  cursor: pointer;
  background-color: #00000074;
}

// todo
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
