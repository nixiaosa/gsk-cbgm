<template>
  <div class="case">
    <header-content
      :title="headerTitle + this.$route.query.title"
      :opertions="opertions"
      @header-btn-click="headerClick"
    ></header-content>
    <ul class="ranklist-top fn-clear">
      <li>活动标题：{{ this.$route.query.title }}</li>
      <li>投票选项总数：{{ tableData.totalOptions ? tableData.totalOptions : 0 }}项</li>
      <li class="line-wrap">访问人数：{{ tableData.totalVisistNums ? tableData.totalVisistNums :0 }}人</li>
      <li>参与人数：{{ tableData.totalPersonNums ? tableData.totalPersonNums : 0 }}人</li>
      <li
      >累计投票数/评分数：{{ tableData.totalScoreNums ? tableData.totalScoreNums : 0 }}票/分</li>
      <!-- <li
        v-if="this.voteType == 1"
      >累计评分数：{{ this.sumVoteScore == "null" || "" ? 0 : this.sumVoteScore}}分</li> -->
    </ul>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="exportContract">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="参赛名称">
        <template slot-scope="scope">
          <span>{{ scope.row.optionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总得票/总得分">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.currentScore }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="总得分" v-if="this.voteType == 1">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.score }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="加票数" v-if="actType === 1">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.extraScore }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="tabRes(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="确认提示" :visible.sync="ends">
      <span style="color: red;">任务被强制结束后不能再次开启，确定要结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="endsVideo">确 定</el-button>
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
import HeaderContent from "@/components/header-content";
export default {
  // name: "caseCollection",
  name: "normalRankingList",
  components: {
    HeaderContent
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    gethasTask(v) {
      switch (v) {
        case 0:
          return "否";
        case 1:
          return "是";
      }
    },
    formatDates(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  data() {
    return {
      headerTitle: "投票管理-->排行榜-->",
      title: "",
      visitsNum: "",
      voteType: '',
      sumVoteNum: "",
      sumVoteScore: "",
      countPeopleNum: "",
      countOption: "",
      caseName: "",
      opertions: ["返回"],
      currentPage: 1,
      total: 1,
      ends: false,
      id: "2",
      endId: "",
      optionName: "",
      tableDatas: [],
      tableData: {},
      actType: this.$route.query.actType,
      statusList: [
        { label: "全部" },
        { label: "未发布", states: 5 },
        { label: "未开始", states: 1 },
        { label: "进行中", states: 2 },
        { label: "已结束", states: 3 },
        { label: "已过期", states: 4 }
      ],
      formInline: {
        states: null,
        beginTime: null,
        endTime: null,
        name: null
      }
    };
  },
  mounted() {
    this.caseCollection(1);
    // this.currentPage = this.currentPage;
    // alert(this.currentPage);
  },
  created() {
    // if (this.$route.query.page) {
    //   let page = Number(this.$route.query.page);
    //   this.currentPage = page;
    // } else {
    //   this.currentPage = this.currentPage;
    // }
  },
  methods: {
    exportContract() {
      // 导出
      http.get(api.voteQueryResultExport + this.$route.query.voteId).then(res => {
        let { code, data, message } = res.data;
        this.isLoading = false;
        if (code === 0) {
          window.location.href = data;
          this.$message.success("导出成功");
        } else {
          this.$message.error(message);
        }
      });
    },
    tabRes(row) {
      var optionId = row.id;
      this.$router.push({
        path: "/activity/normalDefiniteDetailedV3/" + optionId,
        query: {
          pages: this.newpage,
          voteId: this.$route.query.voteId,
          voteResultId: row.id,
          voteType: row.actType,
          optionId: row.optionId
        }
      });
    },
    headerClick() {
      this.$router.push({
        // path: '/activity/caseCollection',
        path: "/activity/normalVoteV3",
        query: {
          page: this.$route.query.page
        }
      });
    },
    caseCollectSst(id, status) {
      let params = {
        id: id,
        status: status
      };
      http.post(api.caseCollectSst, params).then(res => {
        if (res.data.code === 0) {
          this.caseCollection(this.currentPage);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    caseCollection: async function(pageNum) {
      let params = {
        pageIndex: pageNum,
        pageSize: 10,
        // optionName: this.optionName,
        param: {
          voteId: this.$route.query.voteId
        }
      };
      const res = await http.post(api.voteQueryResult, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data;
        this.tableDatas = res.data.data.pageResult.records;
        this.total = res.data.data.pageResult.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.caseCollection(val);
      this.currentPage = val;
    },
    endcase(id) {
      this.endId = id;
      this.ends = true;
    },
    startTimes() {
      this.formInline.beginTime = Date.parse(this.formInline.beginTime);
    },
    endTimes() {
      if (this.formInline.endTime.getFullYear) {
        let Year = this.formInline.endTime.getFullYear();
        let Month = this.formInline.endTime.getMonth() + 1;
        let getDate = this.formInline.endTime.getDate();
        this.formInline.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime();
      }
    },
    endsVideo() {
      this.endcaseCollection();
      this.ends = false;
    },
    endcaseCollection: async function() {
      let params = {
        id: this.endId
      };
      const res = await http.post(api.endcaseCollection, params);
      if (res.data.code === 0) {
        this.caseCollection(this.currentPage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.caseCollection();
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.fn-clear:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.fn-clear {
  zoom: 1; /* for IE6 IE7 */
}
.ranklist-top {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    float: left;
    margin: 0 30px 30px 0;
    &.line-wrap {
      clear: both;
    }
  }
}
</style>
