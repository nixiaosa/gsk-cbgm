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
const ybWebHost = `${host}yibai-web/`

export default {
  right: '/topic/5433d5e4e737cbe96dcef312', // 正确路径
  error: '/topc/5433d5e4e737cbe96dcef312', // url错误
  backEnd: '/topic/5433d5e4e737cbe96dcef31', // 参数错误
  regist: `${ybWebHost}user/regist`, // 注册
  regist1: '/demo/?service=User.userReg', // 注册1
  login: `${ybWebHost}user/login`, // 登录
  usermessage: `${ybWebHost}user/`, // 保存 修改
  logout: `${ybWebHost}user/logout`, // 退出登录
  codeLogin: `${ybWebHost}user/weixin/wxOauthCallback`, // 微信登陆code
  weipay: `${ybWebHost}pay/wxUnifiedorder`, // 微信支付,
  createProgram: `${companyHost}manager/program/create`, // 创建视频 修改
  // getuploadurl: '/api30/vms/asset/getuploadurl?isDrm=false`, // 获取视频上传地址，  fileKey
  queryProgram: `${companyHost}manager/program/myList`, // 查询视频列表 修改
  querylive: `${companyHost}manager/live/myList  `, // 查询视频列表 修改
  getProgram: `${companyHost}manager/program/get/`, // 回显视频信息 修改
  getProgramPlaybackURL: `${companyHost}manager/program/playbackURL/`, // 播放地址 修改
  livePlaybackURL: `${companyHost}manager/live/playbackURL/`, // 播放地址 修改
  updateProgram: `${companyHost}manager/program/update`, // 更新视频信息         修改
  create: `${companyHost}manager/live/create`// 创建直播
}
