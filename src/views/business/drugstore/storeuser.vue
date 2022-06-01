<template>
  <div class="create-tenant">
    <span style="margin-right:20px">{{storename}}</span>
    <el-button type="primary" style="margin-top: 20px;margin-bottom: 20px;" @click="adduserEdit()">批量导入用户</el-button>
    <div class="drugstore-list">
      <el-table :data="dataList" border style="width: 95%">
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加药店" :visible.sync="dialogFormAddOne">
      <el-form :model="form">
        <el-form-item label="药店名称">
          <el-input class="input400" v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="介绍：">
          <el-input type="textarea" class="input400" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddOne = false">取 消</el-button>
        <el-button type="primary" @click="addOneDrugStore()">确 定</el-button>
      </div>
    </el-dialog>
    <!--批量导入-->
    <el-dialog title="批量导入用户" :visible.sync="dialogFormAddMany" :before-close="clearSubmit()">
      <el-form :model="form">
        <h4 style="margin-top:0px">{{onename}}</h4>
        <el-form-item label="下载模版：">
          <a href="/api30/yibai-web-company/company/excel/users.xls">user.xls</a>
        </el-form-item>
        <el-form-item label="上传文件：">
          <el-upload
            ref="upload"
            class="upload-demo"
            accept=".xls"
            :action="actionUrl"
            :headers="token"
            multiple>
            <el-button size="small" type="primary">选取文件上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sureSubmit()">取 消</el-button>
        <el-button type="primary" @click="sureSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="totalNum">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/fetch'
import api from '@/api/tenantInfoSave'
import liveapi from '@/api/liveapi'
import { formatDate, strToJson } from '@/common/data'
export default {
  name: 'createTenant',
  components: {
  },
  data() {
    return {
      storename: '',
      totalNum: 10,
      dialogFormAddOne: false,
      form: {
        name: '',
        description: ''
      },
      token: { Authorization: localStorage.getItem('yibai_token_c'), Authtype: 'webm', 'Remote-Host': window.localStorage.getItem('locationHost') },
      dataList: [],
      dialogFormAddMany: false,
      filelist: [],
      onename: '',
      id: ''
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    getDesc(str, prom) {
      var obj = strToJson(str)
      return obj[prom]
    }
  },
  computed: {
    actionUrl() {
      if (!this.id) {
        return liveapi.upxlsurl
      } else {
        return liveapi.upxlsurl + this.id
      }
    }
  },
  mounted() {
    this.drugStoreUser()
    this.getStoreOne()
  },
  methods: {
    getStoreOne: async function() {
      var params = {}
      var id = this.$route.params.id
      var res = await http.get(api.getStoreOne + id, params)
      if (res.data.code === 0) {
        this.storename = res.data.data.name
      }
    },
    adduserEdit() {
      this.dialogFormAddMany = true
      this.onename = this.storename
      this.id = this.$route.params.id
    },
    addOneDrugStore: async function() {
      if (!this.form.name) {
        alert('请输入药店名称')
        return false
      }
      var params = {
        name: this.form.name,
        properties: '{description:' + this.form.description + '}'
      }
      var res = await http.post(api.createDrugStore, params)
      if (res.data.code === 0) {
        this.dialogFormAddOne = false
        this.form.name = ''
        this.form.description = ''
      }
    },
    drugStoreUser: async function() {
      var params = {
        params: {
          id: this.$route.params.id
        }
      }
      var res = await http.post(api.drugStoreUser, params)
      if (res.data.code === 0) {
        this.dataList = res.data.data.data
      }
    },
    handleCurrentChange(val) {
      // this.getDrugStoreList(val)
    },
    sureSubmit() {
      this.dialogFormAddMany = false
      this.$refs.upload.clearFiles()
    },
    clearSubmit() {
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },
    errorMsg(val) { // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    },
    successMsg(val) { // 成功提示
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
.create-tenant{
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
  padding-top: 0;
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
