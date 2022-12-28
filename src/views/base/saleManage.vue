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
      <el-table-column label="销售代表ID" width="100px">
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
          <el-button type="info" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="info" size="small" @click="handleDownload(scope.row)">销售二维码</el-button>
          <el-button type="info" size="small" @click="godetail(scope.row.id)">关联列表</el-button>
          <el-button type="danger" size="small" @click="openDeleteSales(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="diaTitle"
      :visible.sync="ends"
      @close="handleCancle"
    >
      <el-form label-width="100px" :model="editForm">
          <el-form-item prop="name" style="width:550px;">
            <span slot="label">
              <span style="color: red">*</span>
              <span>姓名:</span>
            </span>
            <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item v-if="isEdit == true" label="销售二维码：" prop="name">
            <img v-if="qrcode" class="qrcode2" :src="qrcode" />
            <el-empty v-else description="加载中.."></el-empty>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDia()">取 消</el-button>
        <el-button v-if="isEdit == false" type="primary" @click="gskSaleSave()">保 存</el-button>
        <el-button v-if="isEdit == true" type="primary" @click="gskSaleEdit()">编 辑</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="销售二维码"
      :visible.sync="ends2"
    >
      <div class="qrcode-wrap">
        <img v-if="qrcode" class="qrcode2" :src="qrcode" />
        <el-empty v-else description="加载中.."></el-empty>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDia2()">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="ends3"
    >
      <div class="qrcode-wrap">
        <p>确定要删除此销售吗?</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends3 = false">取 消</el-button>
        <el-button @click="deleteSales()">确 定</el-button>
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
  import downloadIamge from '@/utils/downloadPng'
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
        diaTitle: '新建销售',
        isEdit: false,
        qrcode: '',
        name: null,
        isDis: false,
        headerTitle: '销售管理',
        currentPage: 1,
        total: 1,
        ends: false,
        ends2: false,
        ends3: false,
        id: '2',
        articleId: '',
        videoId: '',
        endId: '',
        tableDatas: [],
        articleOptions: [],
        videoOptions: [],
        saleId: '',
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
      handleCancle(){
        this.isEdit = false;
        this.diaTitle = '新建销售';
      },
      handleDownload(row) {
        this.ends2 = true;
        this.getQrcode(row.id);
        // downloadIamge(this.qrcode, this.qrcode)
      },
      closeDia(){
        this.ends = false;
        this.isEdit = false;
        this.diaTitle = '新建销售';
      },
      closeDia2(){
        this.ends2 = false;
      },
      openDeleteSales(id){
        this.saleId = id;
        this.ends3 = true;
      },      
      deleteSales: async function() {
        var res = await http.delete(api.saleManageDelete + '/' + this.saleId);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.saleId = "";
          window.scrollTo(0, 0)
          $("html,body",window.parent.document).animate({scrollTop:0},1000)
          this.getSaleList(1);
        } else {
          this.$message.error(res.data.message);
        }
      },
      getQrcode: async function(id) {
        var res = await http.get(api.saleGetQrcode + '/' + id);
        if (res.data.code === 0) {
            this.qrcode = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      },
      gskSaleEdit: async function() {
        let params = {}
        params = {
            promoterName: this.editForm.name,
            id: this.editForm.id
        }
        if(!this.editForm.name){
          this.$message.error("姓名不能为空");
          return false
        }
        var res = await http.post(api.saleManageSave,params);
        if (res.data.code === 0) {
            this.getSaleList(this.currentPage);
            this.editForm.name = '';
            this.editForm.id = '';
            this.ends = false; 
            this.isEdit = false;
            this.diaTitle = '新建销售';  
        } else {
          this.$message.error(res.data.message);
        }
      },
      edit: async function(row) {
        this.getQrcode(row.id)
        this.editForm.id = row.id
        this.editForm.name = row.promoterName
        this.isEdit = true
        this.diaTitle = '编辑销售';
        this.ends = true
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
.qrcode-wrap{
  text-align: center;
}
.qrcode{
  width: 200px;
  height: 200px;
  background-color: #f5f5f5;
}
.qrcode2{
  width: 300px;
  height: 300px;
  background-color: #f5f5f5;
}
</style>
