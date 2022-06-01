<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <!-- <img class="logo-img" :src="platimg" alt=""> -->
        <!-- <div class="logo-title">{{plattitle}}</div> -->
        <levelbar></levelbar>
        <!-- <div class="left-welcome" v-if="name">{{name}}</div> -->
        <!-- <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img class="user-avatar"
                     :src="avatar?avatar:'http://poster-1252497236.cosbj.myqcloud.com/ebai/1c306077-4543-4ee5-8785-be08d697091c.jpeg'">
                <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
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
        </el-dropdown> -->
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
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        background-color: #F5F5F5;

        .hamburger-container {
            outline: none;
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }

        .logo-img {
            float: left;
            // width: 88px;
            height: 40px;
            margin-top: 3px;
            margin-left: 10px;
            border-radius: 10px;
        }

        .logo-title {
            float: left;
            height: 50px;
            line-height: 50px;
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
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 120px;
        }

        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;

            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    margin-right: 30px;
                }

                .el-submenu__icon-arrow {
                    position: absolute;
                    right: 10px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>

