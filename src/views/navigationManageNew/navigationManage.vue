<template>
  <div class="modelist">
    <header-content
      :title="headerTitle"
      :opertions="opertionsFirst"
      @header-btn-click="headerClick"
      v-if="activeName == 'firstNav'"
    ></header-content>
    <header-content
      :title="headerTitle"
      :opertions="opertionsSecond"
      @header-btn-click="headerClickSec"
      v-if="activeName == 'secondNav'"
    ></header-content>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="一级栏目" name="firstNav">
          <first-nav :table-data="tableDataFirst" @change="navChange"/>
        </el-tab-pane>
        <el-tab-pane label="二级栏目" name="secondNav">
          <second-nav :table-data="tableDataSecond" @change="navChange"/>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="添加二级栏目" :visible.sync="dialogFormAddOne">
      <el-form :model="form">
        <el-form-item label="二级栏目名称:">
          <el-input style="width:200px;" :maxlength="6" v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联一级栏目:">
          <el-select v-model="value" placeholder="请选择">
            <div v-for="item in existBusiness" :key="item.businessId">
              <el-option
                v-if="item.businessId !== 6 && item.businessId !== 7"
                :label="item.alias || item.name"
                :value="item.businessId"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input type="number" style="width:80px;" v-model="form.showOrder" min="0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddOne = false">取 消</el-button>
        <el-button type="primary" @click="createMenu()" v-show="!isId">保 存</el-button>
        <el-button type="primary" @click="updateMenu()" v-show="isId">保 存</el-button>
      </div>
    </el-dialog>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :current-page.sync="currentPage"
    ></el-pagination>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
import FirstNav from "./base/FirstNav";
import SecondNav from "./base/SecondNav";
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
      opertionsFirst: ["添加一级栏目"],
      opertionsSecond: ["添加二级栏目"],
      headerTitle: "栏目管理"
    };
  },
  computed: {
    ...mapGetters(["userAuths", "companyid"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  mounted() {
    // this.getNavList(1);
    this.getParentList(1);
    // this.getChildList(1);
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
      }
    },
    getParentList: async function(page) {
      //获取一级栏目
      var params = {
        pageNum: page,
        pageSize: 10
      };
      var res = await http.post(api.getAllparents, params);
      if (res.data.code === 0) {
        this.tableDataFirst = res.data.data.list;
        this.total = res.data.data.total;
        
      } else {
        this.$message.error(message);
      }
    },
    getChildList: async function(page) {
      //获取二级栏目
      var params = {
        pageNum: page,
        pageSize: 10
      };
      var res = await http.post(api.childList, params);
      if (res.data.code === 0) {
        this.tableDataSecond = res.data.data.list;
        this.total = res.data.data.total;
        
      } else {
        this.$message.error(message);
      }
    },
    handleCurrentChange(val) {
      if (this.activeName == "firstNav") {
        this.getParentList(val);
      } else if (this.activeName == "secondNav") {
        this.getChildList(val);
      }
    },
    // handleClick(name, showOrder, id, businessId) {
    //   this.value = businessId;
    //   this.isId = true;
    //   this.form = {
    //     name: "",
    //     showOrder: ""
    //   };
    //   this.form.name = name;
    //   this.form.showOrder = showOrder;
    //   this.id = id;
    //   this.dialogFormAddOne = true;
    // },
    updateMenu: async function() {
      if (!this.form.name) {
        this.errorTost("请添加二级栏目名称");
        return false;
      }
      if (this.form.showOrder < 0) {
        this.errorTost("排序序号不能小于0");
        return false;
      }
      if (this.value === "") {
        this.errorTost("请选择关联一级栏目");
      }
      var params = {
        id: this.id,
        name: this.form.name,
        showOrder: this.form.showOrder,
        businessId: this.value
      };
      var res = await http.post(api.updateNav, params);
      if (res.data.code === 0) {
        this.form = {
          name: "",
          showOrder: ""
        };
        this.isId = false;
        this.dialogFormAddOne = false;
        this.currentPage = 1;
        this.getNavList(1);
      }
    },
    // headerClick() {
    //   this.value = "";
    //   this.isId = false;
    //   this.form = {
    //     name: "",
    //     showOrder: ""
    //   };
    //   this.dialogFormAddOne = true;
    // },
    headerClick() {
      this.$router.push({
        path: "addFirstNav",
        query: {
          // name: row.officeName
        }
      });
    },
    headerClickSec() {
      this.$router.push({
        path: "addSecNav",
        query: {
          // name: row.officeName
        }
      });
    },
    createMenu: async function() {
      if (!this.form.name) {
        this.errorTost("请添加二级栏目名称");
        return false;
      }
      if (!this.form.name.trim()) {
        this.errorTost("二级栏目名称不能为空");
        return false;
      }
      if (this.form.name.trim().indexOf(" ") !== -1) {
        this.errorTost("二级栏目名称不能有空格");
        return false;
      }
      if (this.form.showOrder < 0) {
        this.errorTost("排序序号不能小于0");
        return false;
      }
      if (this.value === "") {
        this.errorTost("请选择关联一级栏目");
        return false;
      }
      var params = {
        name: this.form.name,
        showOrder: this.form.showOrder,
        businessId: this.value
      };
      var res = await http.post(api.createNav, params);
      if (res.data.code === 0) {
        this.form = {
          name: "",
          showOrder: ""
        };
        this.isId = false;
        this.dialogFormAddOne = false;
        this.currentPage = 1;
        this.getNavList(1);
      }
    },
    getNavList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      };
      var res = await http.post(this.$api.navigation.list, params);
      if (res.data.code === 0) {
        // this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      }
    },
    navChange(v) {
      if (v == "firstNav") {
        this.getParentList(this.currentPage);
      } else if (v == "secondNav") {
        // this.handleClick(v.name, v.showOrder, v.id, v.businessId);
        // console.log(111)
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
