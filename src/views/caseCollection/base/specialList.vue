<template>
  <div class="participants">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="专家姓名">
        <el-input v-model="formProfessor.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formProfessor.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="医院">
        <el-input v-model="formProfessor.hospital" placeholder="请输入医院名称"></el-input>
      </el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="ListActiveName" type="card">
      <el-tab-pane label="活动专家列表" name="first"></el-tab-pane>
    </el-tabs>
    <el-button type="primary" size="medium" @click="goProfessorImport" style="margin-bottom:10px;margin-right:10px;float:right">导入专家</el-button>

    <el-table :data="tabData" border>
      <el-table-column label="专家姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已分配病例数">
        <template slot-scope="scope">
          <span>{{ scope.row.distirbuteCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已点评病例数">
        <template slot-scope="scope">
          <span>{{ scope.row.remarkCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="godetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import TaskStatistics from "./Echarts/TaskStatistics";
import TableList from "../../../components/table-content/TableList";
import { nextTick } from "q";
import { setTimeout } from "timers";
import $cos from "yb-cos";
import UploadFile from "@/views/business/foreuser/UploadFile";

export default {
  name: "specialList",
  components: { TableList, TaskStatistics, UploadFile },
  props: ["id", "page", "busId"],
  data() {
    return {
      ListActiveName: "first",
      totalCount: 0, // 病例总数
      passCount: 0, // 已通过病例数量
      tabData: [],
      currentPage: 1,
      caseCollectId: "",
      total: 1,
      totalSpecial: 1,
      formInline: {
        nickname: null,
        hospital: null,
        phone: null,
        title: null,
        states: null,
        province: null,
        caseCollectId: this.$route.params.id,
        formId: 0,
        effective: null,
        formIdChild: 0,
        id:'',
        caseNumber:''
      },
      formProfessor: {
        busId: this.$route.query.busId,
        name: null,
        phone: null,
        hospital: null
      },
      caseType: null,
      personUploadTotal: false,
      formMessage: {
        radio: "0"
      },
      multipleSelectionList: [],
      tabDataSpecial: [],
      tabDataSpecialCancel: [],
      caseFillIds: [],
      cancelCaseFillIds: '',
      userIds: [],
      professorRemark: "", // 有无专家点评(0否1是)
      stopDia: false,
      userId: "",
      batchstopDia: false,
      sstBatch: "0",
      accept: '.xls,.xlsx', // 支持上传的附件后缀
      fileList: [],
      fileData: '',
      showUpload: false,
      batchUploadDia: false,
      fileName: ''
    };
  },
  watch: {
    id(item) {
      this.formInline.caseCollectId = item;
      this.id = item;
      if (this.$route.query.pages) {
        let page = Number(this.$route.query.pages);
        this.currentPage = page;
      } else {
        this.currentPage = this.currentPage;
      }
      this.formInline.formId = 0;
      
      this.formProfessor.name = null;
      this.formProfessor.phone = null;
      this.formProfessor.hospital = null;
      this.ListActiveName = "first";
      this.formInline.formIdChild = 0;
      this.formProfessor.busId = this.$route.query.busId;
      this.professorList(1);
    },
    $route(){
      //跳转到该页面后需要进行的操作
      this.professorList(1);
    }
  },
  filters: {
    sex(item) {
      switch (item) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return " ";
      }
    },
    formatDate(time) {
      if (!time) {
        return '<span style="color: rgb(19, 139, 1)"></span>';
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    states(v) {
      switch (v) {
        case 0:
          return "待审核";
        case 1:
          return "已通过";
        case 2:
          return "审核未通过";
        case 3:
          return "已失效";
      }
    }
  },
  created() {
    if (this.$route.query.pages) {
      let page = Number(this.$route.query.pages);
      this.currentPage = page;
    } else {
      this.currentPage = this.currentPage;
    }
  },
  async mounted() {
    // this.participants(this.currentPage);
    // await this.statisticsCount();
    // this.taskstatisticsCount();
    this.professorList(1)
  },
  methods: {
    goProfessorImport(){
      this.$router.push({
          path: '/activity/caseCollection/professorImport/',
          query: {
            busId: this.$route.query.busId
          }
        })
    },
    download(){
      window.open("https://poster-1253412830.cos.ap-beijing.myqcloud.com/NoBusId/批量上传数据模板(2151).xlsx")
    },
    handlePreview(file) {
      this.showUpload = true
      let params = {
        domain: api.getSig,
        name: file.name,
        body: file.raw,
        onProgress: progress => {
          if (progress.percent < 1) {
            this.percentageNum = parseInt(progress.percent * 100)
          }
        }
      }
      $cos.putObject(params, item => {
        this.handleExeSuccess(item)
      })
    },
    handleExeSuccess(response) {
      if (response.code === 0) {
        let transferName = ''
        this.showUpload = false
        this.fileData = decodeURIComponent(response.data.Location)
        transferName = this.fileData.substring(this.fileData.lastIndexOf("\/") + 1,this.fileData.length)
        this.fileName = transferName.substring(0,transferName.indexOf("."))
        this.batchAdd(this.fileData,this.fileName)
      } else {
        this.$message.error(response.message)
      }
    },
    batchAdd: async function(fileUrl,name) {
      var params = {
        caseCollectId: this.formInline.caseCollectId,
        fileUrl: fileUrl,
        fileName: name
      };
      const res = await http.post(api.allowNumSaveBatch,params);
      if (res.data.code === 0) {
        if(res.data.data != null){
          window.open(res.data.data)
        }
        this.$message.success(res.data.message);
      }else{
        this.$message.error(res.data.message);
      }
    },
    setStopDia(userId, type){
      this.stopDia = true
      this.userId = userId
    },
    setBatchStopDia(){
      if(!this.userIds.length){
        this.$message.error("请先选择账户");
        return false
      }
      this.batchstopDia = true
      this.sstBatch = '0'
    },
    setBatchUploadDia(){
      this.batchUploadDia = true
    },
    handleSelectionChangeList(val) {  // 活动用户列表复选
      this.multipleSelectionList = val;
      this.userIds = [];
      this.multipleSelectionList.map(item=>{
        this.userIds.push(item.userId)
      });
      // console.log(this.userIds)
    },
    professorList: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params: this.formProfessor
      };
      const res = await http.post(api.professorListWithcount, params);
      if (res.data.code === 0) {
        this.tabData = res.data.data.data
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    async stop(userId, type) {
      // 1停用   0启用
      this.stopDia = false
      let params = {}
      params = {
        caseCollectId: this.formInline.caseCollectId,
        status: type,
        userId: userId
      };
      const res = await http.post(api.collectStopUser, params);
      if (res.data.code === 0) {
        this.professorList(this.currentPage)
      } else {
        this.$message.error(res.data.message);
      }
    },
    async batchStop(sstBatch) {
      // 1停用   0启用
      this.batchstopDia = false
      let params = {}
      params = {
        caseCollectId: this.formInline.caseCollectId,
        status: sstBatch,
        userIds: this.userIds
      };
      const res = await http.post(api.collectBatchStopUser, params);
      if (res.data.code === 0) {
        this.professorList(this.currentPage)
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.professorList(this.currentPage)
    },
    godetail(row) {
      this.$router.push({
        path: '/activity/specialdetail',
        query: {
          busId: this.$route.query.busId,
          userId: row.userId
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.professorList(val)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.dia-info{
  margin-bottom: 10px;
}
.charts-box {
  display: flex;
  /*flex-wrap: wrap;*/
  overflow-x: auto;
  justify-content: space-between;
}

.charts-witdh {
  width: 400px;
}

.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}

.message span,
.message p {
  color: $c-theme;
}

.message p {
  margin-left: 20px;
}

.message p span {
  margin-right: 20px;
}

.taskMessage {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.module_content_box_num_ipt {
  margin: 0 10px;
  width: 130px;
}
.upload-demo{
  display: inline-block;
  margin: 0 10px;
}
</style>
