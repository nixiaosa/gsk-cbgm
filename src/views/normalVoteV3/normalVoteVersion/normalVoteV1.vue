<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动状态">
        <el-select v-model="formInline.activityStatus" placeholder="请选择活动状态">
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
        <el-input v-model="formInline.title" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="formInline.creatorName" placeholder="请输入创建人名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column label="投票活动名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
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
          <span>{{ scope.row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与人数" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.participateNums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activityStatus | getState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.stopFlag | gethasForbidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <div>
          <el-button type="info" size="small" @click="godetails(scope.row.id,scope.row.voteType,scope.row.voteShowType,scope.row.scoreShowType,scope.row.voteId)">详情</el-button>
          <el-button
            v-show="scope.row.activityStatus !== 0"
            type="info"
            size="small"
            @click="goranklist(scope.row.id,scope.row.voteType,scope.row.voteId, scope.row.title,scope.row.actType)"
          >排行榜</el-button>
          <el-button type="info" size="small" @click="govoteSelect(scope.row.id,scope.row.photoStatus,scope.row.voteId)">投票选项</el-button>
          <el-button
            v-show="scope.row.stopFlag"
            type="success"
            size="small"
            @click="caseCollectSst(scope.row.voteId, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.stopFlag"
            :disabled="scope.row.activityStatus !== 2"
            type="warning"
            size="small"
            @click="caseCollectSst(scope.row.voteId, 1)"
          >暂停</el-button>
          <!-- <el-button
            v-show="scope.row.status === 1 || scope.row.status === 2"
            type="danger"
            size="small"
            @click="endcase(scope.row.id)"
          >结束活动</el-button> -->
          </div>
          <div style="margin-top:10px">
             <el-button 
              type="info" 
              size="small"
              @click="goVoteSet(scope.row.id,scope.row.voteId,scope.row.actType)"
            >投票设置</el-button>
          <el-button 
            type="info" 
            size="small"
            @click="goStyleSet(scope.row.id,scope.row.voteId)"
          >外观设置</el-button>
          <el-button 
            type="info" 
            size="small"
            @click="goApplyList(scope.row)"
          >申请管理</el-button>
          </div>
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
  name: "normalVoteV3",
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
          return "暂停";
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
      tableData: [],
      tableData2: [],
      statusList: [
        { label: "全部" },
        { label: "草稿", status: 0 },
        { label: "未开始", status: 1 },
        { label: "进行中", status: 2 },
        { label: "已结束", status: 3 }
        // { label: "已过期", status: 4 }
      ],
      formInline: {
        // type: 0,
        // status: null,
        // startTime: null,
        // endTime: null,
        // voteName: null,
        // createBy: null

        activityStatus: null,
        creatorName: null,
        title: null,
        startTime: null,
        endTime: null,
      }
    };
  },
  async mounted() {
    await this.caseCollection(this.currentPage);
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
    goApplyList(row){
      this.$router.push({
        path: "normalVote/applylist/" + row.voteId,
        query: {
          isAutoAudit: row.isAutoCheck
        }
      });
    },
    caseCollectSst(voteId, status) {
      let params = {
        ids: [voteId],
        stopFlag: status
      };
      http.post(api.voteControlEnable, params).then(res => {
        if (res.data.code === 0) {
          this.caseCollection(this.currentPage);
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    caseCollection: async function(pageNum) {
      if(this.formInline.endTime !== null){
        if (this.formInline.startTime > this.formInline.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      let params = {};
       
        params = {
          pageIndex: pageNum,
          pageSize: 10,
          param: {
            ...this.formInline
          }
        }
      
      const res = await http.post(api.voteManageList, params);
      if (res.data.code === 0) {
        // this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        this.tableData = res.data.data.records;
      } else {
        this.$message.error(res.data.message);
      }
    },
    godetails(id, voteType, voteShowType, scoreShowType, voteId) {
      this.$router.push({
        path: "/activity/normalVoteDetailV3/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType,
          voteShowType: voteShowType,
          scoreShowType: scoreShowType,
          voteId: voteId
        }
      });
    },
    goVoteSet(id,voteId,actType) {
      this.$router.push({
        path: "/activity/voteSet/" + id,
        query: {
          voteId: voteId,
          actType: actType
        }
      });
    },
    goStyleSet(id,voteId) {
      this.$router.push({
        path: "/activity/styleSet/" + id,
        query: {
          voteId: voteId
        }
      });
    },
    goranklist(id, voteType, voteId, title, actType) {
      this.$router.push({
        path: "/activity/normalRankingListV3/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType,
          voteId: voteId,
          title: title,
          actType: actType
        }
      });
    },
    govoteSelect(id,photoStatus,voteId) {
      this.$router.push({
        path: "/activity/normalVoteSelectV3/" + id,
        query: {
          page: this.currentPage,
          photoStatus: photoStatus,
          voteId: voteId
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
