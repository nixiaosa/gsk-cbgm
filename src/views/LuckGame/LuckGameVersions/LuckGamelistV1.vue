<template>
  <div class="jhg">
    <header-content :title="headerTitle"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form"></Headers>
    <el-button type="primary" class="btnsl" @click="Inquire">查询</el-button>
    <div style="margin:20px;"></div>
    <el-table :data="tableData" border>
      <el-table-column width="240" label="抽奖游戏名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="144" label="模式">
        <template slot-scope="scope">
          <span>{{ scope.row.patternName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="290" label="游戏周期">
        <template slot-scope="scope">
          <span>{{ scope.row.periodBegin | formatDate }}</span>
          -
          <span>{{ scope.row.periodEnd | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="144" label="游戏状态">
        <template slot-scope="scope">
          <span>{{ scope.row.states | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="260" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="godetail(scope.row.id)"
            v-if="userAuths.activity_game_detail"
          >查看详情</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.id,1)"
            v-if="scope.row.status == 0"
          >启用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.id,0)"
            v-if="scope.row.status == 1"
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
import HeaderContent from "@/components/header-content";
import Headers from "../base/header1";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
export default {
  name: "LuckGamelist",
  components: {
    HeaderContent,
    Headers
  },
  data() {
    return {
      tableData: [],
      headerTitle: "抽奖游戏管理",
      form: {
        title: "",
        startTime: "",
        endTime: "",
        status: ""
      },
      total: 0,
      currentPage: 1,
      labelPosition: "left",
      itemDatas: [
        {
          label: "游戏状态",
          placeholder: "请选择"
        },
        {
          label: "游戏周期"
        },
        {
          label: "游戏名称",
          placeholder: "请输入游戏名称"
        }
      ],
      options: [
        {
          label: "全部"
        },
        {
          status: 1,
          label: "未开始"
        },
        {
          status: 0,
          label: "未发布"
        },
        {
          status: 2,
          label: "进行中"
        },
        {
          status: 3,
          label: "已结束"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["userAuths"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      if (state === 0) {
        return "未发布";
      } else if (state === 1) {
        return "未开始";
      } else if (state === 2) {
        return "进行中";
      } else if (state === 3) {
        return "已结束";
      }
    },
    getStatus(status) {
      if (status === 0) {
        return "停用";
      } else if (status === 1) {
        return "启用";
      }
    }
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = Number(this.$route.query.page);
    }
  },
  mounted() {
    this.luckyGamelist(1);
  },
  methods: {
    forbidden: async function(id, status) {
      var res = await http.get(
        api.luckyGameForbidden + "/" + id + "/" + status
      );
      if (res.data.code === 0) {
        this.luckyGamelist(this.currentPage);
        this.$message.success(res.data.data);
      } else {
        this.$message.error(res.data.data);
      }
    },

    godetail(id) {
      let page = this.currentPage;
      this.$router.push({ path: "luckdetail/gamedetail/" + id + "/" + page });
    },
    luckyGamelist: async function() {
      var params1 = {
        pageSize: 10,
        pageNum: this.currentPage,
        params: {}
      };
      if (
        this.form.status !== "" ||
        this.form.startTime !== "" ||
        this.form.endTime !== "" ||
        this.form.title !== ""
      ) {
        params1 = {
          pageSize: 10,
          pageNum: this.currentPage,
          params: {
            states: this.form.status,
            periodBegin: this.form.startTime,
            periodEnd: this.form.endTime,
            name: this.form.title
          }
        };
      }
      if (this.form.startTime !== "" && this.form.endTime !== "") {
        if (this.form.startTime > this.form.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      var res = await http.post(api.luckyGamelist, params1);
      // console.log(res);
      if (res.data.code === 0) {
        this.tableData = res.data.data.data;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    Inquire: async function() {
      this.luckyGamelist(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.luckyGamelist(val);
    }
  }
};
</script>
<style scoped>
.btnsl {
  /* width: 130px; */
  position: absolute;
  top: 140px;
}
</style>


