<template>
  <div class="changePawss">
    <el-form :label-position="labelPosition" label-width="90px" :model="form">
  <el-form-item label="原密码：">
    <el-input class="input400" v-model="form.password1" type="password"></el-input>
  </el-form-item>
  <el-form-item label="新密码：">
    <el-input class="input400" v-model="form.password2" type="password"></el-input>
  </el-form-item>
  <el-form-item label="确认密码：">
    <el-input class="input400" v-model="form.password3" type="password"></el-input>
  </el-form-item>
</el-form>
<div class="footer">
  <el-button @click="submit()" type="primary">确认</el-button>
  <el-button>取消</el-button>
</div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import md5 from 'js-md5'
export default {
  http,
  api,
  name: 'changePawss',
  components: {},
  data() {
    return {
      labelPosition: 'right',
      form: {
        password1: '',
        password2: '',
        password3: ''
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    // submit() {
    //   if (this.form.password1 === '' || this.form.password2 === '' || this.form.password3 === '') {
    //     this.warning('信息不能为空')
    //   } else {
    //     this.modifypassword()
    //   }
    // },
    submit() {
      const pwpattent = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/ // 8-16位大小写字母+数字
      if (this.form.password1 === '' || this.form.password2 === '' || this.form.password3 === '') {
        this.warning('信息不能为空')
      } else if (!pwpattent.test(this.form.password2)) {
        this.warning("请填写8-16位字符，必须包含大写字母、小写字母、数字；例：Aa123456")
      } else {
        this.modifypassword()
      }
    },
    modifypassword: async function() {
      let params = {
        'password': md5(this.form.password1),
        'password1': md5(this.form.password2),
        'password2': md5(this.form.password3),
        passwordSha: this.$sha256AndBase64(this.form.password1),
        password1Sha: this.$sha256AndBase64(this.form.password2)
      }
      let res = await http.post(api.modifypassword, params)
      if (res.data.code === 0) {
        this.success('修改成功')
        this.form.password1 = ''
        this.form.password2 = ''
        this.form.password3 = ''
      } else {
        this.warning(res.data.message)
      }
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
.footer{
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  margin-top: 20px;
  padding-left: 160px
}
.changePawss {
  margin-top: 60px;
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

.input200 {
  width: 100px;
}
</style>
