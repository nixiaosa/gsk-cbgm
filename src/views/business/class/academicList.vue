<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <div class="piont-flex" style="border:none;margin:20px 0;">
      <div class="point-title">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="名称:" class="searchStyle">
            <el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item class="searchStyle">
            <el-button type="primary" @click="getActiveList(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="tableData" border>
      <el-table-column width="300" label="内容名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="聚合类型">
        <template slot-scope="scope">
          <span>学术大会</span>
        </template>
      </el-table-column>
      <el-table-column width="208" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfo.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.userInfo.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="190" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用/停用" width="230">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===0" style="color:#13ce66">启用中</span>
          <span v-if="scope.row.isDeleted===1" style="color:#ff4949">停用中</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="goDetail(scope.row.busId)">查看详情</el-button>
          <el-button
            type="danger"
            size="small"
            @click="stopVideo(scope.row.busId)"
            v-if="scope.row.isDeleted===0"
          >停用</el-button>
          <el-button
            type="success"
            size="small"
            @click="enableVideo(scope.row.busId)"
            v-if="scope.row.isDeleted===1"
          >启用</el-button>
          <el-button type="info" size="small" @click="goClassData(scope.row.busId)">统计信息</el-button>
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
  name: "modelist",
  components: {
    HeaderContent
  },
  data() {
    return {
      formInline: {
        name: ""
      },
      tableData: [],
      headerTitle: "学术大会",
      total: 1,
      pageNum: 1,
      currentPage: 1
    };
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(num) {
      if (num === 0) {
        return "未开始";
      } else if (num === 1) {
        return "进行中";
      } else if (num === 2) {
        return "已结束";
      }
    }
  },

  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page);
      this.currentPage = page;
    }
  },
  mounted() {
    this.getActiveList(this.currentPage);
  },
  methods: {
    // 统计信息按钮点击事件
    goClassData(id) {
      let page = this.currentPage;
      this.$router.push({
        path: "classdataAcademic/" + id + "/" + page
      });
    },
    goDetail(id) {
      this.$router.push({ path: "/conference/details/" + id });
    },
    getActiveList: async function(pageNum) {
      var params = {
        pageSize: 10,
        pageNum: pageNum,
        params: {
          ...this.formInline,
          businessId: 5
        }
      };
      var res = await http.post(api.meetingList, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.tableData = res.data.data.data;
        this.total = res.data.data.total;
      }
    },
    stopVideo: async function(busId) {
      var res = await http.get(api.meetingStart + busId + "/" + 1, {});
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.getActiveList(this.currentPage);
      }
    },
    enableVideo: async function(busId) {
      var res = await http.get(api.meetingStart + busId + "/" + 0, {});
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.getActiveList(this.currentPage);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActiveList(val);
    }
  }
};
</script>
<style>
</style>
