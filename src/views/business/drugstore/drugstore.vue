<template>
  <div class="create-tenant">
    <el-button type="primary" style="margin-top: 20px;margin-bottom: 20px;" @click="dialogFormAddOne = true">添加药店</el-button>
    <div class="drugstore-list">
      <el-table :data="dataList" border style="width: 95%">
        <el-table-column label="药店名称" width="180">
          <template slot-scope="scope">
            <span @click="gotostore(scope.row.id)" style="color:green;cursor:pointer">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="描述" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.properties | getDesc('description')}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="省份">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="区县">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
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
      totalNum: 10,
      dialogFormAddOne: false,
      form: {
        name: '',
        description: ''
      },
      token: { Authorization: localStorage.getItem('yibai_token_c'), Authtype: 'webm' },
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
    this.getDrugStoreList(1)
  },
  methods: {
    gotostore(id) {
      this.$router.push({ path: 'storeuser/' + id })
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
        this.getDrugStoreList()
      }
    },
    getDrugStoreList: async function(num) {
      var params = {
        pageNum: num,
        pageSize: 10
      }
      var res = await http.post(api.drugStoreList, params)
      if (res.data.code === 0) {
        this.dataList = res.data.data.data
        this.totalNum = res.data.data.total
      }
    },
    handleCurrentChange(val) {
      this.getDrugStoreList(val)
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
