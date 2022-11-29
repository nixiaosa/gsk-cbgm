<!--
 * @Author: chance Lau
 * @Date: 2020-10-26 10:56:57
 * @LastEditTime: 2022-11-29 19:48:33
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/navigationManageNew/base/FirstNav.vue
-->
<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="轮播图">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" style="width:350px;height:150px" />
        </template>
      </el-table-column>
      <el-table-column label="链接地址">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.linkUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="排序">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.seqNumber"
            min="0"
            type="number"
            :disabled="true"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.isDel | isDel }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="info"
            size="small"
            style="margin-right:10px"
          >编辑</el-button>
          <el-button
            v-if="scope.row.isDel == 1"
            @click="navSwitchUp(scope.row)"
            type="success"
            size="small"
          >{{ '启用' }}</el-button>
          <el-button
            v-if="scope.row.isDel == 0"
            @click="navSwitchDown(scope.row)"
            type="danger"
            size="small"
          >{{ '停用' }}</el-button>
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
  name: "FirstNav",
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
      classStop: false,
      form: {
          type: 1, // 1轮播2banner
          imgUrl: '',
          linkUrl: '',
          seqNumber: 1,
          isDel: 0,
          proUuid: this.$route.query.proUuid ? this.$route.query.proUuid : null
        },
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
    isDel(num){
      if (num === 0) {
        return "已启用";
      } else if (num === 1) {
        return "已停用";
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
    navSwitchUp: async function(row) {
        let params = {
          type: 1, // 1轮播2banner
          isDel: 0,
          id: row.id,
        }
        const res = await http.post(api.homePageConfigManageSet,params)
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.$emit('change', 'lc')
          window.scrollTo(0, 0)
          $("html,body",window.parent.document).animate({scrollTop:0},1000)
        } else {
          this.$message.error(res.data.message)
        }
    },
     navSwitchDown: async function(row) {
        let params = {
          type: 1, // 1轮播2banner
          isDel: 1,
          id: row.id,
        }
        const res = await http.post(api.homePageConfigManageSet,params)
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          this.$emit('change', 'lc')
          window.scrollTo(0, 0)
          $("html,body",window.parent.document).animate({scrollTop:0},1000)
        } else {
          this.$message.error(res.data.message)
        }
    },
    handleClick(rows) {
      this.$router.push({
        path: "/basedata/gskCreatIndex",
        query: {
          id: rows.id,
          type: rows.type,
          proUuid: rows.proUuid
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
