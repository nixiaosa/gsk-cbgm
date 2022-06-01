import { asyncRouterMap, constantRouterMap, asyncRouter404 } from '@/router/index'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) { // 判断是否有权限
  if (route.role) {
    return roles.some(role => route.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 递归过滤异步路由表，对比个人菜单树进行排序(1级排序)与name修改，返回重新整理的异步路由表
 * @param asyncRouterMap
 * @param roles
 */
function createUserAsyncRouter(asyncRouterMap, menuData) {
  var userAsyncMenu = []
  for (var i = 0; i < menuData.length; i++) {
    for (var j = 0; j < asyncRouterMap.length; j++) {
      if (asyncRouterMap[j].sign === menuData[i].front) {
        asyncRouterMap[j].name = menuData[i].label
        var menuList2 = createUserAsyncRouter2(asyncRouterMap[j].children, menuData[i].childs)
        asyncRouterMap[j].children = menuList2
        userAsyncMenu.push(asyncRouterMap[j])
      }
    }
  }
  return userAsyncMenu
}

/**
 * 递归二级异步路由表，对比个人菜单树name修改，返回重新整理二级异步路由表
 * @param asyncRouterMap
 * @param roles
 */
function createUserAsyncRouter2(asyncRouterMap, menuData) {
  var routerArr = []
  for (var i = 0; i < menuData.length; i++) {
    for (var j = 0; j < asyncRouterMap.length; j++) {
      if (asyncRouterMap[j].sign === menuData[i].menu.front) {
        asyncRouterMap[j].name = menuData[i].menu.label
        routerArr.push(asyncRouterMap[j])
      }
    }
  }
  for (var k = 0; k < asyncRouterMap.length; k++) {
    if (!asyncRouterMap[k].sign) {
      routerArr.push(asyncRouterMap[k])
    }
  }
  return routerArr
}

/**
 * 获取用户的权限列表
 * @param menuData
 */
function getUserAuth(menuData) {
  var authArr = []
  var authObj = {}
  for (var i = 0; i < menuData.length; i++) {
    var childs = menuData[i].childs
    for (var j = 0; j < childs.length; j++) {
      if (childs[j].buttons) {
        for (var k = 0; k < childs[j].buttons.length; k++) {
          authArr.push(childs[j].buttons[k].front)
          authObj[childs[j].buttons[k].front] = true
        }
      } else {
        authArr.push(childs[j].menu.front)
        authObj[childs[j].menu.front] = true
      }
    }
  }
  return [authArr, authObj]
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    userAuths: [],
    service: 1,
    existBusiness: [],
    serviceType: 'train/',
    businessTrain: false, // 业务1
    businessClass: false, // 业务2
    businessOnlineOpenClass: false, // 业务3
    businessAcademicConFerence: false, // 业务4
    businessInteractionOpenClass: false, // 业务5
    businessJbktWh: false // 业务9
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_SERVICE: (state, num) => {
      state.service = num
    },
    SET_EXIST_BUSINESS: (state, array) => {
      var arr = []
      for (var i = 0; i < array.length; i++) {
        switch (array[i]) {
          case '1':
            arr.push({ 'businessId': '1', 'businessName': '店员培训' })
            break
          case '2':
            arr.push({ 'businessId': '2', 'businessName': '空中课堂' })
            break
          case '3':
            arr.push({ 'businessId': '3', 'businessName': '互动公开课' })
            break
          case '4':
            arr.push({ 'businessId': '4', 'businessName': '线上公开课' })
            break
          case '5':
            arr.push({ 'businessId': '5', 'businessName': '学术会议' })
            break
          case '8':
            arr.push({ 'businessId': '8', 'businessName': '病例征集' })
            break
          case '9':
            arr.push({ 'businessId': '9', 'businessName': '互动课堂' })
            break
        }
      }
      state.existBusiness = arr
    },
    SET_SERVICETYPE: (state, num) => {
      if (num === 1) {
        state.serviceType = 'train/'
      } else if (num === 2) {
        state.serviceType = 'classroom/'
      }
    },
    SET_AUTHS: (state, userAuths) => {
      state.userAuths = userAuths
    },
    SET_BS_TRAIN: (state, bool) => { // 判断是否有空中课堂业务
      state.businessTrain = bool
    },
    SET_BS_CLASS: (state, bool) => { // 判断是否有店员培训业务
      state.businessClass = bool
    },
    SET_BS_INTER_ACTION_OPEN_CLASS: (state, bool) => { // 判断是否有互动公开课业务
      state.businessInteractionOpenClass = bool
    },
    SET_BS_ONLINE_OPEN_CLASS: (state, bool) => { // 判断是否有线上公开课
      state.businessOnlineOpenClass = bool
    },
    SET_BS_ACADEMIC_CON_FERENCE: (state, bool) => { // 判断是否有学术会议
      state.businessAcademicConFerence = bool
    },
    SET_BS_JBKT_WH: (state, bool) => {
      state.businessJbktWh = bool
    }
  },
  actions: {
    GenerateRoutes({ commit }, menuData) {
      return new Promise((resolve) => {
        var userMenu1 = createUserAsyncRouter(asyncRouterMap, menuData) // 生成用户的一级菜单（其中二级未排序），修改name以及去掉没有权限的菜单
        var [authArr, authObj] = getUserAuth(menuData) // 获取用户的权限列表
        const accessedRouters = filterAsyncRouter(userMenu1, authArr).concat(asyncRouter404)
        commit('SET_AUTHS', authObj)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    GenerateBusinessRouter({ commit }, array) {
      return new Promise((resolve) => {
        commit('SET_SERVICE', array[0])
        commit('SET_SERVICETYPE', array[0])
        commit('SET_EXIST_BUSINESS', array)
        for (var i = 0; i < array.length; i++) {
          switch (array[i]) {
            case '1':
              commit('SET_BS_TRAIN', true)
              break
            case '2':
              commit('SET_BS_CLASS', true)
              break
            case '3':
              commit('SET_BS_INTER_ACTION_OPEN_CLASS', true)
              break
            case '4':
              commit('SET_BS_ONLINE_OPEN_CLASS', true)
              break
            case '5':
              commit('SET_BS_ACADEMIC_CON_FERENCE', true)
              break
            case '9':
              commit('SET_BS_JBKT_WH', true)
              break
          }
        }
        resolve()
      })
    }
  }
}

export default permission
