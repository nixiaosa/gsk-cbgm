'use strict'

import axios from 'axios'
// import { Message } from 'element-ui'
let Config = require('../common/config')
// const domin = ''// 租户//
const domin = process.env.BASE_API
axios.interceptors.request.use(config => {
  // loading
  const token = window.localStorage.getItem('yibai_token_c')
  config.headers.Authtype = 'webm'
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    data: {
      code: -404,
      message: '网络异常'
    },
    status: -404,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    console.log(res)
  }
  // if (res.data && (!res.data.success)) {
  //   alert(res.data.error_msg)
  // }
  return res
}
function checkCode2(res) {
  if (res.status === -404) {
    console.log(res)
    alert("当前导出数据量较大，请联系管理员处理")
    // Message({
    //   showClose: true,
    //   message: '当前导出数据量较大，请联系管理员处理',
    //   type: 'error',
    //   duration: 5 * 1000
    // });
  }
  // if (res.data && (!res.data.success)) {
  //   alert("当前导出数据量较大，请联系管理员处理")
  // }
  return res
}

let locationHost = window.location.host
if (locationHost.indexOf('localhost') >= 0 || window.location.port === '9004') {
  locationHost = Config.DOMAIN_NAME
}
const zhendoc = 'www.zhendoc.com'
const zhendocHost = '2018.zhendoc.com'
let bjmeda = 'bjmeda.org.cn'
let bjmedaHost = 'xxzxy.100doc.com.cn'
locationHost = locationHost === zhendoc ? zhendocHost : locationHost
locationHost = locationHost.indexOf(bjmeda) >= 0 ? bjmedaHost : locationHost
window.localStorage.setItem('locationHost', locationHost) // 有接口不走此axios时 方便取host
export default {
  post(url, data) {
    return axios({
      method: 'post',
      // baseURL: 'https://cnodejs.org/api/v1', //
      baseURL: domin, // api  host
      url,
      // data: qs.stringify(data),
      data,
      timeout: 60000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'agent': 'manager',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  messageError(msg) {
    this.$notify.error({
      title: '错误',
      message: msg
    })
  },
  get(url, data) {
    return axios({
      method: 'get',
      // baseURL: 'https://cnodejs.org/api/v1',
      baseURL: domin, // api  host
      url,
      data, // get 请求时带的参数
      timeout: 60000,
      // timeout: 100,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'agent': 'manager',
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        // return checkCode()
        return checkCode2(res)
      }
    )
  }
}
