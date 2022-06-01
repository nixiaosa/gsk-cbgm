<template>
  <div class="case">
    <header-content
      :title="headerTitle + title"
      :opertions="opertions"
      @header-btn-click="headerClick"
    ></header-content>
    <ul class="ranklist-top fn-clear">
      <li>活动标题：{{ this.title }}</li>
      <li>投票选项总数：{{ this.countOption }}项</li>
      <li class="line-wrap">访问人数：{{ this.visitsNum }}人</li>
      <li>参与人数：{{ this.countPeopleNum }}人</li>
      <li
        v-if="this.voteType == 0"
      >累计投票数：{{ this.sumVoteNum == "null" || "" ? 0 : this.sumVoteNum}}票</li>
      <li
        v-if="this.voteType == 1"
      >累计评分数：{{ this.sumVoteScore == "null" || "" ? 0 : this.sumVoteScore}}分</li>
    </ul>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="optionName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="exportContract">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="编号" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.voteCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参赛名称">
        <template slot-scope="scope">
          <span>{{ scope.row.optionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总得票" v-if="this.voteType == 0">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.voteNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总得分" v-if="this.voteType == 1">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.score }}</span>
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
    },
    getState(state) {
      switch (state) {
        case 0:
          return "未发布";
        case 1:
          return "未开始";
        case 2:
          return "进行中";
        case 3:
          return "已结束";
        case 4:
          return "已过期";
        case -1:
          return "未发布";
      }
    }
  },
  data() {
    return {
      headerTitle: "投票管理-->排行榜-->",
      title: "",
      visitsNum: "",
      voteType: this.$route.query.voteType,
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
    this.caseCollection();
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
      // this.isLoading = true;
      // 导出
      let params = {
        voteId: this.$route.params.id,
        // caseName: this.caseName,
        operate: "export"
      };
      http.post(api.rankList, params).then(res => {
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
        path: "/activity/normalDefiniteDetailed/" + optionId,
        query: {
          pages: this.newpage,
          voteId: this.$route.params.id,
          optionId: row.id,
          voteType: this.voteType
        }
      });
    },
    headerClick() {
      this.$router.push({
        // path: '/activity/caseCollection',
        path: "/activity/normalVote",
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
        pageNum: pageNum,
        pageSize: 10,
        voteId: this.$route.params.id,
        // caseName: this.caseName
        optionName: this.optionName
      };
      const res = await http.post(api.rankList, params);
      if (res.data.code === 0) {
        this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        this.title = res.data.data.result.voteName;
        this.sumVoteNum = res.data.data.result.sumVoteNum;
        this.sumVoteScore = res.data.data.result.sumVoteScore;
        this.visitsNum = res.data.data.result.visitsNum;
        this.countPeopleNum = res.data.data.result.countPeopleNum;
        this.countOption = res.data.data.result.countOption;
        this.optionName = res.data.data.list.optionName;
      } else {
        this.$message.error(res.data.message);
      }
    },
    godetail(id) {
      this.$router.push({
        path: "/activity/normalVoteActivityDetail/" + id,
        query: {
          page: this.currentPage
        }
      });
    },
    godetails(id) {
      this.$router.push({
        path: "/activity/normalVoteDetail/" + id,
        query: {
          page: this.currentPage
        }
      });
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
