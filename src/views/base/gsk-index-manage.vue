<template>
  <div class="modelist">
    <header-content
      :title="headerTitle"
      :opertions="opertionsFirst"
      @header-btn-click="headerClick"
    ></header-content>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="轮播图设置" name="firstNav">
          <first-nav :table-data="tableDataFirst" @change="navChange"/>
        </el-tab-pane>
        <el-tab-pane label="Banner设置" name="secondNav">
          <second-nav :table-data="tableDataSecond" @change="navChange"/>
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
    this.getParentList(1);
  },
  methods: {
    tabClick() {
      // console.log(this.activeName)
      if (this.activeName == "firstNav") {
        this.currentPage = 1;
        this.getParentList(1);
        // console.log(this.activeName)
      } else if (this.activeName == "secondNav") {
        this.currentPage = 1;
        this.getChildList(1);
        // console.log(this.activeName)
      } else {
        this.currentPage = 1;
        this.getThirdList(1);
      }
    },
    getParentList: async function(page) {
      //获取一级栏目
      var params = {
        pageNum: page,
        pageSize: 10,
        navigationLevel: 1
      };
      var res = await http.post(api.getNavigationList, params);
      if (res.data.code === 0) {
        this.tableDataFirst = res.data.data.list;
        this.total = res.data.data.total;
        
      } else {
        this.$message.error(res.data.message);
      }
    },
    getChildList: async function(page) {
      //获取二级栏目
      var params = {
        pageNum: page,
        pageSize: 10,
        navigationLevel: 2
      };
      var res = await http.post(api.getNavigationList, params);
      if (res.data.code === 0) {
        this.tableDataSecond = res.data.data.list;
        this.total = res.data.data.total;
        
      } else {
        this.$message.error(res.data.message);
      }
    },
    getThirdList: async function(page) {
      //获取二级栏目
      var params = {
        pageNum: page,
        pageSize: 10,
        navigationLevel: 3
      };
      var res = await http.post(api.getNavigationList, params);
      if (res.data.code === 0) {
        this.tableDataThird = res.data.data.list;
        this.total = res.data.data.total;
        
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      if (this.activeName == "firstNav") {
        this.getParentList(val);
      } else if (this.activeName == "secondNav") {
        this.getChildList(val);
      } else {
        this.getThirdList(val);
      }
    },
    
    headerClick() {
      this.$router.push({
        path: "/basedata/gskCreatIndex"
      });
    },
    navChange(v) {
      if (v == "firstNav") {
        this.getParentList(this.currentPage);
      } else if (v == "secondNav") {
        this.getChildList(this.currentPage);
      }
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
