<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动状态">
        <el-select v-model="formInline.status" placeholder="请选择活动状态">
          <el-option
            v-for="(item,index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.status"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动周期">
        <el-date-picker
          type="date"
          placeholder="选择开始时间"
          format="yyyy-MM-dd"
          v-model="formInline.startTime"
          @change="startTimes"
        ></el-date-picker>
        <span style="color: #ffffff">-</span>
        <el-date-picker
          type="date"
          placeholder="选择结束时间"
          format="yyyy-MM-dd"
          v-model="formInline.endTime"
          @change="endTimes"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动标题">
        <el-input v-model="formInline.voteName" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="formInline.createBy" placeholder="请输入创建人名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="投票活动名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.voteName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime !== null">{{ scope.row.endTime | formatDates }}</span>
          <span v-if="scope.row.endTime == null"></span>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与人数" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.countPeopleNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.forbidden | gethasForbidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetails(scope.row.id,scope.row.voteType,scope.row.voteShowType,scope.row.scoreShowType)">详情</el-button>
          <el-button
            v-show="scope.row.status !== 0"
            type="info"
            size="small"
            @click="goranklist(scope.row.id,scope.row.voteType)"
          >排行榜</el-button>
          <el-button type="info" size="small" @click="govoteSelect(scope.row.id,scope.row.photoStatus)">投票选项</el-button>
          <el-button
            v-show="scope.row.forbidden"
            type="success"
            size="small"
            @click="caseCollectSst(scope.row.id, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.forbidden"
            type="warning"
            size="small"
            @click="caseCollectSst(scope.row.id, 1)"
          >停用</el-button>
          <el-button
            v-show="scope.row.status === 1 || scope.row.status === 2"
            type="danger"
            size="small"
            @click="endcase(scope.row.id)"
          >结束活动</el-button>
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
// import Pagination from "@/components/pagination/Pagination";
export default {
  // name: "caseCollection",
  name: "normalVote",
  components: {
    HeaderContent
    // Pagination
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    gethasForbidden(v) {
      switch (v) {
        case 0:
          return "启动";
        case 1:
          return "停用";
      }
    },
    formatDates(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      switch (state) {
        case 0:
          return "草稿";
        case 1:
          return "未开始";
        case 2:
          return "进行中";
        case 3:
          return "已结束";
        // case 4:
        //   return "已过期";
        // case -1:
        //   return "未发布";
      }
    }
  },
  data() {
    return {
      headerTitle: "投票管理",
      currentPage: 1,
      total: 1,
      ends: false,
      id: "2",
      endId: "",
      voteType: "",
      voteShowType: "",
      scoreShowType: "",
      photoStatus: "", //头像 0不显示 1显示
      tableDatas: [],
      statusList: [
        { label: "全部" },
        { label: "草稿", status: 0 },
        { label: "未开始", status: 1 },
        { label: "进行中", status: 2 },
        { label: "已结束", status: 3 }
        // { label: "已过期", status: 4 }
      ],
      formInline: {
        type: 0,
        status: null,
        startTime: null,
        endTime: null,
        voteName: null,
        createBy: null
      }
    };
  },
  mounted() {
    this.caseCollection(this.currentPage);
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
    caseCollectSst(id, status) {
      let params = {
        voteId: id,
        forbidden: status
      };
      http.post(api.forbiddenVote, params).then(res => {
        if (res.data.code === 0) {
          this.caseCollection(this.currentPage);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    caseCollection: async function(pageNum) {
      // if (this.formInline.startTime > this.formInline.endTime) {
      //   this.$message.error("开始时间不能大于结束时间");
      //   return false;
      // }
      if(this.formInline.endTime !== null){
        if (this.formInline.startTime > this.formInline.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      let params = {};
      if (
        this.formInline.status === null &&
        this.formInline.startTime === null &&
        this.formInline.endTime === null &&
        this.formInline.name === null &&
        this.formInline.createBy === null
      ) {
        params = {
          pageNum: pageNum,
          pageSize: 10,
          ...this.formInline
        };
      } else {
        this.formInline.status === ""
          ? (this.formInline.status = null)
          : this.formInline.status;
        this.formInline.name === ""
          ? (this.formInline.name = null)
          : this.formInline.name;
        this.formInline.createBy === ""
          ? (this.formInline.createBy = null)
          : this.formInline.createBy;
        params = {
          pageNum: pageNum,
          pageSize: 10,
          ...this.formInline
        };
      }
      const res = await http.post(api.voteCaseList, params);
      if (res.data.code === 0) {
        this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        // this.photoStatus = res.data.data.list.photoStatus;
        // this.voteShowType = res.data.data.list.voteShowType;
        // this.scoreShowType = res.data.data.list.scoreShowType;
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
    godetails(id, voteType, voteShowType, scoreShowType) {
      this.$router.push({
        path: "/activity/normalVoteDetail/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType,
          voteShowType: voteShowType,
          scoreShowType: scoreShowType
        }
      });
    },
    goranklist(id, voteType) {
      this.$router.push({
        path: "/activity/normalRankingList/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType
        }
      });
    },
    govoteSelect(id,photoStatus) {
      this.$router.push({
        path: "/activity/normalVoteSelect/" + id,
        query: {
          page: this.currentPage,
          photoStatus: photoStatus
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
      this.formInline.startTime = Date.parse(this.formInline.startTime);
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
        voteId: this.endId
      };
      const res = await http.post(api.endVoteCase, params);
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

<style scoped>
</style>
