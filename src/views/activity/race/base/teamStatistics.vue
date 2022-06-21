<template>
  <div class="participants">
    <div class="message">
      <span v-if="!showDetail">{{ totalUser }}个团队</span>
      <span v-if="showDetail">总人数：{{ totalUserDetail }}人</span>
    </div>
    <el-form v-if="!showDetail" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="团队名称">
        <el-input v-model="formInline.teamName" placeholder="请输入团队名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button v-show="tabData.length > 0" type="info" size="small" @click="answerExport">导出</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="showDetail" :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formInline.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="goback">返回列表</el-button>
        <el-button type="info" size="small" @click="onSubmitDetail">查询</el-button>
        <el-button v-show="tabData.length > 0" type="info" size="small" @click="answerExportDetail" v-if="identity === 1">导出</el-button>
        <el-button v-show="tabData.length > 0" type="info" size="small" @click="answerExportDetail2" v-if="identity === 0">导出</el-button>
      </el-form-item>
      <!-- <div class="identity-tab" style="margin-bottom:10px" v-if="identity === 1">
        <el-button
          v-for="(item,index) in identityArr"
          :key="item.titleId"
          @click="identityClick(item,index)"
          type="cancel"
          size="small"
          :class="{'identityActive':identityActive==index}"
        >{{ item.titlename }}</el-button>
      </div> -->
    </el-form>
    <el-table v-if="!showDetail" :data="tabData" border>
      <el-table-column label="序号">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队名称">
        <template slot-scope="scope">
          <span>{{ scope.row.teamName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="队长">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队总答对数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalRight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队总人数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总排名">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="godetail(scope.row.teamId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 未开通多身份表格开始 -->
     <el-table :data="tabDataDetail" v-if="showDetail" border>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
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
      <el-table-column label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office}}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队总答对数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalRight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队总答题数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalExam }}</span>
        </template>
      </el-table-column>
      <el-table-column label="团队排名">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
    </el-table>


    <!-- <div v-if="identity === 1 && showDetail">
      <IdentityTable
      v-if="titleId === 1 && showDetail"
      :data="tabDataDetail"
      :currentData="currentPage"
      :tableConfig="doctorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 2 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="drugStoreConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 3 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="companyConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 4 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="patientConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 5 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="visitorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 6 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="doctorConfig2"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 7 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="doctorConfig3"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 8 && showDetail"
      :currentData="currentPage"
      :data="tabDataDetail"
      :tableConfig="doctorConfig4"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    </div> -->
    <div style="margin:20px"></div>

    <el-pagination
      v-if="!showDetail"
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>

    <el-pagination
      v-if="showDetail"
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChangeDetail"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
import IdentityTable from "@/views/business/class/base/identityTable";
import userId from "@/views/activity/race/base/teamIdentity.json";
export default {
  name: "teamstatistics",
  props: ["id", "page"],
  components: {
    IdentityTable
  },
  computed: {
    ...mapGetters(["companyid","identity"])
  },
  data() {
    return {
      titleId: 1,
      identityArr: [],
      totalUser: "",
      totalUserDetail: "",
      tabData: [],
      tabDataDetail: [],
      currentPage: 1,
      caseCollectId: "",
      hasTask: null,
      total: 1,
      // identity: 1,
      identityActive: 0,
      // identityArr: [],
      formInline: {
        phone: null,
        userName: null,
        teamName: null,
        teamId: null
      },
      showDetail: false,
      doctorConfig: userId.doctorConfig, //医生身份 1
      companyConfig: userId.companyConfig, //企业身份 3
      drugStoreConfig: userId.drugStoreConfig, //药店身份 2 
      patientConfig: userId.patientConfig, //患者身份 4
      visitorConfig: userId.visitorConfig, //游客身份 5
      doctorConfig2: userId.doctorConfig2, //医生字段一样身份 6
      doctorConfig3: userId.doctorConfig3, //医生字段一样身份 7
      doctorConfig4: userId.doctorConfig4, //医生字段一样身份 8
    };
  },
  filters: {
    sex(val) {
      switch (val) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return "";
      }
    },
    tomin(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = "" + parseInt(theTime) + "秒";
      if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
      }
      if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
      }
      return result;
    },
    formatDate(time) {
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
      console.log(this.$route.query.pages)
      this.currentPage = page;
    }
  },
  mounted() {
    this.participants(this.currentPage);
    // this.getUserId()
  },
  methods: {
    async answerExportDetail() {
      let params = {};
      params = {
        pageNum: 1,
        pageSize: 10,
        examId: this.id,
        operate: "export",
        phone:
          this.formInline.phone === ""
            ? (this.formInline.phone = null)
            : this.formInline.phone,
        userName:
          this.formInline.userName === ""
            ? (this.formInline.userName = null)
            : this.formInline.userName,
        teamName:
          this.formInline.teamName === ""
            ? (this.formInline.teamName = null)
            : this.formInline.teamName,
        teamId:
          this.formInline.teamId === ""
            ? (this.formInline.teamId = null)
            : this.formInline.teamId
      };
      await http.post(api.teamExport, params).then(res => {
        const data = res.data;
        if (data.code !== 0) {
          this.$message.error(data.message);
        } else {
          window.open(data.data);
        }
      });
    },
    answerExportDetail2: async function(id, pageNum) {
      let params = {};
      params = {
        examId: this.id,
        teamId: id,
        phone: this.formInline.phone === '' ? this.formInline.phone = null : this.formInline.phone,
        userName: this.formInline.userName === '' ? this.formInline.userName = null : this.formInline.userName,
        operate: "export"
      };
      const res = await http.post(api.teamStatisticsDetail, params);
      if (res.data.code === 0) {
        window.open(res.data.data);
      } else {
        this.$message.error(res.data.message);
      }
    },
    async answerExport() {
      let params = {};
      params = {
        pageNum: 1,
        pageSize: 10,
        examId: this.id,
        operate: "export",
        phone:
          this.formInline.phone === ""
            ? (this.formInline.phone = null)
            : this.formInline.phone,
        userName:
          this.formInline.userName === ""
            ? (this.formInline.userName = null)
            : this.formInline.userName,
        teamName:
          this.formInline.teamName === ""
            ? (this.formInline.teamName = null)
            : this.formInline.teamName
      };
      await http.post(api.teamStatisticsList, params).then(res => {
        const data = res.data;
        if (data.code !== 0) {
          this.$message.error(data.message);
        } else {
          window.open(data.data);
        }
      });
    },
    onSubmit() {
      this.participants(1);
    },
    onSubmitDetail(){
       this.participantsDetail(this.formInline.teamId,1);
    },
    godetail(id) {
      this.showDetail = true;
      this.formInline.teamId = id;
      this.participantsDetail(id);
    },
    goback() {
      this.showDetail = false;
      this.participants(1);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.participants(val);
    },
    handleCurrentChangeDetail(val) {
      this.currentPage = val;
      this.participantsDetail(this.formInline.teamId,val);
    },
    participants: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        examId: this.id,
        phone:
          this.formInline.phone === ""
            ? (this.formInline.phone = null)
            : this.formInline.phone,
        userName:
          this.formInline.userName === ""
            ? (this.formInline.userName = null)
            : this.formInline.userName,
        teamName:
          this.formInline.teamName === ""
            ? (this.formInline.teamName = null)
            : this.formInline.teamName,
        identity: this.identity
      };
      const res = await http.post(api.teamStatisticsList, params);
      if (res.data.code === 0) {
        this.totalUser = res.data.data.total;
        this.tabData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    participantsDetail: async function(id, pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        examId: this.id,
        teamId: id,
        phone: this.formInline.phone === '' ? this.formInline.phone = null : this.formInline.phone,
        userName: this.formInline.userName === '' ? this.formInline.userName = null : this.formInline.userName,
        // identity: this.titleId
        // operate: "export"
      };
      if(this.identity === 1){
        params.identity = this.titleId
      }
      const res = await http.post(api.teamStatisticsDetail, params);
      if (res.data.code === 0) {
        this.totalUserDetail = res.data.data.result.count;
        this.tabDataDetail = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    // async getUserId() {
    //   let params = {}
    //   const res =  await http.get(api.getUserId + `${this.companyid}`, params)
    //   if(res.data.code === 0) {
    //     this.identityArr = res.data.data;
    //   }
    // },
    // identityClick(item, index) {
    //   this.titleId = item.titleId;
    //   this.identityActive = index;

    //   // this.identity = item.titleId;
    //   // this.identity = item.titleId;
    //   // this.identityActive = index;
    //   this.participantsDetail(this.formInline.teamId,1)
    // }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}
.message span {
  color: $c-theme;
}
.identity-tab .el-button:hover{
  background-color: $c-theme2;
  color: $c-theme;
  border: 1px solid $c-theme;
}
.identityActive {
  background-color: $c-theme2;
  color: $c-theme;
}
</style>
