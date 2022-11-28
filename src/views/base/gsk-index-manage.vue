<template>
  <div class="modelist">
    <header-content
      v-if="activeName == firstNav"
      :title="headerTitle"
      :opertions="opertionsFirst"
      @header-btn-click="headerClick"
    ></header-content>
    <header-content
      v-if="activeName == secondNav"
      :title="headerTitle"
      @header-btn-click="headerClick"
    ></header-content>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="轮播图设置" name="firstNav">
          <first-nav :table-data="tableDataFirst"/>
        </el-tab-pane>
        <el-tab-pane label="Banner设置" name="secondNav">
          <second-nav :table-data="tableDataSecond"/>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div style="margin: 20px"></div>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
import FirstNav from "./gskIndex/FirstNav";
import SecondNav from "./gskIndex/SecondNav";
export default {
  name: "modelist",
  components: {
    HeaderContent,
    FirstNav,
    SecondNav
  },
  data() {
    return {
      activeName: "firstNav",
      value: "",
      searchVal: "",
      tableDataFirst: [],
      tableDataSecond: [],
      total: 1,
      currentPage: 1,
      num1: 1,
      dialogFormAddOne: false,
      form: {
        name: "",
        showOrder: ""
      },
      existBusiness: [],
      id: "",
      isId: false,
      menuId: "",
      opertionsFirst: ["创建"],
      headerTitle: "首页设置"
    };
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  mounted() {
    this.getParentList();
  },
  methods: {
    tabClick() {
      if (this.activeName == "firstNav") {
        this.getParentList();
      } else if (this.activeName == "secondNav") {
        this.getChildList();
      }
    },
    getParentList: async function() {
      var res = await http.get(api.homePageConfigManageList + 1);
      if (res.data.code === 0) {
        this.tableDataFirst = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    getChildList: async function() {
      var res = await http.get(api.homePageConfigManageList + 2);      
      if (res.data.code === 0) {
        this.tableDataSecond = res.data.data;  
      } else {
        this.$message.error(res.data.message);
      }
    },
    
    headerClick() {
      this.$router.push({
        path: "/basedata/gskCreatIndex"
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
<style scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}
.el-form-item__content {
  width: 150px !important;
}
</style>
