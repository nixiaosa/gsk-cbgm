<template>
  <div class="smsSetting">
    <div class="smsBox">
      <el-form :model="smsForm" ref="smsForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="appId：" prop="gateway">
          <el-input class="input400" type="gateway" v-model="smsForm.appId"></el-input>
        </el-form-item>
        <el-form-item label="appKey：" prop="suffix">
          <el-input class="input400" type="suffix" v-model="smsForm.appKey"></el-input>
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
      smsForm: {
        id_1: '',
        id_2: '',
        appId: '',
        appKey: ''
      }
    }
  },
  computed: {
  },
  mounted() {
    this.smsList()
  },
  methods: {
    smsHandle: async function() {
      var params = [
        {
          'description': '短信服务器appid',
          'id': this.smsForm.id_1,
          'name': 'sms_appid',
          'value': this.smsForm.appId
        },
        {
          'description': '短信服务器appkey',
          'id': this.smsForm.id_2,
          'name': 'sms_appkey',
          'value': this.smsForm.appKey
        }
      ]
      var res = await http.post(api.smsHandle, params)
      if (res.data.code === 0) {
        this.messageTost('提交成功')
      } else {
        this.errorTost(res.data.message)
      }
    },
    smsList: async function() {
      var params = {
        'name': 'sms_'
      }
      var res = await http.post(api.smsList, params)
      if (res.data.code === 0) {
        this.smsForm.id_1 = res.data.data[0].id
        this.smsForm.id_2 = res.data.data[1].id
        this.smsForm.appId = res.data.data[0].value
        this.smsForm.appKey = res.data.data[1].value
        this.messageTost('获取成功')
      } else {
        this.errorTost(res.data.message)
      }
    },
    submitForm() {
      if (this.smsForm.appId === '') {
        this.errorTost('appId不能为空')
        return false
      }
      if (this.smsForm.appKey === '') {
        this.errorTost('appKey不能为空')
        return false
      }
      this.smsHandle()
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

<style scoped>
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
