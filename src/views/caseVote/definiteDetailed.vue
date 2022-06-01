<!--
 * @Author: your name
 * @Date: 2020-09-01 16:27:58
 * @LastEditTime: 2021-11-29 11:19:19
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/caseVote/makeChartdetail.vue
-->
<template>
  <div class="makeChartdetail">
    <header-content
      :title="this.voteType == 0 ? headerTitle : headerTitleScore"
      :opertions="opertions"
      @header-btn-click="headerClick"
    ></header-content>
    <div class="identity-tab" v-if="identity === 1">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.titlename }}</el-button>
    </div>
     <!-- 未开通多身份表格start-->
    <TableContent
      :page="newpage"
      :tableConfig="this.voteType == 0 ? tableConfig : tableConfigScore"
      :tableData="tableData"
      @change="tabRes"
      v-if="identity === 0"
    ></TableContent>
     <!-- 未开通多身份表格end-->
    
    <!-- 开通多身份表格start-->
     <TableContent
      v-if="identity === 1 && identityTit === 1"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? doctorConfig : doctorConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 2"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? drugStoreConfig : drugStoreConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 3"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? companyConfig : companyConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 4"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? patientConfig : patientConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 5"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? visitorConfig : visitorConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 6"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? nurseConfig : nurseConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 7"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? pharmacistConfig : pharmacistConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <TableContent
      v-if="identity === 1 && identityTit === 8"
      :page="newpage"
      :tableConfig="this.voteType == 0 ? technicianConfig : technicianConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
    <!-- 开通多身份表格end-->
    <div style="margin:20px;"></div>
    <el-pagination
      background
      :current-page="newpage"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="20"
    ></el-pagination>
  </div>
</template>
<script>
import HeaderContent from "@/components/header-content";
import TableContent from "@/components/table-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import voteConfig from "@/views/caseVote/base/identity.json";
import { mapGetters } from "vuex";
export default {
  // name: "makeChartdetail",
  name: "definiteDetailed",
  components: {
    HeaderContent,
    TableContent
  },
  data() {
    return {
      tableData: [],
      total: 1,
      id: this.$route.params.id,
      voteType: this.$route.query.voteType,
      newpage: 1,
      tableConfig: [
        { label: "姓名", prop: "nickname" },
        { label: "手机号", prop: "phone" },
        { label: "省份", prop: "province" },
        { label: "城市", prop: "city" },
        { label: "区县", prop: "county" },
        { label: "医院", prop: "hospital" },
        { label: "职称", prop: "title" },
        { label: "科室", prop: "office" },
        { label: "投票数", prop: "voteNum" },
        { label: "投票时间", prop: "createTime" },
        { label: "备注", prop: "mark" }
      ],
      tableConfigScore: [
        { label: "姓名", prop: "nickname" },
        { label: "手机号", prop: "phone" },
        { label: "省份", prop: "province" },
        { label: "城市", prop: "city" },
        { label: "区县", prop: "county" },
        { label: "医院", prop: "hospital" },
        { label: "职称", prop: "title" },
        { label: "科室", prop: "office" },
        { label: "评分数", prop: "voteScore" },
        { label: "评分时间", prop: "createTime" },
        { label: "备注", prop: "mark" }
      ],
      headerTitle: "病例投票管理 > 排行榜详情 > 投票明细",
      headerTitleScore: "病例投票管理 > 排行榜详情 > 评分明细",
      opertions: ["返回"],
      titleId: 1,
      identityArr: [],
      identityActive: 0,
      identityTit: 0,
      doctorConfig: voteConfig.vote.doctorConfig, //医生身份
      companyConfig: voteConfig.vote.companyConfig, //企业身份
      drugStoreConfig: voteConfig.vote.drugStoreConfig, //药店身份
      patientConfig: voteConfig.vote.patientConfig, //患者身份
      visitorConfig: voteConfig.vote.visitorConfig, //游客身份
      nurseConfig: voteConfig.vote.nurseConfig, //护士身份
      pharmacistConfig: voteConfig.vote.pharmacistConfig, //药师身份
      technicianConfig: voteConfig.vote.technicianConfig, //技师身份

      doctorConfigScore: voteConfig.score.doctorConfig, //医生身份
      companyConfigScore: voteConfig.score.companyConfig, //企业身份
      drugStoreConfigScore: voteConfig.score.drugStoreConfig, //药店身份
      patientConfigScore: voteConfig.score.patientConfig, //患者身份
      visitorConfigScore: voteConfig.score.visitorConfig, //游客身份
      nurseConfigScore: voteConfig.score.nurseConfig, //护士身份
      pharmacistConfigScore: voteConfig.score.pharmacistConfig, //药师身份
      technicianConfigScore: voteConfig.score.technicianConfig //技师身份
    };
  },
  computed: {
    ...mapGetters(["identity"])
  },
  async mounted() {
    await this.getIdentityList();
    this.makeChartdetail(this.newpage);
  },
  methods: {
    identityClick(item, index) {
      // this.identity = item.identity;
      this.identityTit = item.titleId;
      this.identityActive = index;
      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var params = {};
      var res = await http.post(api.getQaIdentityList, params);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identityTit = this.identityArr[0].titleId;
      } else {
        this.$message.error(res.data.message);
      }
    },
    headerClick() {
      this.$router.back();
    },
    // headerClick() {
    //   let id = this.$route.query.voteId;
    //   this.$router.push({
    //     path: "/activity/rankingList/" + id,
    //     query: {
    //       pages: this.$route.query.pages
    //     }
    //   });
    // },
    makeChartdetail: async function(page) {
      var params = {
        pageSize: 20,
        pageNum: page,
        voteId: this.$route.query.voteId,
        optionId: this.$route.params.id
      };
      if( this.identity === 1){
        params.identity = this.identityTit
      }
      const res = await http.post(api.rankDetail, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
        this.tableData.forEach((element, index) => {
          element.index = (this.newpage - 1) * 20 + index + 1;
          element.createTime = this.formatDate(element.createTime);
        });
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.newpage = val;
      this.makeChartdetail(val);
    },
    formatDate(time) {
      time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    tabRes() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.identity-tab {
  margin-bottom: 10px;
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


