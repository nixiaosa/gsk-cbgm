<template>
    <el-menu class="tophead" mode="horizontal">
        <div class="logo-img-wraper">
            <img class="logo-img" :src="platimg" alt="">
        </div>
       
        <!-- <img class="logo-img" src="../../assets/yibai-logo.png"> -->
        <div class="logo-title">{{plattitle}}</div>
        <!-- <div class="left-welcome" v-if="name">{{name}}</div> -->
        <el-dropdown class="avatar-container" trigger="click">
            <div class="fn-clearfix">
                <div class="left-welcome" v-if="name">{{name}}
                    <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
                </div>
                <div class="avatar-wrapper">
                    <img class="user-avatar"
                        :src="avatar?avatar:'http://poster-1252497236.cosbj.myqcloud.com/ebai/1c306077-4543-4ee5-8785-be08d697091c.jpeg'">
                    <!-- <i class="el-submenu__icon-arrow el-icon-arrow-down"></i> -->
                </div>
            </div>
            
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <router-link class='inlineBlock' to="/">
                    <el-dropdown-item>
                        主页
                    </el-dropdown-item>
                </router-link>
                <router-link class='inlineBlock' to="/userInfo/index">
                    <el-dropdown-item>
                        个人信息
                    </el-dropdown-item>
                </router-link>
                <router-link class='inlineBlock' to="/userInfo/changePass">
                    <el-dropdown-item>
                        修改密码
                    </el-dropdown-item>
                </router-link>
                <el-dropdown-item divided><span @click="logout" style="display:block;">退出</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Levelbar from './Levelbar'
    import Hamburger from '@/components/Hamburger'
    import http from '@/utils/fetch'
    import userapi from '@/api/login1'
    import {removeToken} from '@/utils/auth'

    export default {
        components: {
            Levelbar,
            Hamburger
        },
        computed: {
            ...mapGetters([
                'sidebar',
                'avatar',
                'platimg',
                'plattitle',
                'name'
            ])
        },
        methods: {
            toggleSideBar() {
                this.$store.dispatch('ToggleSideBar')
            },
            logout: async function () {
                var params = {}
                await http.post(userapi.loginOut, params)
                removeToken()
                location.reload()
                /* this.$store.dispatch('LogOut').then(() => {
                  location.reload()  // 为了重新实例化vue-router对象 避免bug
                }) */
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.fn-clearfix {
  clear: both;
  &:after{
    content: "";
    display: block;
    width: 100%;
    height: 0;
    overflow: hidden;
    clear: both;
  }
}
    .tophead {
        display: none;
        width: 100%;
        height: 72px;
        line-height: 72px;
        background-color: #fff;
        z-index: 1002;
        position: fixed;
        top: 0px;
        bottom: 0;
        left: 0;
        // box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    
        .hamburger-container {
            outline: none;
            line-height: 58px;
            height: 72px;
            float: left;
            padding: 0 10px;
        }

        .logo-img-wraper{
            float: left;
            display: flex;
            width: 240px;
            height: 72px;
            overflow: hidden;
            align-items:center;
            justify-content: center;
            // box-sizing: border-box;
            img{
                max-height: 54px;
                max-width: 100%;
            }
        }

        // .logo-img {
        //     float: left;
        //     // width: 162px;
        //     // height: 32px;
        //     height: 54px;
        //     // margin: 20px 45px 0 38px;
        // }

        .logo-title {
            float: left;
            height: 72px;
            line-height: 72px;
            margin-left: 15px;
            margin-right: 15px;
            font-weight: 500;
        }

        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }

        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }

        .left-welcome {
            position: relative;
            display: block;
            height: 72px;
            line-height: 72px;
            float: right;
            font-size: 14px;
            padding-right: 48px;
            .el-submenu__icon-arrow {
                position: absolute;
                right: 24px;
                top: 38px;
                font-size: 12px;
            }
        }

        .avatar-container {   
            height: 72px;
            display: block;
            float: right;
            // position: absolute;
            // right: 35px;

            .avatar-wrapper {
                cursor: pointer;
                margin-top: 18px;
                // position: relative;
                float: right;

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 8px;
                }
            }
        }
    }
</style>

