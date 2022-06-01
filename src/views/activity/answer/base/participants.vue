<template>
  <div class="participants">
    <div class="message">
      <span>总人数：{{ totalUser }}人</span>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="手机号" placeholder="请输入手机号">
        <el-input v-model="formInline.phone"></el-input>
      </el-form-item>
      <el-form-item label="姓名" placeholder="请输入姓名">
        <el-input v-model="formInline.userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button
          v-show="tabData.length > 0"
          type="info"
          size="small"
          @click="answerExport"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <div class="identity-tab">
      <el-button
        v-for="(item, index) in identityArr"
        :key="item.identity"
        @click="identityClick(item, index)"
        type="cancel"
        size="small"
        :class="{ identityActive: identityActive == index }"
        >{{ item.titlename }}</el-button
      >
    </div>

    <IdentityTable
      v-if="identity === 1"
      :data="tabData"
      :tableConfig="doctorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 2"
      :data="tabData"
      :tableConfig="drugStoreConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 3"
      :data="tabData"
      :tableConfig="companyConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 4"
      :data="tabData"
      :tableConfig="patientConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 5"
      :data="tabData"
      :tableConfig="visitorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 6"
      :data="tabData"
      :tableConfig="nurseConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 7"
      :data="tabData"
      :tableConfig="pharmacistConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="identity === 8"
      :data="tabData"
      :tableConfig="technicianConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import IdentityTable from "@/views/business/class/base/identityTable";
import answerConfig from "@/views/activity/answer/base/identity.json";
export default {
  name: "participants",
  props: ["id", "page"],
  components: {
    IdentityTable,
  },
  data() {
    return {
      totalUser: "",
      tabData: [],
      currentPage: 1,
      caseCollectId: "",
      hasTask: null,
      total: 1,
      formInline: {
        phone: null,
        userName: null,
      },
      // 多身份
      identity: 1,
      identityArr: [],
      tableData: [],
      identityActive: 0,
      doctorConfig: answerConfig.doctorConfig, //医生身份
      companyConfig: answerConfig.companyConfig, //企业身份
      drugStoreConfig: answerConfig.drugStoreConfig, //药店身份
      patientConfig: answerConfig.patientConfig, //患者身份
      visitorConfig: answerConfig.visitorConfig, //游客身份
      nurseConfig: answerConfig.nurseConfig, //护士身份
      pharmacistConfig: answerConfig.pharmacistConfig, //药师身份
      technicianConfig: answerConfig.technicianConfig, //技师身份
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
    },
  },
  created() {
    if (this.$route.query.pages) {
      let page = Number(this.$route.query.pages);
      this.currentPage = page;
    }
  },
  mounted() {
    this.participants(this.currentPage);
    this.getIdentityList();
  },
  methods: {
    // async answerExport() {
    //   await http.post(api.answerExport + `${this.id}`).then(res => {
    //     const data = res.data
    //     if (data.code !== 0) {
    //       this.$message.error(data.message)
    //     } else {
    //       window.open(data.data)
    //     }
    //   })
    // },
    async answerExport() {
      let params = {};
      params = {
        examId: this.id,
      };
      const res = await http.post(api.answerExportNew, params);
      if (res.data.code === 0) {
        window.open(res.data.data);
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.participants(this.currentPage);
    },
    godetail(id) {
      this.$router.push({ path: "/activity/casedetails/" + id });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.participants(val);
    },
    participants: async function (pageNum) {
      let params = {};
      params = {
        identity: this.identity,
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
      };
      const res = await http.post(api.findUserList, params);
      if (res.data.code === 0) {
        this.totalUser = res.data.data.totalUser;
        this.tabData = res.data.data.content.list;
        this.total = res.data.data.content.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    // 获取多身份
    getIdentityList: async function () {
      var params = {};
      var res = await http.post(api.getQaIdentityList, params);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identity = this.identityArr[0].titleId;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    identityClick(item, index) {
      // this.identity = item.identity;
      this.identity = item.titleId;
      this.identityActive = index;
      this.handleCurrentChange(1);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme: var(--reset);
$c-theme2: var(--reset2);
$c-theme3: var(--reset3);
.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}
.message span {
  color: $c-theme;
}
.identity-tab {
  margin-bottom: 10px;
}
.identity-tab .el-button:hover {
  background-color: $c-theme2;
  color: $c-theme;
  border: 1px solid $c-theme;
}
.identityActive {
  background-color: $c-theme2;
  color: $c-theme;
}
</style>
