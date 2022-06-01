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
const adminHost = `${host}admin/`

export default {
  addMenuAdmin: `${adminHost}/company/auth/menuresource/add`, // 增加资源 4
  getMenuAdmin: `${adminHost}/company/auth/menu/list`, // 得到资源树 3
  deleteMenuAdmin: `${adminHost}/company/auth/menuresource/delete`, // 删除权限 5
  addAuth: `${adminHost}/company/auth/auth/add`, // 增加权限 1
  getAuthList: `${adminHost}/company/auth/auth/lists`, // 得到二级权限树 1
  getAuthListtwo: `${companyHost}company/auth/auth/list`, // 得到两层权限树 1
  createLink: `${adminHost}/company/auth/authmenu/add`, // 建立连接 2
  addrole: `${companyHost}company/auth/role/add`, // 增加角色 1
  getRoleList: `${companyHost}company/auth/role/list`, // 获得角色列表 1
  roleAndAuth: `${companyHost}company/auth/roleauth/add`, // 角色权限关联 1
  authidlist: `${companyHost}company/auth/role/authidlist`, // 得到角色对应权限
  getuserlist: `${adminHost}/user/list`, // 获得用户列表
  adduser: `${adminHost}/user/regist`, // 增加用户
  getUserRole: `${adminHost}/auth/user/roleidlist`, // 获取用户的角色
  userVsRole: `${adminHost}/auth/userrole/add`, // 用户角色关联
  getMenu: `${companyHost}company/auth/menu/get`, // 获取登录用户菜单
  delrole: `${companyHost}company/auth/role/delete` // 删除角色
}
