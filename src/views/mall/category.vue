<template>
  <div class="category">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-dialog title="添加品类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="添加品类" :label-width="'120px'">
          <el-input v-model="form.name" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="adds">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog title="编辑品类" :visible.sync="dialogFormVisibles">
      <el-form :model="forms">
        <el-form-item label="编辑品类" :label-width="'120px'">
          <el-input v-model="forms.name" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取消</el-button>
        <el-button type="primary" @click="query">确定</el-button>
      </div>
    </el-dialog>
    <div style="margin:20px;"></div>
    <el-table
      :data="tableData"
       border
    >
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)* 10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
       <el-table-column label="操作者">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info"  size="small" @click="btn(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="stop(scope.row.id)" v-if="scope.row.isDeleted === 0">停用</el-button>
          <el-button type="success" size="small" @click="start(scope.row.id)" v-if="scope.row.isDeleted === 1">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px;"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import userapi from '@/api/login1'
import { formatDate } from '@/common/data'
export default {
  name: 'category',
  components:{
    HeaderContent
  },
  data() {
    return {
       headerTitle: '品类管理',
       opertions: ['添加品类'],
       currentPage: 1,
       total: 1,
       nickname: '',
       categoryId: '',
       tableData: [],
       dialogFormVisible: false,
       dialogFormVisibles: false,
        form: {
          name: ''
      },
      forms:{
        name: ''
      }
    }
  },
  filters: {
     formatDates(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
    this.getUser()
    this.categoryList(this.currentPage)
  },
  methods:{
    headerClick() {
      this.dialogFormVisible = true
    },
    adds() {
       if (this.form.name === ''  || this.form.name === null) {
         this.$message.error("请填写品类名称")
         return false
      }
      this.categroyAdd(this.form.name)
      this.dialogFormVisible = false
    },
    categrodetail: async function(id) {
      var params = {
        id: id
      }
      var res = await http.post(api.categrodetail,params)
      if (res.data.code === 0) {
      } else {
        this.$message.error(res.data.message)
      }
    },
    categoryList: async function(page) { // 获取列表
      var params1 = {
        pageNum: this.currentPage,
        pageSize: 1000,
        params: {}
      }
      var res = await http.post(api.categoryList,params1)
      if (res.data.code === 0) {
        this.total = res.data.data.total
        this.tableData = res.data.data.list
      } else {
        this.$message.error(res.data.message)
      }
    },
    btn(id) {
      this.dialogFormVisibles = true
      this.categoryId = id
      this.categrodetail(id)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.categoryList(val)
    },
    getUser: async function() {
      http.get(userapi.getuserinfo, {}).then(res => {
        if (res.data.code === 0) {
          this.nickname = res.data.data.nickname
        }
      })
        .catch(err => {
          this.$message.error(err.data.message)
        })
    },
    stop: async function(id) {
      var params = {
        id: id,
        isDeleted: 1
      }
      var res = await http.post(api.categoryupdate, params)
      if (res.data.code === 0) {
        this.categoryList(this.currentPage)
      }
    },
    start: async function(id) {
      var params = {
        id: id,
        isDeleted: 0
      }
      var res = await http.post(api.categoryupdate, params)
      if (res.data.code === 0) {
        this.categoryList(this.currentPage)
      }
    },
    query() {
       if (this.forms.name === ''  || this.forms.name === null) {
         this.$message.error("请填写品类名称")
         return false
      }
      this.categoryupdate(this.categoryId,this.forms.name,this.nickname)
      this.dialogFormVisibles = false
    },
    categoryupdate: async function(id,name,nickname) {
      var params = {
        id: id,
        categoryName: name,
        updatedBy: nickname
      }
      var res = await http.post(api.categoryupdate, params)
      if (res.data.code === 0) {
         this.$message.success(res.data.message)
         this.categoryList(this.currentPage)
         this.forms.name = ''
      } else {
        this.$message.error(res.data.message)
      }
    },
    categroyAdd: async function (name) {
      var params = {
        categoryName: name,
        createdBy: this.nickname,
        updatedBy: this.nickname
      }
      var res = await http.post(api.categroyAdd,params)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.categoryList(this.currentPage)
        this.form.name = ''
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style scoped>

</style>


