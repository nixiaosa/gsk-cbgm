import {Api} from "@/api/api";
import http from '../utils/fetch';
import { sha256AndBase64 } from '../utils/index'
export function prototypeAddFunction(Vue) {
    Vue.prototype.$api = Api
    Vue.prototype.$http = http
    Vue.prototype.$sha256AndBase64 = sha256AndBase64
    Vue.prototype.$praseStrNull = function(str) {
        if (str === '') {
            return null
        }
        return str
    }
    // eslint-disable-next-line no-extend-native
    Date.prototype.Format = function(fmt) {
        var o = {
            'M+': this.getMonth() + 1, // 月份
            'd+': this.getDate(), // 日
            'h+': this.getHours(), // 小时
            'm+': this.getMinutes(), // 分
            's+': this.getSeconds(), // 秒
            'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
            'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
        return fmt
    }
}
