<!--
 * @Author: chance Lau
 * @Date: 2020-10-26 10:57:15
 * @LastEditTime: 2022-11-04 11:37:45
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/navigationManageNew/base/SecondNav.vue
-->

<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="三级栏目">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联一级栏目">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.relateLevelOneName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联二级栏目">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.relateLevelTwoName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="排序">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.showOrder"
            min="0"
            type="number"
            :disabled="true"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.origin != 1"
            @click="handleClick(scope.row.name,scope.row.showOrder,scope.row.id, scope.row.businessId)"
            type="info"
            size="small"
            style="margin-right:10px"
          >编辑</el-button>
          <el-button
            v-if="scope.row.origin != 1"
            @click="navSwitch(scope.row)"
            :type="scope.row.status === 1 ? 'danger' : 'success'"
            size="small"
          >{{ scope.row.status === 1 ? '停用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import { formatDate } from "@/common/data";

export default {
  name: "ThirdNav",
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      classDetail: false,
      classStatic: false,
      classStop: false
    };
  },
  computed: {
    ...mapGetters(["userAuths", "companyid"])
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return "";
      }
      time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getType(num) {
      if (num === 1) {
        return "网站首页";
      } else if (num === 2) {
        return "开放视频类型";
      } else if (num === 3) {
        return "封闭视频类型";
      } else if (num === 4) {
        return "文章类型";
      } else if (num === 5) {
        return "活动类型";
      } else if (num === 6) {
        return "商城类型";
      } else if (num === 7) {
        return "组合类型";
      } else if (num === 8) {
        return "外链类型";
      } else if (num === 9) {
        return "资料类型";
      }
    },
    hasChild(num) {
      if (num === 0) {
        return "否";
      } else if (num === 1) {
        return "是";
      }
    }
  },
  mounted() {},
  methods: {
    inform(affair, props) {
      let params = {
        affair: affair,
        params: props
      };
      this.$emit("change", params);
    },
    navSwitch: async function(val) {
      let id = val.id;
      var res = await http.get(api.navigationForbidden + '/' + id);
      if (res.data.code === 0) {
        if(status == 0){
          this.successTost("操作成功");
        }else{
          this.successTost("操作成功");
        }
        
        this.$emit("change", "thirdNav");
      }else{
        this.errorTost(res.data.message);
      }
    },
    handleClick(name, showOrder, id, businessId) {
      this.$router.push({
        path: "/basedata/addThirdNav",
        query: {
          id: id
        }
      });
    },
    getNavList: async function(page) {
      this.$emit("change", "2");
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: "error"
      });
    },
    successTost(val) {
      // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: "success"
      });
    }
  }
};
</script>

<style scoped>
/deep/ .el-button {
  margin-left: 0;
}
/deep/.el-row:nth-child(odd) {
  margin-left: 0 !important;
}
/deep/.el-row:nth-child(even) {
  margin-right: 5px !important;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:nth-child(odd) {
  margin-left: 5px;
  margin-right: 5px;
}

.active-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
</style>
