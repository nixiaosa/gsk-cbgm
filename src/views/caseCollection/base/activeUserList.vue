<template>
  <div class="participants">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formPersonUpload.nickname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formPersonUpload.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="省份">
        <el-input v-model="formPersonUpload.province" placeholder="请输入省份名称"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <el-input v-model="formPersonUpload.city" placeholder="请输入城市名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="ListActiveName" type="card">
      <el-tab-pane label="活动用户列表" name="first"></el-tab-pane>
    </el-tabs>
    <el-button type="primary" size="medium" @click="setBatchUploadDia" style="margin-bottom:10px;float:right">批量设置上传数量</el-button>
    <el-button type="primary" size="medium" @click="userAllExport" style="margin-bottom:10px;margin-right:10px;float:right">导出全部用户数据</el-button>
    <el-button type="primary" size="medium" @click="goUserImport" style="margin-bottom:10px;margin-right:10px;float:right">导入用户</el-button>

    <el-table :data="tabData" @selection-change="handleSelectionChangeList" border>
      <el-table-column type="selection" width="55" v-if="ListActiveName == 'first'"></el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
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
      <el-table-column label="每人可上传数量">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="每人每月可上传数量" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.perMonthNum }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" label="账户状态">
        <template slot-scope="scope">
          <span class="taskMessage">{{scope.row.status ? '停用' : '启用'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="godetail(scope.row)"
          >查看详情</el-button>
          <el-button
            v-show="scope.row.status"
            type="success"
            size="small"
            @click="stop(scope.row.userId, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.status"
            type="danger"
            size="small"
            @click="setStopDia(scope.row.userId, 1)"
          >停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="medium" @click="setBatchStopDia" style="margin-top:10px">批量设置账户状态</el-button>
    
    <el-dialog title="停用账户" :visible.sync="stopDia">
      <div class="dia-info">账户停用后，用户将不能参与该活动，且已提交的病例会置为失效，是否确认此操作？</div>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stopDia = false">取 消</el-button>
        <el-button type="primary" @click="stop(userId, 1)">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量设置账户" :visible.sync="batchstopDia">
      <el-radio v-model="sstBatch" label="0">启用</el-radio>
      <el-radio v-model="sstBatch" label="1">停用</el-radio>
      <div class="dia-info" style="margin-top:10px">是否确认将所有筛选用户更新为选择状态？</div>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchstopDia = false">取 消</el-button>
        <el-button type="primary" @click="batchStop(sstBatch)">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量设置上传数量" :visible.sync="batchUploadDia">
      <div class="dia-info">1. 请导入格式为「xlsx」的数据，数据列表请参考模板；</div>
      <div class="dia-info">2. 数据项中必须包含「手机号码」、「每人可上传数量」、「每人每月可上传数量」；</div>
      <div class="dia-info">3. 数据项必须为数字，不得包含特殊字符；</div>
      <div class="dia-info">4. 每人每月可上传数量需小于每人可上传数量；</div>
      <div class="dia-info">5. 一次最多上传500条数据；</div>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchUploadDia = false">取 消</el-button>
        <el-upload
          class="upload-demo"
          :accept="accept"
          :multiple="false"
          :show-file-list="false"
          ref="exeUpload"
          action=""
          :on-change="handlePreview"
          :file-list="fileList"
          :auto-upload="false">
        <el-row style="width: 100px">
          <el-progress v-if="showUpload" :text-inside="true" :stroke-width="16" :percentage="this.percentageNum"></el-progress>
        </el-row>
          <el-button v-if="!showUpload" slot="trigger" type="primary">选择上传文件</el-button>
        </el-upload>
        <el-button type="primary" @click="download">下载数据模版</el-button>
      </span>
    </el-dialog>

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
  name: "activeUserList",
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
      formPersonUpload: {
        busId: this.$route.query.busId,
        nickname: null,
        phone: null,
        province: null,
        city: null
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
      fileName: '',
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

      this.formPersonUpload.nickname = null
      this.formPersonUpload.phone = null
      this.formPersonUpload.province = null
      this.formPersonUpload.city = null

      this.ListActiveName = "first";
      this.formInline.formIdChild = 0;
      this.formPersonUpload.busId = this.$route.query.busId;
      this.personUploadList(1);
    },
    $route(){
      //跳转到该页面后需要进行的操作
      this.personUploadList(1);
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
    this.personUploadList(1)
  },
  methods: {
    goUserImport(){
      this.$router.push({
          path: '/activity/caseCollection/userImport/',
          query: {
            id: this.$route.params.id,
            busId: this.$route.query.busId,
            name: this.$route.query.title
          }
        })
    },
    async userAllExport() {
      const res = await http.get(api.getUserAllExcport + this.$route.query.busId);
      if (res.data.code === 0) {
        window.open(res.data.data)
        this.$message.success('导出成功')
      } else {
        this.$message.error(res.data.message);
      }
    },
    download(){
      window.open("https://poster-1253412830.cos.ap-beijing.myqcloud.com/NoBusId/批量上传数据模板(2151).xlsx")
      this.$message.success("下载成功")
      this.batchUploadDia = false
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
          return false
        }
        this.$message.success("操作成功");
        this.batchUploadDia = false;
      }else{
        this.$message.error(res.data.message);
        this.batchUploadDia = false;
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
    personUploadList: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params: this.formPersonUpload
      };
      const res = await http.post(api.personUploadTotalList, params);
      if (res.data.code === 0) {
        this.tabData = res.data.data.data
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    PersonUploadSearch() {
      this.personUploadList(1);
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
        this.personUploadList(this.currentPage)
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
        this.personUploadList(this.currentPage)
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.personUploadList(this.currentPage)
    },
    godetail(row) {
      this.$router.push({
        path: '/activity/activedetail',
        query: {
          caseCollectId: this.formInline.caseCollectId,
          userId: row.userId
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.personUploadList(val)
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
