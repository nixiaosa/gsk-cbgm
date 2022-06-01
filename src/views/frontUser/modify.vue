<template>
  <div class="createUser">
    <div class="header">
      <el-button @click="back()" type='info'>返回</el-button>
    </div>
    <div class="createBox">
      <el-form ref="form" :model="form" label-width="90px">
        <el-form-item label="姓名：">
          <el-input class="input400" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio class="radio" v-model="form.sex" label="1">男</el-radio>
          <el-radio class="radio" v-model="form.sex" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input class="input400" v-model="form.phone" :maxlength='11'></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input class="input400" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色：" :label-width="formLabelWidth">
        <el-select class="" v-model="form.region" placeholder="请选择角色">
          <el-option label="销售代表" value="guanliyuan"></el-option>
            <el-option label="代理商" value="yunyingzongjian"></el-option>
            <el-option label="普通用户" value="yunyingjingli"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="regist()">修改</el-button>
          <el-button @click="back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'createUser',
  components: {
    http,
    api
  },
  data() {
    return {
      formLabelWidth: '90px',
      form: {
        sex: '1',
        name: '',
        phone: '',
        password: ''
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    back() {
      this.$router.back(-1)
    },
    regist: async function() {
      if (this.form.phone === '') {
        this.errorTost('手机号不能为空')
        return false
      } else if (!/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.form.phone)) {
        this.errorTost('手机号码错误')
        return false
      }
      if (this.form.password === '') {
        this.errorTost('密码不能为空')
        return false
      }
      var params = {
        username: this.form.phone,
        password: this.form.password
      }
      var res = await http.post(api.regist, params)
      if (res.code === 0) {
        this.messageTost('创建成功')
      } else {
        this.messageTost(res.message)
      }
    },
    messageTost(val) {
      // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: 'success'
      })
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.createBox {
  margin-top: 30px;
  margin-left: 20px;
}

.areaBox {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;
  margin-top: 20px;
}

.header {
  width: 90%;
  margin: 0 20px;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #ccc;
  text-align: right;
}

.el-tag {
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  margin-right: 10px;
  margin-bottom: 6px;
}

.areaTitle {
  margin-bottom: 10px;
}

.header button {
  margin-right: 40px;
}

.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input200 {
  width: 200px;
}
</style>
