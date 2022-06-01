<template>
  <div class="winner">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="用户列表" name="first"></el-tab-pane>
    </el-tabs>

    <el-button type="primary" @click="answerExport" size="small" v-if="identity === 0" style="float:right;margin-bottom:10px">导出</el-button>
    <el-table :data="tableData" v-if="identity === 0" border>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office}}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖次数">
        <template slot-scope="scope">
          <span>{{ scope.row.drawCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中奖个数">
        <template slot-scope="scope">
          <span>{{ scope.row.winCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未中奖次数">
        <template slot-scope="scope">
          <span>{{ scope.row.lostCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近抽奖时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastDrawTime }}</span>
        </template>
      </el-table-column>
    </el-table>



    <div class="identity-tab" v-if="identity === 1">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.titlename }}</el-button>
      <el-button type="primary" @click="answerExport" size="small" style="float:right">导出</el-button>
    </div>

    <div v-if="identity === 1">
        <IdentityTable
        v-if="titleId === 1"
        :data="tableData"
        :tableConfig="doctorConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 2"
        :data="tableData"
        :tableConfig="drugStoreConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 3"
        :data="tableData"
        :tableConfig="companyConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 4"
        :data="tableData"
        :tableConfig="patientConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 5"
        :data="tableData"
        :tableConfig="visitorConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 6"
        :data="tableData"
        :tableConfig="nurseConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 7"
        :data="tableData"
        :tableConfig="pharmacistConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 8"
        :data="tableData"
        :tableConfig="technicianConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
    </div>
    
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
import IdentityTable from "@/views/business/class/base/identityTable";
import LotteryConfig from "@/views/lottery/base/identity.json";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";

export default {
  components: {
    HeaderContent,
    IdentityTable
  },
  data() {
    return {
      titleId: 1,
      identityArr: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      activeName: "first",
      headerTitle: "抽奖列表 > 用户列表",
      opertions: ["返回"],
      identityActive: 0,
      // identityArr: [],
      // identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      doctorConfig: LotteryConfig.doctorConfig, //医生身份
      companyConfig: LotteryConfig.companyConfig, //企业身份
      drugStoreConfig: LotteryConfig.drugStoreConfig, //药店身份
      patientConfig: LotteryConfig.patientConfig, //患者身份
      visitorConfig: LotteryConfig.visitorConfig, //游客身份
      nurseConfig: LotteryConfig.nurseConfig, //护士身份
      pharmacistConfig: LotteryConfig.pharmacistConfig, //药师身份
      technicianConfig: LotteryConfig.technicianConfig //技师身份
    };
  },
  filters: {},
  computed: {
    ...mapGetters(["identity"])
  },
  mounted() {
    this.lotteryAllUsers(1);
    this.getIdentityList();
  },
  methods: {
    identityClick(item, index) {
      // this.identity = item.titleId;
      // this.identityActive = index;

      // this.userList.api.params.identity = item.titleId;
      this.titleId = item.titleId;
      this.identityActive = index;

      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var params = {};
      var res = await http.post(api.getQaIdentityList, params);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.titleId = this.identityArr[0].titleId;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    lotteryAllUsers: async function() {
      var params = {
        lotteryId: this.$route.params.lotteryId,
        identity: this.titleId,
        pageSize: 10,
        pageNum: this.currentPage
      };

      var res = await http.post(api.lotteryAllUsers, params);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
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
      this.lotteryAllUsers(val);
    },
    async answerExport() {
      var params = {
        lotteryId: this.$route.params.lotteryId
      };
      var res = await http.post(api.getAllUserExcel, params);
      if (res.data.code === 200) {
        window.open(res.data.data);
      } else {
        this.$message.error(res.data.msg);
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
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
.identity-tab {
  margin-bottom: 10px;
}
.identity-tab .el-button:hover{
  background-color: $c-theme2;
  color: $c-theme;
  border: 1px solid $c-theme;
}
.identityActive {
  background-color: $c-theme2;
  color: $c-theme;
}
</style>


