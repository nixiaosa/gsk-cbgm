<template>
  <div class="winner">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="奖品情况" name="first"></el-tab-pane>
    </el-tabs>
    <div style="margin:20px 0; text-align:right">
      <el-button type="primary" @click="answerExport" size="small">导出</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column width="300" label="奖项名称">
        <template slot-scope="scope">
          <span>{{ scope.row.prizeName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="奖品描述">
        <template slot-scope="scope">
          <span>{{ scope.row.prizeDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品数量">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖人数">
        <template slot-scope="scope">
          <span>{{ scope.row.winCount }}</span>
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
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";

export default {
  components: {
    HeaderContent
  },
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      activeName: "first",
      headerTitle: "抽奖列表 > 抽奖统计",
      opertions: ["返回"]
    };
  },
  filters: {},
  mounted() {
    this.LotteryCountlist(1);
  },
  methods: {
    LotteryCountlist: async function() {
      var params = {
        lotteryId: this.$route.params.lotteryId,
        pageSize: 10,
        pageNum: this.currentPage
      };

      var res = await http.post(api.lotteryGameCount, params);
      if (res.data.code === 200) {
        this.tableData = res.data.data.rows;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.msg);
      }
    },

    headerClick() {
      this.$router.go(-1);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.LotteryCountlist(val);
    },
    async answerExport() {
      await http
        .get(api.statisticsExcel + "/" + this.$route.params.lotteryId)
        .then(res => {
          const data = res.data;
          if (data.code !== 200) {
            this.$message.error(data.msg);
          } else {
            window.open(data.data.url);
          }
        });
    }
  }
};
</script>
<style scoped>
.infos-block {
  display: flex;
}

.infos-block .infos-self {
  display: inline-block;
  width: 100px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  /* margin-right: 30px; */
}

.infos-block .infos-content {
  display: inline-block;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  margin-right: 30px;
}

.winner-one {
  overflow: hidden;
  padding: 20px 0;
}

.winner-one .winner-list:nth-child(1) {
  width: 150px;
}

.winner-one .winner-list:nth-child(2) {
  width: 180px;
}

winner-one .winner-list:nth-child(3) {
  width: 400px;
}

.winner-list {
  float: left;
  margin: 0 20px 0 0;
}

.winners {
  width: 200px;
}

.demo-form-inline {
  height: 55px;
  overflow: hidden;
}
</style>


