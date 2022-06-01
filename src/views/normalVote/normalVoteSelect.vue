<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <!-- <ul class="ranklist-top fn-clear">
      <li>勾选活动：</li>
      <li v-for="(name, index) in caseName" :key="index">{{ name }}</li>
    </ul> -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="增加分组">
        <el-select v-model="groupId" placeholder="请选择分组">
          <el-option
            v-for="(item,index) in statusList"
            :key="index"
            :label="item.groupName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <div class="photoStatus">
        是否显示选项头像：
        <span>{{ (this.photoStatus == 0 ? "不显示" : "显示") }}</span>
      </div> -->
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="编号" width="70px">
        <template slot-scope="scope">
          <span>{{ scope.row.voteCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分组">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选项名称" width="450px">
        <template slot-scope="scope">
          <span>{{ scope.row.optionName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加附件数">
        <template slot-scope="scope">
          <span>{{ scope.row.fileCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.isDeleted | gethasForbidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="tabRes(scope.row)">查看</el-button>
          <el-button
            type="warning"
            size="small"
            v-if="scope.row.isDeleted == 0"
            @click="hiddenVote(scope.row)"
          >隐藏</el-button>
          <el-button
            type="success"
            size="small"
            v-if="scope.row.isDeleted == 1"
            @click="hiddenVote(scope.row)"
          >启动</el-button>
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
  name: "normalVoteSelect",
  components: {
    HeaderContent
  },
  filters: {
    gethasForbidden(v) {
      switch (v) {
        case 0:
          return "启动";
        case 1:
          return "隐藏";
      }
    },
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
      headerTitle: "投票管理-->投票选项",
      opertions: ["返回"],
      currentPage: 1,
      total: 1,
      ends: false,
      id: "",
      endId: "",
      optionId: "",
      photoStatus: this.$route.query.photoStatus,
      caseName: [],
      tableDatas: [],
      groupId: "",
      statusList: [
        // { label: "全部" },
        // { label: "分组一", states: 5 },
        // { label: "分组二", states: 1 },
        // { label: "分组三", states: 2 },
        // { label: "分组四", states: 3 },
        // { label: "分组五", states: 4 }
      ],
      showList: [{ label: "显示" }, { label: "不显示" }],
      formInline: {
        states: null,
        beginTime: null,
        endTime: null,
        name: null,
        groupId: null
      },
      routeSign: ""
    };
  },
  activated() {
    // alert(this.currentPage)
    // alert(this.routeSign);
    if (this.$route.params.id !== this.routeSign) {
      //通过routeSign匹配，判断是否从列表的同一个活动进来，如果是就清空页码参数，解决从投票选项详情返回缓存的页码参数问题
      this.caseCollection();
      this.photoStatus = this.$route.query.photoStatus;
    } else {
      this.caseCollection(this.currentPage);
      this.photoStatus = this.$route.query.photoStatus;
    }
  },
  deactivated() {},
  mounted() {
    // this.caseCollection(this.currentPage);
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page);
      this.currentPage = page;
    } else {
      this.currentPage = this.currentPage;
    }
  },
  methods: {
    hiddenVote(row) {
      var id = row.id;
      var deleted = row.isDeleted;
      let params = {
        optionId: id,
        voteId: this.$route.params.id
      };
      deleted == 0 ? (params.isDeleted = 1) : (params.isDeleted = 0);
      http.post(api.HiddenVote, params).then(res => {
        if (res.data.code === 0) {
          this.caseCollection(this.currentPage);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    tabRes(row) {
      var id = row.id;
      this.$router.push({
        path: "/activity/normalSelectDetail/" + id,
        query: {
          // pages: this.newpage,
          pages: this.currentPage,
          voteId: this.$route.params.id,
          photoStatus: this.$route.query.photoStatus
          // optionId: this.optionId,
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
      this.routeSign = this.$route.params.id;
      let params = {
        voteId: this.$route.params.id,
        groupId: this.groupId,
        // groupId: this.formInline.groupId
        pageNum: pageNum
      };
      const res = await http.post(api.voteOption, params);
      if (res.data.code === 0) {
        this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        this.groupId = res.data.data.result.groupList.id;
        this.optionId = res.data.data.list.id;
        this.caseName = [];
        this.statusList = [];
        res.data.data.result.caseList.map(item =>
          this.caseName.push(item.caseName)
        );

        res.data.data.result.groupList.map(item =>
          this.statusList.push({
            id: item.id,
            groupName: item.groupName
          })
        );
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
  margin: 0 0 20px 0;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  li {
    float: left;
    margin: 0 30px 0 0;
    &.line-wrap {
      clear: both;
    }
  }
}
.photoStatus {
  display: inline-block;
  font-size: 14px;
  margin-left: 10px;
  transform: translateY(10px);
}
</style>
