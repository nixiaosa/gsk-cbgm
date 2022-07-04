'use strict'

import axios from 'axios'

const Config = require('../common/config')
const domin = process.env.BASE_API
axios.interceptors.request.use(config => {
    // const token = window.localStorage.getItem('yibai_token_c')
    const token = 'Hm_lvt_02f4954098ca538f83974f3e0e52f365=1654667496; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22731099580438937600%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22url%E7%9A%84domain%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%22%2C%22%24latest_search_keyword%22%3A%22url%E7%9A%84domain%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%22%2C%22%24latest_referrer%22%3A%22url%E7%9A%84domain%E8%A7%A3%E6%9E%90%E5%A4%B1%E8%B4%A5%22%7D%2C%22%24device_id%22%3A%2218141de4567632-00073be8aebd7d39c-367b6706-1764000-18141de456888d%22%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfYW5vbnltb3VzX2lkIjoiNzMxMDk5NTgwNDM4OTM3NjAwIiwiJGlkZW50aXR5X2Nvb2tpZV9pZCI6IjE4MTViMDE3OTU0MmU1LTA4ODllMmE0N2M3NDA2OC0zNjdiNjcwNi0zNjg2NDAwLTE4MTViMDE3OTU1OTZlIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%7D; cmtgsk=Kl0QZG_2k_9eNKWmK2nHrrSul5Op2-wWTLqrDQM7aLxx95KlmyKUOoc7D0Xtk4VjXEqHEl67lQ8GfRQrQmepEeBmv07lgD5gS-PkHualw7bkvyEZpHQwAXkdtF1uu0GXweXan3N8JjZzh6nBbVHnTKekjkAnwLxFFIg7GFWmimc'
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
        status: -404,
        msg: '网络异常'
    }
}

function checkCode(res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        // console.log(res)
    }
    if (res.data && (!res.data.success)) {
        // console.log(res);
    }
    return res
}

let locationHost = window.location.host
if (locationHost.indexOf('localhost') >= 0 || window.location.port === '9004') {
    // locationHost = 'yibais.100doc.com.cn'
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
            baseURL: domin, // api  host
            url,
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
    get(url, data) {
        return axios({
            method: 'get',
            // baseURL: 'https://cnodejs.org/api/v1',
            baseURL: domin, // api  host
            url,
            data, // get 请求时带的参数
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
    delete(url) {
        return axios({
            method: 'delete',
            // baseURL: 'https://cnodejs.org/api/v1',
            baseURL: domin, // api  host
            url,
            timeout: 60000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8',
                'agent': 'manager',
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
    }
}
