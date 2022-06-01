<template>
  <div class="tenementList">
    <div class="header">
              <el-button type="primary" @click="emptyForm()">添加用户</el-button>
    </div>
    <div class="tenementBox">
      <el-table :data="dataList" border style="width: 95%">
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.sex === 'man' ? '男' : '女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.isdelete === 0 ? '正常' : '停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">启停</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page" layout="prev, pager, next" :total='this.pageTotal' @current-change="handleCurrentChange">
      </el-pagination>
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible2">
        <el-form :model="form">
          <el-form-item label="姓名：" :label-width="formLabelWidth">
            <el-input class="input400" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-radio class="radio" v-model="form.radio" label="1">男</el-radio>
            <el-radio class="radio" v-model="form.radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号：" :label-width="formLabelWidth">
            <el-input class="input400" v-model="form.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码：" :label-width="formLabelWidth">
            <el-input class="input400" v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-select class="" v-model="form.region" placeholder="请选择角色">
              <el-option label="销售代表" value="guanliyuan"></el-option>
              <el-option label="代理商" value="yunyingzongjian"></el-option>
              <el-option label="普通用户" value="yunyingjingli"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="regist()">保 存</el-button>
        </div>
       </el-dialog>
       <el-dialog title="修改信息" :visible.sync="dialogFormVisible3">
        <el-form :model="form">
          <el-form-item label="姓名：" :label-width="formLabelWidth">
            <el-input class="input400" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-radio class="radio" v-model="form.radio" label="1">男</el-radio>
            <el-radio class="radio" v-model="form.radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号：" :label-width="formLabelWidth">
            <el-input class="input400" :disabled="true" v-model="form.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-select class="" v-model="form.region" placeholder="请选择角色">
              <el-option label="销售代表" value="guanliyuan"></el-option>
              <el-option label="代理商" value="yunyingzongjian"></el-option>
              <el-option label="普通用户" value="yunyingjingli"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="updata()">保 存</el-button>
        </div>
       </el-dialog>

    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import md5 from 'js-md5'
import { formatDate } from '@/common/data'
export default {
  http,
  api,
  formatDate,
  name: 'tenementList',
  components: {},
  data() {
    return {
      companyId: 0,
      updataId: '',
      pageNum: '',
      form: {
        region: '',
        radio: '1',
        name: '',
        password: '',
        phone: ''
      },
      dialogTableVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      formLabelWidth: '120px',
      backgroundSpan: {
        background: 'red'
      },
      dataList: [],
      pageTotal: 10
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
    this.userinfoList(1)
  },
  methods: {
    regist() {
      if (this.form.phone.length !== 11) {
        this.errorTost('手机号错误')
      } else {
        this.postRegist()
      }
    },
    userinfoList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      var res = await http.post(api.userinfoList, params)
      if (res.data.code === 0) {
        this.dataList = res.data.data.list
      } else {
        this.errorTost(res.data.message)
      }
    },
    postRegist: async function() {
      var params = {
        username: this.form.phone,
        password: md5(this.form.password),
        name: this.form.name,
        sex: this.form.radio === '1' ? 'man' : 'woman'
      }
      var res = await http.post(api.postRegist, params)
      if (res.data.code === 0) {
        this.success('创建成功')
        this.dialogFormVisible2 = false
        this.userinfoList(this.pageNum)
      } else {
        this.errorTost(res.data.message)
      }
    },
    /**
     * 修改用户信息
     */
    updata: async function(id) {
      var params = {
        id: this.updataId,
        sex: this.form.radio === '1' ? 'man' : 'woman',
        nickname: this.form.name
      }
      var res = await http.post(api.updated, params)
      if (res.data.code === 0) {
        this.success('修改成功')
        this.dialogFormVisible3 = false
        this.userinfoList(this.pageNum)
      } else {
        this.errorTost(res.data.message)
      }
    },
    createUser() {},
    getcolor(string) {
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.userinfoList(val)
    },
    handleEdit(id) {
      this.getInfo(id)
      this.updataId = id
      this.dialogFormVisible3 = true
    },
    getInfo: async function(id) {
      var params = {
        id: id
      }
      var res = await http.post(api.getInfo, params)
      this.form.radio = res.data.data.sex === 'man' ? '1' : '2'
      this.form.name = res.data.data.nickname
      this.form.phone = res.data.data.phone
    },
    handleDelete: async function(id) {
      var params = {
        id: id
      }
      var res = await http.post(api.delete, params)
      if (res.data.code === 0) {
        // this.success('删除成功')
        this.userinfoList(this.pageNum)
      } else {
        this.errorTost(res.data.message)
      }
    },
    emptyForm() {
      this.dialogFormVisible2 = true
      this.region = ''
      this.radio = '1'
      this.name = ''
      this.phone = ''
    },
    success(val) {
      this.$message({
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
.tenementList {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
  padding-top: 0;
}
.header {
  width: 95%;
  margin: 0 20px 20px 0;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #ccc;
  text-align: right;
}
.header button {
  margin-right: 40px;
}
.page {
  margin-top: 20px;
}

.background {
  display: block;
  width: 100%;
  height: 100%;
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
