// let host = 'https://30.100api.cn/' // 开发API地址
// let host = 'https://api.cmalive.cn/' // 开发API地址
// let host = 'https://liveapi.cn/' // 测试API地址
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
const djbcompanyHost = `${host}djb_company/yb-user-api/`

export default {
  login: `${companyHost}company/user/login`, // 登录
  loginOut: `${companyHost}company/user/logout`, // 退出
  getcompanyconf: `${djbcompanyHost}company/config/get`, // 得到租户信息
  getuserinfo: `${companyHost}company/user/`, // 得到后台用户信息
  updateinfo: `${companyHost}company/user/update` // 更新个人信息
}
