<!--
 * @Author: your name
 * @Date: 2020-09-01 16:27:58
 * @LastEditTime: 2020-10-16 17:28:31
 * @LastEditors: Please set LastEditors
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
    <TableContent
      :page="newpage"
      :tableConfig="this.voteType == 0 ? tableConfig : tableConfigScore"
      :tableData="tableData"
      @change="tabRes"
    ></TableContent>
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
export default {
  // name: "makeChartdetail",
  name: "normalDefiniteDetailed",
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
        { label: "姓名", prop: "nikename" },
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
        { label: "姓名", prop: "nikename" },
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
      headerTitle: "投票活动管理 > 排行榜详情 > 投票明细",
      headerTitleScore: "投票活动管理 > 排行榜详情 > 评分明细",
      opertions: ["返回"]
    };
  },
  mounted() {
    this.makeChartdetail(this.newpage);
  },
  methods: {
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
<style scoped>
</style>


