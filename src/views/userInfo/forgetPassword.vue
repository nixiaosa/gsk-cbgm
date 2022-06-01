<template>
  <div class="forgetPawss">
    <el-steps style="width: 600px" :active="active" finish-status="success">
      <el-step title="填写账户名"></el-step>
      <!-- <el-step title="验证身份"></el-step> -->
      <el-step title="设置新密码"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div class="martop"></div>
    <el-form style="margin-left: 60px" :rules="rules" :label-position="labelPosition" label-width="120px" :model="form" ref="form">
      <el-form-item v-show="isPhone" label="用户名：">
        <el-input class="input300" v-model="form.userName"></el-input>
      </el-form-item>
<!--       <el-form-item v-show="isPhone" label="手机号：">
        <el-input :maxlength="11" class="input300" v-model="form.phone"></el-input>
      </el-form-item> -->
      <el-form-item v-show="isCode" label="已验证手机号：">
        <span>{{form.phone}}</span>
      </el-form-item>
      <el-form-item v-show="isCode" label="验证码：">
        <el-input class="input200" v-model="form.code"></el-input>
        <el-button :disabled='isClick' type="info" @click="getCode()" style="margin-left:15px">{{codeText}}</el-button>
      </el-form-item>
      <el-form-item v-show="isPassword" label="新密码：">
        <el-input class="input300" autocomplete="new-password" v-model="form.password1" type="password"></el-input>
      </el-form-item>
      <el-form-item v-show="isPassword" label="确认密码：">
        <el-input class="input300" v-model="form.password2" type="password"></el-input>
      </el-form-item>
      <el-form-item v-show="isSuccess" label="修改成功!">
        <a @click="(hrefHome())">返回登录页</a>
      </el-form-item>
    </el-form>
    <el-button v-show="isBtn" class="input200 nextBtn" type="info" @click="submitForm('form')">下一步</el-button>
    <el-button v-show="isBtn" class="input200 nextBtn" @click="back()">返回</el-button>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import md5 from 'js-md5'
import { removeToken } from '@/utils/auth'
import { enoughLength } from '@/utils/validate'
export default {
  http,
  api,
  name: 'forgetPawss',
  components: {},
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
      labelPosition: 'right',
      isPhone: true,
      isCode: false,
      isPassword: false,
      isSuccess: false,
      isBtn: true,
      active: 0,
      isClick: false,
      codeText: '获取验证码',
      isUserName: true,
      form: {
        region: '',
        delivery: false,
        type: [],
        resource: '',
        userName: '',
        desc: '',
        phone: '',
        code: '',
        password2: '',
        password1: ''
      },
      rules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }]
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    getphone: async function() {
      var params = {
        username: this.form.userName
      }
      var res = await http.post(api.getphone, params)
      if (res.data.code === 0) {
        this.form.phone = res.data.data
        this.isPhone = false
        this.isCode = true
        this.isPassword = true
        this.active++
      } else {
        alert('用户名不存在')
      }
    },
    submitForm() {
      const pwpattent = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/ // 8-16位大小写字母+数字
      if (this.active === 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.getphone()
          }
        })
      } else if (this.active === 1) {
        if (this.form.code === '') {
          alert('验证码不能为空')
        } else if (String(this.form.code).length !== 4) {
          alert('验证码位数不对')
        } else if (this.form.password1.length === 0 || this.form.password2.length === 0) {
          alert('密码不能为空')
        } else if (!pwpattent.test(this.form.password2)) {
          alert('请填写8-16位字符，必须包含大写字母、小写字母、数字；例：Aa123456')
        } else {
          this.forget()
        }
      }
    },
    back() {
      this.$router.push({ path: '/login' })
    },
    hrefHome() {
      removeToken()
      this.$router.push({ path: '/login' })
    },
    forget: async function() {
      // this.active++
      var params = {
        checkCode: this.form.code,
        password1: md5(this.form.password1),
        password2: md5(this.form.password2),
        username: this.form.userName,
        phone: this.form.phone,
        password1Sha: this.$sha256AndBase64(this.form.password1)
      }
      var res = await http.post(api.forgetypassword, params)
      if (res.data.code === 0) {
        this.active++
        this.isBtn = false
        this.isPassword = false
        this.isSuccess = true
        this.isCode = false
      } else {
        this.error('修改失败：' + res.data.message)
      }
    },
    sendcode: async function() {
      var params = {
        username: this.form.userName
      }
      var res = await http.post(api.namesendcode, params)
      if (res.data.code === 0) {
        this.success('发送成功')
      }
    },
    /**
     * 验证用户名是否存在
     */
    exist: async function() {
      var params = {
        username: this.form.userName
      }
      var res = await http.post(api.exist, params)
      if (res.data.data !== true) {
        this.error('用户名不存在')
      } else {
        this.active++
        this.isPhone = false
        this.isCode = true
      }
    },
    getCode() {
      this.sendcode()
      var num = 60
      var _this = this
      _this.isClick = true
      _this.codeText = '60秒后重新获取'
      var timer = setInterval(function() {
        num--
        _this.codeText = num + '秒后重新获取'
        if (num === 0) {
          _this.codeText = '获取验证码'
          _this.isClick = false
          clearInterval(timer)
        }
      }, 1000)
    },
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    },

    warning(val) {
      this.$message({
        message: val,
        type: 'warning'
      })
    },

    error(val) {
      this.$message.error(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.forgetPawss {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 500px;
  margin: 100px auto 0;
}
.nextBtn {
  margin-left: 240px;
}
.martop {
  margin-top: 50px;
}
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input800 {
  width: 800px;
}
.input300 {
  width: 300px;
}
.input200 {
  width: 100px;
}
</style>
