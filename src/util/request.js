import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { getToken } from './auth'
import { removeToken } from "./auth";

const HOSTNAME = 'http://localhost:8080/'

// 创建axios实例
const service = axios.create({
  baseURL: HOSTNAME, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  return  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code === 200) {
      return response.data
    }
    Message({
      message: res.message,
      type: 'error',
      duration: 3 * 1000
    })

    // 401:未登录;
    if (res.code === 401||res.code === 403) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeToken()
        location.reload()
      })
    }
    return Promise.reject('error')
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
