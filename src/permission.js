import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  getToken,
  removeToken
} from '@/utils/auth' // 验权
import http from '@/utils/tenant'
import userapi from '@/api/login1'
import menuapi from '@/api/quan2'
import menuapi1 from '@/api/tenantInfoSave'

const whiteList = ['/login', '/forgetPassword', '/404']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else {
      if (store.getters.addRouters.length === 0) { // 判断异步路由是否有
        /* store.dispatch('GetInfo').then(res => {
          const roles = res.data.role
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to })
          })
        }) */
        var num = 1
        if (num === 1) {
          store.dispatch('GetInfo')
        }
        if (!store.getters.title) {
          const getcompanyconf = async function () { // 获取租户信息
            var params = {}
            const res = await http.post(userapi.getcompanyconf, params)
            if (res.data.code === 211) {
              removeToken()
              window.location.reload()
            }
            return res
          }
          getcompanyconf().then(result => {
            if (result) {
              store.dispatch('SetTitle', result.data.data.platomName + '后台管理')
              store.dispatch('SetCompanyConfig', result.data.data)
              store.dispatch('SetPlatimg', result.data.data.logoUrl)
              store.dispatch('SetPlattitle', result.data.data.platomName)
              // SetIpLocation
              // if (result.data.data.ip === '1') {
              //   store.dispatch('SetIpLocation', true)
              // }
              store.dispatch('SetIpLocation', result.data.data.ip)
              store.dispatch('SetIdentity', result.data.data.identity)
              store.dispatch('SetVideoAudit', result.data.data.videoAudit)
              store.dispatch('SetVideoStatistic', result.data.data.videoStatistic)
              store.dispatch('SetCaseTitleShow', result.data.data.caseTitleShow)
              store.dispatch('SetCaseTitleValue', result.data.data.caseTitleValue)
              store.dispatch('SetCmsStatistic', result.data.data.cmsStatistic)

              store.dispatch('SetThemeColor', result.data.data.themeColor)
              // console.log("lclc",result.data.data.themeColor)
            }
          }).catch()
        }




        var getmenu = async function() { // 获取登录用户菜单
          var params = {}
          const res = await http.post(menuapi.getMenu, params)
          var data = res.data.data
          // var arrays = ['basic_information_view', 'back_user_list', 'back_role_list', 'back_auth_list', 'front_user_list', 'navigation_list', 'friend_link_list', 'ad_list', 'banner_list', 'column_list', 'article_list', 'classroom_list', 'classroom_fortune_bag_list', 'classroom_questionnaire_list', 'classroom_comment_list', 'classroom_activity_list', 'classroom_reward_list', 'train_list', 'train_fortune_bag_list', 'train_questionnaire_list', 'train_comment_list', 'train_activity_list', 'train_reward_list', 'academic_conference_list', 'convention_list', 'academic_conference_fortune_bag_list', 'academic_conference_questionnaire_list', 'academic_conference_comment_list', 'academic_conference_activity_list', 'academic_conference_reward_list', 'online_class_list', 'online_class_fortune_bag_list', 'online_class_questionnaire_list', 'online_class_comment_list', 'online_class_activity_list', 'online_class_reward_list', 'interact_class_list', 'interact_class_fortune_bag_list', 'interact_class_questionnaire_list', 'interact_class_comment_list', 'interact_class_activity_list', 'interact_class_reward_list', 'integral_list', 'statistics_website', 'statistics_content', 'statistics_realtime', 'payment_manage', 'order_manage']
          store.dispatch('GenerateRoutes', data).then(() => {
            router.addRoutes(store.getters.addRouters)
            next({ ...to })
          })
        }
        // var getmenu = async function (obj) { //新版导航需要根据getMenu接口返回值判断新老从而截取字段显示
        //   var res = await http.post(menuapi1.getVersion);
        //   if (res.data.code === 0) {
        //     if (res.data.data.webversion == 1) {
        //       var params = {}
        //       const res2 = await http.post(menuapi.getMenu, params)
        //       obj = res2.data.data
        //       var itemChild = []
        //       obj.map(item => {
        //         if (item.id == 11) {
        //           for (var i = 0; i < item.childs.length; i++) {
        //             if (item.childs[i].menu.id == 12) { //12为老版导航
        //               item.childs.splice(i, 1)
        //             }
        //           }
        //         }
        //       })
        //       store.dispatch('GenerateRoutes', obj).then(() => {
        //         router.addRoutes(store.getters.addRouters)
        //         next({
        //           ...to
        //         })
        //       })
        //     } else {

        //       var params = {}
        //       const res2 = await http.post(menuapi.getMenu, params)
        //       obj = res2.data.data
        //       var itemChild = []
        //       obj.map(item => {
        //         if (item.id == 11) {
        //           for (var i = 0; i < item.childs.length; i++) {
        //             if (item.childs[i].menu.id == 113) { //113为新版导航
        //               item.childs.splice(i, 1)
        //             }
        //           }
        //         }
        //       })
        //       store.dispatch('GenerateRoutes', obj).then(() => {
        //         router.addRoutes(store.getters.addRouters)
        //         next({
        //           ...to
        //         })
        //       })


        //     }
        //   }

        // }
        var getService = async function () {
          var params = {}
          const res = await http.post(menuapi1.getService, params)
          if (res.data.code === 0) {
            // var num = Number(res.data.data[0].businessId)
            var array = []
            for (var i = 0; i < res.data.data.length; i++) {
              array.push(res.data.data[i].businessId)
            }
            store.dispatch('GenerateBusinessRouter', array)
          }
        }
        getService().then(() => {
          getmenu()
        })
        /* store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(store.getters.addRouters)
          next({ ...to })
        }) */
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
