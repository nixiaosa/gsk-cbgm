import fetch from '@/utils/fetch'
// let host = 'https://liveapi.cn/' // 测试API地址
// let host = 'https://30.100api.cn/' // 开发API地址
let host = 'https://api.cmalive.cn/' // 线上API地址
const href = window.location.href
if (href.indexOf('localhost') > 0 || window.location.port === '9004') {
  host = '' // 本地调试走代理
} else if (href.indexOf('.test.') > 0) {
  host = 'https://30.100api.cn/'
} else if (href.indexOf('.100live.') > 0 || href.indexOf('saas-test.') >= 0) {
  host = 'https://liveapi.cn/'
}

const companyHost = `${host}yb-company/`

export function register(username, password, companyId) {
  return fetch({
    url: `${companyHost}company/user/regist`,
    method: 'post',
    data: {
      username,
      password,
      companyId
    }
  })
}
