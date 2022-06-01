<!--
 * @Author: your name
 * @Date: 2020-07-10 11:22:52
 * @LastEditTime: 2021-10-21 10:23:22
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/caseCollection/caseActivityDetail.vue
-->
<template>
  <div class="casedetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="活动详情" name="first">
        <CaseDetail v-if="activeName === 'first'" :id="id"></CaseDetail>
      </el-tab-pane>
      <el-tab-pane label="收集病例列表" name="second" v-if="this.$route.query.states != 0 && this.$route.query.states != -1">
        <Participants v-if="activeName === 'second'" :id="id" :page="page" :busId="busId"></Participants>
      </el-tab-pane>
      <el-tab-pane label="活动用户列表" name="third" v-if="this.$route.query.states != 0 && this.$route.query.states != -1">
        <ActiveUserList v-if="activeName === 'third'" :id="id" :page="page" :busId="busId"></ActiveUserList>
      </el-tab-pane>
      <el-tab-pane label="邀请专家点评" name="fouth" v-if="this.$route.query.states != 0 && this.$route.query.states != -1 && this.$route.query.professorRemark == 1">
        <specialComment v-if="activeName === 'fouth'" :id="id" :page="page" :busId="busId"></specialComment>
      </el-tab-pane>
      <el-tab-pane label="活动专家列表" name="fifth" v-if="this.$route.query.states != 0 && this.$route.query.states != -1 && this.$route.query.professorRemark == 1">
        <SpecialList v-if="activeName === 'fifth'" :id="id" :page="page" :busId="busId"></SpecialList>
      </el-tab-pane>
      <el-tab-pane label="统计分析" name="sixth" v-if="this.$route.query.states != 0 && this.$route.query.states != -1">
        <statiStical v-if="activeName === 'sixth'" :id="id"></statiStical>
        <!--<Detail></Detail>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import CaseDetail from "./base/caseDetail";
import Participants from "./base/participants";
import specialComment from "./base/specialComment";
import statiStical from "./base/statisticalAnalysis";
import ActiveUserList from "./base/activeUserList";
import SpecialList from "./base/specialList";
import Detail from "./base/casedetails";
import { formatDate } from "@/common/data";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
export default {
  name: "caseActivityDetail",
  components: {
    HeaderContent,
    CaseDetail,
    Participants,
    specialComment,
    statiStical,
    ActiveUserList,
    SpecialList,
    Detail
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  created() {
    if (this.$route.query) {
      if (this.$route.query.name) {
        this.activeName = this.$route.query.name;
      }
    }
  },
  data() {
    return {
      headerTitle: this.$route.query.title,
      opertions: ["返回"],
      activeName: "first",
      id: this.$route.params.id,
      busId: this.$route.query.busId,
      page: this.$route.query.page,
      tabTitle: ''
    };
  },
  activated() {
    if (this.$route.query.states == 0 || this.$route.query.states == -1) {
      this.activeName = "first";
    }
    if (this.$route.query.professorRemark === 0 && this.activeName === "fouth") {
      this.activeName = "first";
    }
    // if(this.$route.query.states != 0 && this.$route.query.states != -1 && this.$route.query.professorRemark !== 1){
    //   this.activeName = "first";
    // }
    this.id = this.$route.params.id;
    this.busId = this.$route.query.busId;
    // this.headerTitle = "活动详情"
    this.headerTitle = this.$route.query.title
  },
  async mounted() {
    // this.caseActivityDetail()
    // await this.statisticsCount();
  },
  methods: {
    handleClick(tab, event){
      console.log(tab.label)
      this.tabTitle = tab.label
      this.headerTitle = this.$route.query.title + '-->' + this.tabTitle
    },
    headerClick() {
      this.$router.push({
        path: "/activity/caseCollection",
        query: {
          page: this.$route.query.page
        }
      });
    },
  }
};
</script>

<style scoped>
</style>
