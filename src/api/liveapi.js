// var upimgurl = process.env.NODE_ENV.indexOf('development') >= 0 ? '//' + process.env.BASE_API + '/api30/yibai-web/vms/asset/file' : '/api30/yibai-web/vms/asset/file'
// var upxlsurl = process.env.NODE_ENV.indexOf('development') >= 0 ? '//' + process.env.BASE_API + 'jxhh.100doc.com.cn/api30/yibai-web-company/company/organization/upload/' : '/api30/yibai-web-company/company/organization/upload/'
// var upvideourl = process.env.NODE_ENV.indexOf('development') >= 0 ? '//' + process.env.BASE_API + 'jxhh.100doc.com.cn/api30/yibai-web/vms/getsignature' : '/api30/yibai-web/vms/getsignature'

// let host = 'https://30.100api.cn/' // 开发API地址
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
// const vmsHost = `${host}yb-vms/`
const vmsHost = `${host}yb-vms-api/`

export default {
  upimgurl: `${vmsHost}vms/asset/file`,
  upxlsurl: `${companyHost}company/organization/upload/`,
  upvideourl: `${vmsHost}vms/getsignature`
}
