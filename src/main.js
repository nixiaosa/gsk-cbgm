/*
 * @Author: Chance Lau
 * @Date: 2021-08-12 19:12:14
 * @LastEditors: Chance Lau
 * @LastEditTime: 2021-08-18 14:23:31
 * @Description: file content
 */
import Vue from 'vue'
import 'babel-polyfill'
import './theme/element-my.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import { prototypeAddFunction } from './common/utils'
import '@/icons' // icon
import '@/permission' // 权限
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import VueQuillEditor from 'vue-quill-editor'
import VueCropper from 'vue-cropper'
import htmlToPdf from "@/utils/htmlToPdf";
// require styles
import "./assets/icon/iconfont.css"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
prototypeAddFunction(Vue)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(ElementUI)
Vue.use(VueCropper)
Vue.use(htmlToPdf)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
