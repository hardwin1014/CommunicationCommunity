import axios from 'axios'
import store from '@/store'
// 处理大数据问题
import jsonBig from 'json-bigint'

export const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基本路径
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})

// 请求拦截器
// 拦截上面的响应
request.interceptors.request.use(
  function (config) {
    // 请求发起会经过这里
    // config配置对象:本次请求的请求配置对象
    // console.log(config);

    // 对象解构出来
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 这里务必返回config，否则请求就停在这里了
    return config
  },
  function (error) {
    // 请求出错了，还没有发出去会进入这里
    return Promise.reject(error)
  }
)

// 响应拦截器
export default request
