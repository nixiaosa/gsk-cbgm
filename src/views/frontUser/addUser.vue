<template>
  <div class="createUser">
    <div class="header">
      <el-button @click="back()" type='info'>返回</el-button>
    </div>
    <div class="createBox">
      <el-form ref="form" :model="form" label-width="90px">
        <!-- <el-form-item label="姓名：">
          <el-input class="input400" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio class="radio" v-model="radio" label="1">男</el-radio>
          <el-radio class="radio" v-model="radio" label="2">女</el-radio>
        </el-form-item> -->
        <el-form-item label="手机号：">
          <el-input class="input400" v-model="form.phone" :maxlength='11'></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input class="input400" v-model="form.password"></el-input>
        </el-form-item>
        <!-- <el-form-item label="权限：">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
         </el-checkbox-group>
        </el-form-item> -->
        <!-- <el-form-item label="活动区域：">
          <el-select class="" v-model="form.region" placeholder="请选择活动区域">
            <el-option label="系统管理员" value="guanliyuan"></el-option>
            <el-option label="运营总监" value="yunyingzongjian"></el-option>
            <el-option label="运营经理" value="yunyingjingli"></el-option>
            <el-option label="销售总监" value="xiaoshouzongjian"></el-option>
            <el-option label="销售经理" value="xiaoshoujingli"></el-option>
            <el-option label="财务总监" value="caiwuzongjian"></el-option>
            <el-option label="财务经理" value="caiwujingli"></el-option>
            <el-option label="运营经理" value="yunyingjingli"></el-option>
            <el-option label="运营专员" value="yunyingzhuanyuan"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="负责区域：">
          <el-button type="info" @click="dialogVisible = true">选择区域</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="regist()">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="选择区域" :visible.sync="dialogVisible" size="small" :before-close="handleClose">
        <div class="areaBox">
          <div class="areaTitle">
            <el-tag :type="gray" color='#fff' @click.native.prevent="areatitleStyle()">山东</el-tag>
          </div>
          <el-tag :type="area.type" :color="area.color" v-for="(area,$index) in areaList" :key="area.name" @click.native.prevent="selectStyle($index)">{{area.name}}</el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
      checkList: ['选中且禁用', '复选框 A'],
      abc: 'success',
      dialogVisible: false,
      gray: 'gray',
      radio: '1',
      areaList: [
        { name: '济宁', id: 21, type: 'gray', color: '#FFF' },
        { name: '青岛', id: 21, type: 'gray', color: '#FFF' },
        { name: '临沂', id: 21, type: 'gray', color: '#FFF' },
        { name: '泰安', id: 21, type: 'gray', color: '#FFF' },
        { name: '济宁', id: 21, type: 'gray', color: '#FFF' },
        { name: '青岛', id: 21, type: 'gray', color: '#FFF' },
        { name: '临沂', id: 21, type: 'gray', color: '#FFF' }
      ],
      form: {
        name: '',
        region: '',
        phone: '',
        password: ''
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    areatitleStyle() {
      var arearList = JSON.parse(JSON.stringify(this.areaList))
      for (var i = 0; i < arearList.length; i++) {
        if (this.gray === 'gray') {
          this.areaList[i].type = 'primary'
        } else {
          this.areaList[i].type = 'gray'
        }
      }
      this.gray = this.gray === 'primary' ? 'gray' : 'primary'
    },
    selectStyle(index) {
      this.gray = 'gray'
      this.areaList[index].type = this.areaList[index].type === 'primary' ? 'gray' : 'primary'
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    back() {
      this.$router.back(-1)
    },
    regist: async function() {
      if (this.form.phone === '') {
        this.errorTost('手机号不能为空')
        return false
      } else if (!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(this.form.phone))) {
        this.errorTost('手机号码错误')
        return false
      }
      if (this.form.password === '') {
        this.errorTost('密码不能为空')
        return false
      }
      var params = {
        'username': this.form.phone,
        'password': this.form.password
      }
      var res = await http.post(api.regist, params)
      if (res.data.code === 0) {
        this.messageTost('创建成功')
        this.$router.back(-1)
      } else {
        this.messageTost(res.data.message)
      }
    },
    messageTost(val) { // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: 'success'
      })
    },
    errorTost(val) { // 错误提示
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
  margin-top: 20px
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
  width: 200px
}
</style>
