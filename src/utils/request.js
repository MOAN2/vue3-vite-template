import axios from 'axios'
// import { ElLoading } from 'element-plus'
import router from '../router'

const request = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 20000
})
let loadingServe
let loadingCount = 0

request.interceptors.request.use(
  (config) => {
    const hideLoading = config.hideLoading
    // 默认开启loading
    if (!hideLoading) {
      loadingCount++
      loadingServe = ElLoading.service({
        text: '正在加载中'
      })
    }

    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  (error) => {
    // do something with request error
    console.log(error, 'ERROR') // for debug
    if (loadingServe) {
      loadingServe.close()
    }
    return Promise.reject(error)
  }
) /*  */
request.interceptors.response.use(
  (result) => {
    loadingCount--
    if (loadingServe && loadingCount <= 0) {
      loadingServe.close()
    }

    const res = result.data
    if (res.code == 2001) {
      console.log(res.message)

      return Promise.reject(res.message)
    } else if (res.code !== 200) {
      console.log('请求错误', res.message)
      ElMessage({ message: `${res.message},请重试`, type: 'error' })
      return Promise.reject(error)
    }
    return Promise.resolve(res)
  },
  (error) => {
    // Loading.close()
    console.log('request Error:', error)
    if (loadingServe) {
      loadingServe.close()
    }
    return Promise.reject(error)
  }
)
export default request
