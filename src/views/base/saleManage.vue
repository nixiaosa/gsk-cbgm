<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="['新建销售']" @change="headerChange"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
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
          <span>{{ scope.row.name }}</span>
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
          <el-button type="info" size="small">销售二维码</el-button>
          <el-button type="info" size="small" @click="godetail(scope.row.id,1)">关联列表</el-button>
          <el-button type="info" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建销售"
      :visible.sync="ends"
    >
      <el-form label-width="100px" :model="editForm">
          <el-form-item label="姓名：" prop="name" style="width:550px;">
            <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" v-if="!isDis" @click="gskSaleSave()">保 存</el-button>
        <el-button type="primary" v-if="isDis" @click="ends = false">确 定</el-button>
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
      this.getArticleList();
      this.getGskVideoList();
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      edit: async function(id,isDetail) {
        if(isDetail == 1) {
          this.isDis = true;
        } else {
          this.isDis = false;
        }
        var res = await http.get(api.gskSignEdit + '/' + id);
        if (res.data.code === 0) {
            this.editForm.name = '';
            this.ends = true;
            this.editForm.id = res.data.data.id;
          
        } else {
          this.$message.error(res.data.message);
        }
      },
      godetail: async function(id,isDetail) {
        this.edit(id,1);
      },
      gskSaleSave: async function() {
        let params = {}
        params = {
            ...this.editForm
        }
        if(this.editForm.type == 2){
          if(!this.editForm.name){
            this.$message.error("姓名不能为空");
            return false
          }
        }
        var res = await http.post(api.gskSignSave,params);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.getSaleList(1);
          this.ends = false;          
        } else {
          this.$message.error(res.data.message);
        }
      },
      selectArticle(){
        this.editForm.sourceId = this.articleId
      },
      selectVideo(){
        // console.log(this.videoId)
        this.editForm.sourceId = this.videoId
      },
      times() {
        this.editForm.effectiveDate = Date.parse(this.editForm.effectiveDate);
      },
      exportList: async function() {
        const res = await http.get(api.gskSignExport)
        if (res.data.code === 0) {
          window.location.href = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      getSaleList: async function(pageNum) {
        let params = {}
        params = {
            pageNum: pageNum,
            pageSize: 10,
            promoterName: this.formInline
        }
        const res = await http.post(api.saleManageList,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      getArticleList: async function(pageNum) {
        const res = await http.get(api.getArticleList)
        if (res.data.code === 0) {
          this.articleOptions = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      getGskVideoList: async function(pageNum) {
        const res = await http.get(api.getGskVideoList)
        if (res.data.code === 0) {
          this.videoOptions = res.data.data
          console.log('lc',this.videoOptions)
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleCurrentChange(val) {
        this.getSaleList(val)
        this.currentPage = val
      },
      endcase(id) {
        this.endId = id
        this.ends = true
      },
      startTimes() {
        this.formInline.start = Date.parse(this.formInline.start)
      },
      endTimes() {
        if (this.formInline.endTime.getFullYear) {
          let Year = this.formInline.endTime.getFullYear()
          let Month = this.formInline.endTime.getMonth() + 1
          let getDate = this.formInline.endTime.getDate()
          this.formInline.endTime = new Date(
            `${Year}/${Month}/${getDate} 23:59:59`
          ).getTime()
        }
      },
      onSubmit() {
        this.getSaleList(1)
      },
      headerChange() {
        this.isDis = false;
        this.ends = true
        this.editForm.id = null;
        this.editForm.type = '1';
        this.editForm.visibilityType = 'HCP';
        this.editForm.title = '';
        this.editForm.content = '';
        this.editForm.effectiveDate = null;
        this.editForm.sourceId = null;
        this.videoId = '';
        this.articleId = '';
      },
    }
  }
</script>

<style scoped>

</style>
