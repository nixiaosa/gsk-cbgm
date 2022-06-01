<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">{{platname}}运营管理中心</h3>
       <el-form-item prop="phone">
        <span class="svg-container svg-container_login">
          <icon-svg icon-class="yonghuming" />
        </span>
        <el-input name="phone" type="text" v-model="loginForm.phone" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <icon-svg icon-class="mima" ></icon-svg>
        </span>
        <el-input name="password" type="password" @keyup.13.native.prevent='handleLogin' v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
      </el-form-item>
      <div class="forget">
        <router-link to="/forgetPassword" class="forget-password">忘记密码</router-link>
      </div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import http from '@/utils/fetch'
import http from '@/utils/tenant'
import userapi from '@/api/login1'
import md5 from 'js-md5'
import { enoughLength } from '@/utils/validate'
import { validatePass } from '@/utils/validatefun'
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      /* if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else  */
      if (!enoughLength(value, 5)) {
        callback(new Error('用户名不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      loginRules: {
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      platname: '医百'
    }
  },
  methods: {
    handleLogin: async function() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login()
        }
      })
    },
    login: async function() {
      var params = {
        username: this.loginForm.phone,
        password: md5(this.loginForm.password),
        passwordSha: this.$sha256AndBase64(this.loginForm.password)
       // password: this.loginForm.password
      }
      this.loading = true
      const res = await http.post(userapi.login, params)
      if (res.data.code === 0) {
        this.$store.dispatch('Login', res.data.data)
        this.loading = false
        this.$router.push({ path: '/' })
      } else {
        // alert('登录失败')
        alert(res.data.message)
        this.loading = false
        return false
      }
    },
    getcompanyconf: async function() {
      var params = {}
      const res = await http.post(userapi.getcompanyconf, params)
      if (res.data.code === 0) {
        this.platname = res.data.data.platomName
        window.document.title = res.data.data.platomName + '后台管理'
      }
    }
  },
  mounted() {
    this.getcompanyconf()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    @include relative;
    height: 100vh;
    background-color: $bg;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
  .forget{
    color:green;
    margin-top:20px;
    margin-bottom:20px;
  }
</style>
