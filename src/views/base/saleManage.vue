<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="['新建销售']" @change="headerChange"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableDatas"
      border
    >
      <el-table-column label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="280px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.promoterName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="500px">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="info" size="small" @click="getQrcode(scope.row.id)">销售二维码</el-button>
          <el-button type="info" size="small" @click="godetail(scope.row.id)">关联列表</el-button>
          <el-button type="info" size="small" @click="deleteSales(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建销售"
      :visible.sync="ends"
    >
      <el-form label-width="100px" :model="editForm">
          <el-form-item label="*姓名：" prop="name" style="width:550px;">
            <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item v-if="isEdit == true" label="销售二维码：" prop="name">
            <img :src="qrcode" />
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="gskSaleSave()">保 存</el-button>
      </span>
    </el-dialog>
    <div style="margin:20px"></div>
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
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  import { mapGetters } from "vuex";
  export default {
    name: "saleManage",
    components: {
      HeaderContent
    },
    computed: {},
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      formatDates(time) {
        var date = new Date(time)
        if(time){
          return formatDate(date,'yyyy-MM-dd hh:mm')
        } else {
          ""
        }
      },
    },
    data() {
      return {
        isEdit: false,
        qrcode: '',
        name: null,
        isDis: false,
        headerTitle: '销售管理',
        currentPage: 1,
        total: 1,
        ends: false,
        id: '2',
        articleId: '',
        videoId: '',
        endId: '',
        tableDatas: [],
        articleOptions: [],
        videoOptions: [],
        formInline: {
          name: null,
        },
        editForm: {
          name: null,
          id: null,
        }
      }
    },
    mounted() {
      this.getSaleList(this.currentPage);
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      deleteSales: async function(id) {
        var res = await http.delete(api.saleManageSave + '/' + id);
        if (res.data.code === 0) {
          this.$message.success("操作成功");          
        } else {
          this.$message.error(res.data.message);
        }
      },
      getQrcode: async function(id) {
        var res = await http.get(api.saleManageSave + '/' + id);
        if (res.data.code === 0) {
            this.qrcode = res.data.data;     
        } else {
          this.$message.error(res.data.message);
        }
      },
      edit: async function(id) {
        this.isEdit = true
        this.ends = true
        let params = {}
        params = {
            promoterName: this.editForm.name,
            id: id
        }
        if(!this.editForm.name){
          this.$message.error("姓名不能为空");
          return false
        }
        var res = await http.post(api.saleManageSave,params);
        if (res.data.code === 0) {
            this.editForm.name = '';
            this.ends = false; 
            this.isEdit = false;     
        } else {
          this.$message.error(res.data.message);
        }
      },
      godetail: async function(id) {
        this.$router.push({
          path: "/basedata/sale/relateList",
          query: {
            id: id
          }
        });
      },
      gskSaleSave: async function() {
        let params = {}
        params = {
            promoterName: this.editForm.name
        }
        if(!this.editForm.name){
          this.$message.error("姓名不能为空");
          return false
        }
        var res = await http.post(api.saleManageSave,params);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.editForm.name = '';
          this.getSaleList(1);
          this.ends = false;          
        } else {
          this.$message.error(res.data.message);
        }
      },
      getSaleList: async function(pageNum) {
        let params = {}
        params = {
            pageNum: pageNum,
            pageSize: 10,
            promoterName: this.formInline.name
        }
        const res = await http.post(api.saleManageList,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleCurrentChange(val) {
        this.getSaleList(val)
        this.currentPage = val
      },
      onSubmit() {
        this.getSaleList(1)
      },
      headerChange() {
        this.ends = true
        this.editForm.id = null;
        this.editForm.name = '';
      },
    }
  }
</script>

<style scoped>

</style>
