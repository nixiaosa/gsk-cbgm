<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="form.userName" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" placeholder="请输入创建人名称"></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="form.audit" placeholder="请选择审核状态">
          <el-option
            v-for="(item,index) in auditList"
            :key="index"
            :label="item.label"
            :value="item.status"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="search">查询</el-button>
        <el-button type="info" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.videoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span>{{ scope.row.audit | getState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <el-button v-if="scope.row.audit != 0" type="info" size="small" @click="godetails(scope.row)">详情</el-button>
          <el-button v-if="scope.row.audit == 0" type="info" size="small" @click="godetails(scope.row)">审核</el-button>
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
import HeaderContent from "@/components/header-content";
export default {
  name: "matchAudit",
  components: {
    HeaderContent
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatDates(time) {
      var date = new Date(time);
      if (time) {
        return formatDate(date, "yyyy-MM-dd hh:mm");
      } else {
        ("");
      }
    },
    getState(state) {
      switch (state) {
        case 0:
          return "待审核";
        case 1:
          return "审核通过";
        case 2:
          return "审核未通过";
      }
    }
  },
  data() {
    return {
      headerTitle: "参赛作品审核",
      tableData: [],
      currentPage: 1,
      total: 1,
      auditList: [
        {
          label: "全部",
          status: null
        },
        {
          label: "待审核",
          status: 0
        },
        {
          label: "审核通过",
          status: 1
        },
        {
          label: "审核未通过",
          status: 2
        }
      ],
      form: {
        userName: "",
        phone: "",
        audit: null
      }
    };
  },
  async mounted() {
    await this.getAuditList(1);
  },
  created() {},
  methods: {
    handleCurrentChange(val) {
      this.getAuditList(val);
      this.currentPage = val;
    },
    godetails(row) {
      this.$router.push({
        path: "/basedata/match/auditDetail" + '/' + row.id,
      });
    },
    reset() {
      this.form.userName = '';
      this.form.phone = '';
      this.form.audit = '';
      this.getAuditList(1);
    },
    search(){
      this.getAuditList(1);
    },
    getAuditList: async function(pageNum) {
      let params = {
        pageSize: 10,
        pageNum: pageNum,
        ...this.form
      };
      const res = await http.post(api.matchAuditList, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    }
  }
};
</script>

<style scoped>
</style>
