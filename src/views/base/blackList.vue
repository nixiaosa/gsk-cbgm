<template>
  <div class="createTenant">
    <header-content :title="headerTitle"></header-content>
    <div class="basicInfo">
      <el-form :model="basicInfo" ref="basicInfo" label-width="100px" class="demo-ruleForm">
        <div>
          <el-form-item label="手机号码：" prop="name">
            <el-input class="input400" v-model="basicInfo.username"></el-input>
            <el-button type="primary" @click="search()" style="margin-left:20px">{{searchButton}}</el-button>
          </el-form-item>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
        >
          >
          <el-table-column label="手机号码" width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="锁定时间">
            <template slot-scope="scope">
              <span>{{ scope.row.freezeTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="解除剩余时间">
            <template slot-scope="scope">
              <span>{{ Number(scope.row.freezeExpire) | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="setVisible(scope.row.userId)"
              >解除绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-pagination
        background
        :current-page="pageNum"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
        :page-size="20"
        style="margin-top:20px"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
// import http from "@/utils/tenant";
// import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
// import { mapGetters } from "vuex";

export default {
  name: "createTenant",
  components: {
    HeaderContent
  },
  data() {
    return {
      headerTitle: "黑名单用户",
      searchButton: "查询",
      dialogShow: false,
      dialogHide: false,
      pageNum: 1,
      tableData: [],
      multipleSelection: [],
      multipleLength: 0,
      multipleArray: [],
      total: 1,
      basicInfo: {
        username: ''
      }
    };
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  computed: {},
  mounted() {
    this.frozenList();
  },
  methods: {
    frozenList: async function() {
      let params = {
        username: this.basicInfo.username,
        pageNum: this.pageNum,
        pageSize: 20,
        systemType: 3
      };
      let res = await this.$http.post(this.$api.frozenList, params);
      this.tableData = res.data.data.list;
      this.total = res.data.data.total;
      if (res.data.code !== 200) {
        this.errorTost(res.data.message);
      }
    },
    search: async function() {
      this.pageNum = 1;
      this.frozenList();
    },
    setVisible: async function(userId) {
      let params = {
        userId: userId
      };
      let res = await this.$http.post(this.$api.unfreeze, params);
      if (res.data.code !== 200) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("解冻成功");
        this.frozenList(this.pageNum);
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.frozenList();
    },
    messageTost(val) {
      // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: "success"
      });
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: "error"
      });
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.basicInfo {
  margin-top: 30px;
  margin-left: 20px;
}
.input400 {
  width: 400px;
}
strong {
  margin: 0 3px;
  color: #f00;
}
.title-info {
  p {
    line-height: 1;
    font-size: 12px;
    &:last-child {
      text-indent: 37px;
    }
  }
}
</style>
