<template>
  <div class="participants">
    <div class="message">
      <span>收集病例情况：{{totalCount}}份</span>
      <div class="charts-box" v-if="taskStatisticsShow">
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 1 && taskstatisticsOne"
            title="一级审核"
            :data="taskstatisticsOne"
          />
        </div>
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 2 && taskstatisticsTwo"
            title="二级审核"
            :data="taskstatisticsTwo"
          />
        </div>
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 3 && taskstatisticsThree"
            title="三级审核"
            :data="taskstatisticsThree"
          />
        </div>
      </div>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.nickname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" placeholder="请输入手机号">
        <el-input v-model="formInline.phone"></el-input>
      </el-form-item>
      <el-form-item label="医院" placeholder="请输入医院">
        <el-input v-model="formInline.hospital"></el-input>
      </el-form-item>
      <el-form-item label="病例名称" placeholder="请输入病例名称">
        <el-input v-model="formInline.title"></el-input>
      </el-form-item>
      <el-form-item label="病例状态" v-show="taskstatistics.auditTask">
        <el-select v-model="formInline.states" placeholder="请选择">
          <el-option
            v-for="item in optionsStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省份" placeholder="请输入省份名称">
        <el-input v-model="formInline.province"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="caseExport">导出</el-button>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tabData" border>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.county }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.office}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="病例名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="提交时间">
        <template slot-scope="scope">
          <span v-if="scope.row.commitTime">{{ scope.row.commitTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask" width="110px" label="一级审核状态">
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankOneApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column width="140px" v-if="taskstatistics.auditTask" label="审核时间">
        <template slot-scope="scope">
          <span v-html="$options.filters.formatDate(scope.row.rankOneApproveTime)"></span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1" width="110px" label="一级审核人">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankOneApproveUserName"
            class="taskMessage"
          >{{scope.row.rankOneApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.isRemark && taskstatistics.auditTask && taskstatistics.auditTask.rank >=1"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankOneRemark" class="taskMessage">{{scope.row.rankOneRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && taskstatistics.auditTask.isComment" width="110px" label="专家评分">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankOneStarScore"
            class="taskMessage"
          >{{scope.row.rankOneStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && taskstatistics.auditTask.isComment" width="440px" label="专家点评">
        <template slot-scope="scope">
          <span v-if="scope.row.rankOneComment" class="taskMessage">{{scope.row.rankOneComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2" width="110px" label="二级审核状态">
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankTwoApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column width="140px" v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2" label="审核时间">
        <template slot-scope="scope">
          <span v-html="$options.filters.formatDate(scope.row.rankTwoApproveTime)"></span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2" width="110px" label="二级审核人">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankTwoApproveUserName"
            class="taskMessage"
          >{{scope.row.rankTwoApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.isRemark && taskstatistics.audit && taskstatistics.auditTask.rank >=2"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankTwoRemark" class="taskMessage">{{scope.row.rankTwoRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && taskstatistics.auditTask.isComment" width="110px" label="专家评分">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankTwoStarScore"
            class="taskMessage"
          >{{scope.row.rankTwoStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && taskstatistics.auditTask.isComment" width="440px" label="专家点评">
        <template slot-scope="scope">
          <span v-if="scope.row.rankTwoComment" class="taskMessage">{{scope.row.rankTwoComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3" width="110px" label="三级审核状态">
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankThreeApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column width="140px" v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3" label="审核时间">
        <template slot-scope="scope">
          <span v-html="$options.filters.formatDate(scope.row.rankThreeApproveTime)"></span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3" width="110px" label="三级级审核人">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankThreeApproveUserName"
            class="taskMessage"
          >{{scope.row.rankThreeApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.isRemark && taskstatistics.auditTask"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankThreeRemark" class="taskMessage">{{scope.row.rankThreeRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3 && taskstatistics.auditTask.isComment" width="110px" label="专家评分">
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankThreeStarScore"
            class="taskMessage"
          >{{scope.row.rankThreeStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>
      <el-table-column v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3 && taskstatistics.auditTask.isComment" width="440px" label="专家点评">
        <template slot-scope="scope">
          <span v-if="scope.row.rankThreeComment" class="taskMessage">{{scope.row.rankThreeComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)">----</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" label="状态">
        <template slot-scope="scope">
          <span class="taskMessage">{{scope.row.isStop ? '停用' : '启用'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150px">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetail(scope.row.id)">查看</el-button>
          <el-button
            v-show="scope.row.isStop"
            type="success"
            size="small"
            @click="stop(scope.row.id, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.isStop"
            type="danger"
            size="small"
            @click="stop(scope.row.id, 1)"
          >停用</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import TaskStatistics from "./Echarts/TaskStatistics";
import TableList from "../../../components/table-content/TableList";

export default {
  name: "participants",
  components: { TableList, TaskStatistics },
  props: ["id", "page"],
  data() {
    return {
      optionsStates: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 1,
          label: "已通过"
        },
        {
          value: 2,
          label: "审核未通过"
        },
        {
          value: 3,
          label: "已失效"
        }
      ],
      taskStatisticsShow: true,
      taskstatistics: {
        // 审核流程统计
        auditTask: {
          isRemark: 0, //有无备注
          isComment: 0, //有无评分点评
          rank: 1
        },
        taskRank: 0, // 审核任务级别，根据实际需要显示几级审核(如果taskRank为0,表示当前病例征集活动未关联审核任务)
        rankOneApproveUnderWay: null, // 一级审核未审
        rankOneApproved: null, // 一级审核已审
        rankOneApprovedPass: null, // 一级审核通过
        rankOneApprovedNoPass: null, // 一级审核未通过
        rankOneEfficacy: null, // 一级审核已失效
        rankTwoApproveUnderWay: null, // 二级审核未审
        rankTwoApproved: null, //二级审核已审
        rankTwoApprovedPass: null, // 二级审核通过
        rankTwoApprovedNoPass: null, // 二级审核未通过
        rankTwoEfficacy: null, // 二级审核已失效
        rankThreeApproveUnderWay: null, // 三级审核未审
        rankThreeApproved: null, // 三级审核已审
        rankThreeApprovedPass: null, // 三级审核通过
        rankThreeApprovedNoPass: null, // 三级审核未通过
        rankThreeEfficacy: null // 三级审核已失效
      },
      taskstatisticsOne: null,
      taskstatisticsTwo: null,
      taskstatisticsThree: null,
      totalCount: 0, // 病例总数
      passCount: 0, // 已通过病例数量
      tabData: [],
      currentPage: 1,
      caseCollectId: "",
      total: 1,
      formInline: {
        nickname: null,
        hospital: null,
        phone: null,
        title: null,
        states: null,
        province: null,
        caseCollectId: this.$route.params.id
      }
    };
  },
  watch: {
    id(item) {
      this.formInline.caseCollectId = item;
      this.id = item;
      if (this.$route.query.pages) {
        let page = Number(this.$route.query.pages);
        this.currentPage = page;
      } else {
        this.currentPage = this.currentPage;
      }
      this.participants(this.currentPage);
      this.statisticsCount();
      this.taskstatisticsCount();
    }
  },
  filters: {
    sex(item) {
      switch (item) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return " ";
      }
    },
    statusHtml(item) {
      switch (item) {
        case "待审核":
          return `<span style="color: rgb(252, 81, 12)">${item}</span>`;
        case "审核中":
          return `<span style="color: rgb(252, 81, 12)">${item}</span>`;
        case "已通过":
          return `<span style="color: rgb(19, 139, 1)">${item}</span>`;
        case "审核未通过":
          return `<span style="color: rgb(252, 0, 6)">${item}</span>`;
        case "已失效":
          return `<span style="color: rgb(19, 139, 1)">${item}</span>`;
        case undefined:
          return `<span style="color: rgb(19, 139, 1)">----</span>`;
        default:
          return `<span>${item}</span>`;
      }
    },
    formatDate(time) {
      if (!time) {
        return '<span style="color: rgb(19, 139, 1)">----</span>';
      }
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
      this.currentPage = page;
    } else {
      this.currentPage = this.currentPage;
    }
  },
  mounted() {
    this.participants(this.currentPage);
    this.statisticsCount();
    this.taskstatisticsCount();
  },
  methods: {
    stop(id, type) {
      // 停用   启用
      this.$http.get(this.$api.case.stop + `${id}/${type}`).then(res => {
        let { code, message } = res.data;
        if (code === 0) {
          this.participants(this.currentPage);
        } else {
          this.$message.error(message);
        }
      });
    },
    taskstatisticsCount() {
      // 获取审核流程
      http.get(api.taskstatisticsCount + this.id).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          this.taskstatistics = data;
          if (data.auditTask) {
            this.taskstatistics.auditTask = data.auditTask;
            // console.log(this.taskstatistics.auditTask)
            // this.taskstatistics.taskRank = data.auditTask.rank;
          }else{
            this.taskstatistics.auditTask =""
          }
          this.taskstatisticsOne = [
            {
              name: "已通过",
              value: data.rankOneApprovedPass
            },
            {
              name: "未通过",
              value: data.rankOneApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankOneEfficacy
            },
            {
              name: "未审核",
              value: data.rankOneApproveUnderWay
            }
          ];
          this.taskstatisticsTwo = [
            {
              name: "已通过",
              value: data.rankTwoApprovedPass
            },
            {
              name: "未通过",
              value: data.rankTwoApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankTwoEfficacy
            },
            {
              name: "未审核",
              value: data.rankTwoApproveUnderWay
            }
          ];
          this.taskstatisticsThree = [
            {
              name: "已通过",
              value: data.rankThreeApprovedPass
            },
            {
              name: "未通过",
              value: data.rankThreeApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankThreeEfficacy
            },
            {
              name: "未审核",
              value: data.rankThreeApproveUnderWay
            }
          ];
          this.taskStatisticsShow = false;
          this.$nextTick(() => {
            this.taskStatisticsShow = true;
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    async caseExport() {
      await http.get(api.caseFillExport + this.id).then(res => {
        const data = res.data;
        if (data.code !== 0) {
          this.$message.error(data.message);
        } else {
          window.open(data.data);
        }
      });
    },
    async statisticsCount() {
      await http
        .get(api.statisticsCount + this.id)
        .then(res => {
          const data = res.data;
          if (data.code !== 0) {
            this.$message.error(data.message);
          } else {
            this.passCount = res.data.data.passCount;
            this.totalCount = res.data.data.totalCount;
          }
        })
        .catch(error => {
          this.$message.error(res.data.message);
        });
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
    participants: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params: this.formInline
      };
      const res = await http.post(api.participants, params);
      if (res.data.code === 0) {
        this.tabData = res.data.data.data;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.charts-box {
  display: flex;
  /*flex-wrap: wrap;*/
  overflow-x: auto;
  justify-content: space-between;
}

.charts-witdh {
  width: 400px;
}

.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}

.message span,
.message p {
  color: $c-theme;
}

.message p {
  margin-left: 20px;
}

.message p span {
  margin-right: 20px;
}

.taskMessage {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
