import {logout} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'
import http from '@/utils/tenant'
import userapi from '@/api/login1'
import config from '../../common/config'
/* import fetch from '@/utils/fetch'
import userapi from '@/api/login1' */

const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        title: '',
        platimg: '',
        plattitle: '',
        companyid: '',
        ipLocation: false,
        identity: '',
        cmsStatistic: '',
        themeColor: '',
        caseTitleValue: '',
        caseTitleShow: '',
        videoAudit: '',
        videoStatistic: ''
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_COMPANY_CONFIG: (state, companyConfig) => {
            Object.assign(state, companyConfig)
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_TITLE: (state, title) => {
            state.title = title
        },
        SET_PLATIMG: (state, img) => {
            state.platimg = img
        },
        SET_IP_LOCATION: (state, ip) => {
            state.ipLocation = ip
        },
        SET_PLATTITLE: (state, title) => {
            state.plattitle = title
        },
        SET_COMPANYID: (state, id) => {
            state.companyid = id
        },

        SET_IDENTITY: (state, identity) => {
            state.identity = identity
        },
        SET_VIDEOAUDIT: (state, videoAudit) => {
            state.videoAudit = videoAudit
        },
        SET_VIDEOSTATISTIC: (state, videoStatistic) => {
            state.videoStatistic = videoStatistic
        },
        SET_CASETITLESHOW: (state, caseTitleShow) => {
            state.caseTitleShow = caseTitleShow
        },
        SET_CASETITLEVALUE: (state, caseTitleValue) => {
            state.caseTitleValue = caseTitleValue
        },
        SET_CMSSTATISTIC: (state, cmsStatistic) => {
            state.cmsStatistic = cmsStatistic
        },
        SET_THEMECOLOR: (state, themeColor) => {
            state.themeColor = themeColor
        }
    },

    actions: {
        SetAvatar({commit}, url) {
            return new Promise(() => {
                commit('SET_AVATAR', url)
            })
        },
        // 登录
        Login({commit}, token) {
            /* var loginbyphone = async function() {
              var params = {
                username: userInfo.phone,
                password: userInfo.password
              }
              var data = await fetch.post(userapi.login, params)
              return data
            }
            loginbyphone().then(res => {
              if (res.data.code === 0) {
                setToken(res.data.data)
                commit('SET_TOKEN', res.data.data)
                window.location.reload()
              } else {
                alert('登录有问题')
              }
            }).catch() */
            setToken(token)
            commit('SET_TOKEN', token)
        },

        // 获取用户信息
        GetInfo({commit}) {
            return new Promise((resolve) => {
                // http.get(userapi.getuserinfo, {}).then((res) => {
                let res = config.COMPANY_USER
                if (res.code === 211) {
                    removeToken()
                    window.location.reload()
                } else {
                    const data = res
                    if (data.data.nickname) {
                        commit('SET_NAME', data.data.nickname)
                    }
                    if (data.data.photo) {
                        commit('SET_AVATAR', data.data.photo)
                    }
                    if (data.data.companyId) {
                        commit('SET_COMPANYID', data.data.companyId)
                    }
                }
                resolve()
                // }).catch(error => {
                //   console.log(error, 'err---')
                //   reject(error)
                // })
            })
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        },
        SetTitle({commit}, title) {
            commit('SET_TITLE', title)
            window.document.title = title
        },
        SetCompanyConfig({commit}, config) {
            commit('SET_COMPANY_CONFIG', config)
        },
        SetPlatimg({commit}, img) {
            commit('SET_PLATIMG', img)
        },
        SetIpLocation({commit}, ip) {
            commit('SET_IP_LOCATION', ip)
        },
        SetPlattitle({commit}, title) {
            commit('SET_PLATTITLE', title)
        },
        SetIdentity({commit}, identity) {
            commit('SET_IDENTITY', identity)
        },
        SetVideoAudit({commit}, videoAudit) {
            commit('SET_VIDEOAUDIT', videoAudit)
        },
        SetVideoStatistic({commit}, videoStatistic) {
            commit('SET_VIDEOSTATISTIC', videoStatistic)
        },
        SetCaseTitleShow({commit}, caseTitleShow) {
            commit('SET_CASETITLESHOW', caseTitleShow)
        },
        SetCaseTitleValue({commit}, caseTitleValue) {
            commit('SET_CASETITLEVALUE', caseTitleValue)
        },
        SetCmsStatistic({commit}, cmsStatistic) {
            commit('SET_CMSSTATISTIC', cmsStatistic)
        },
        SetThemeColor({commit}, themeColor) {
            commit('SET_THEMECOLOR', themeColor)
        }
    }
}

export default user
