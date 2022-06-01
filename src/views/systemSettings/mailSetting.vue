<template>
  <div class="smsSetting">
    <div class="smsBox">
      <el-form :model="mailForm" ref="mailForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="邮件服务器host：" prop="gateway" label-width="160px">
          <el-input class="input400" type="gateway" v-model="mailForm.host"></el-input>
        </el-form-item>
        <el-form-item label="邮件服务器port：" prop="port" label-width="160px">
          <el-input class="input400" type="port" v-model="mailForm.port"></el-input>
        </el-form-item>
        <el-form-item label="邮件服务器user：" prop="account" label-width="160px">
          <el-input class="input400" type="account" v-model="mailForm.user"></el-input>
        </el-form-item>
        <el-form-item label="邮件服务器passwors：" prop="password" label-width="160px">
          <el-input class="input400" type="text" v-model="mailForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'smsSetting',
  components: {
  },
  data() {
    return {
      mailForm: {
        id_1: '',
        id_2: '',
        id_3: '',
        id_4: '',
        host: '',
        port: '',
        user: '',
        password: ''
      }
    }
  },
  computed: {
  },
  mounted() {
    this.mailList()
  },
  methods: {
    smsHandle: async function() {
      var params = [
        {
          'description': '邮件服务器host',
          'id': this.mailForm.id_1,
          'name': 'email_host',
          'value': this.mailForm.host
        },
        {
          'description': '邮件服务器port',
          'id': this.mailForm.id_2,
          'name': 'email_port',
          'value': this.mailForm.port
        },
        {
          'description': '邮件服务器user',
          'id': this.mailForm.id_3,
          'name': 'email_user',
          'value': this.mailForm.user
        },
        {
          'description': '邮件服务器passwors',
          'id': this.mailForm.id_4,
          'name': 'email_password',
          'value': this.mailForm.password
        }
      ]
      var res = await http.post(api.smsHandle, params)
      if (res.data.code === 0) {
        this.messageTost('提交成功')
      } else {
        this.errorTost(res.data.message)
      }
    },
    submitForm() {
      if (this.mailForm.host === '' || this.mailForm.port === '' || this.mailForm.user === '' || this.mailForm.password === '') {
        this.errorTost('表单选项不能为空')
        return false
      }
      this.smsHandle()
    },
    mailList: async function() {
      var params = {
        'name': 'email_'
      }
      var res = await http.post(api.smsList, params)
      if (res.data.code === 0) {
        this.mailForm.id_1 = res.data.data[0].id
        this.mailForm.id_2 = res.data.data[1].id
        this.mailForm.id_3 = res.data.data[2].id
        this.mailForm.id_4 = res.data.data[3].id
        this.mailForm.host = res.data.data[0].value
        this.mailForm.port = res.data.data[1].value
        this.mailForm.user = res.data.data[2].value
        this.mailForm.password = res.data.data[3].value
        this.messageTost('获取成功')
      } else {
        this.errorTost(res.data.message)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    errorTost(val) { // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    },
    messageTost(val) { // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: 'success'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.smsBox{
  margin-top: 60px;
}
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input200 {
  width: 100px
}
</style>
