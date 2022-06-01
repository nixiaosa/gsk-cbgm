// let host = 'https://30.100api.cn/' // 线上API地址
// let host = 'https://liveapi.cn/' // 测试API地址
let host = 'https://api.cmalive.cn/' // 开发API地址
const href = window.location.href
if (href.indexOf('localhost') > 0 || window.location.port === '9004') {
  host = '' // 本地调试走代理
} else if (href.indexOf('.test.') > 0) {
  host = 'https://30.100api.cn/'
} else if (href.indexOf('.100live.') > 0 || href.indexOf('saas-test.') >= 0) {
  host = 'https://liveapi.cn/'
}

const adminHost = `${host}admin/`

export default {
  addMenuAdmin: `${adminHost}auth/menuresource/add`, // 增加资源
  getMenuAdmin: `${adminHost}auth/menu/list`, // 得到资源树
  deleteMenuAdmin: `${adminHost}auth/menuresource/delete`, // 删除权限
  addAuth: `${adminHost}auth/auth/add`, // 增加权限
  getAuthList: `${adminHost}auth/auth/list`, // 得到权限树
  createLink: `${adminHost}auth/authmenu/add`, // 建立连接
  addrole: `${adminHost}auth/role/add`, // 增加角色
  getRoleList: `${adminHost}auth/role/list`, // 获得角色列表
  roleAndAuth: `${adminHost}auth/roleauth/add`, // 角色权限关联
  authidlist: `${adminHost}auth/role/authidlist`, // 得到角色对应权限
  getuserlist: `${adminHost}user/list`, // 获得用户列表
  adduser: `${adminHost}user/regist`, // 增加用户
  getUserRole: `${adminHost}auth/user/roleidlist`, // 获取用户的角色
  userVsRole: `${adminHost}auth/userrole/add`, // 用户角色关联
  getMenu: `${adminHost}auth/menu/get` // 获取登录用户菜单
}
