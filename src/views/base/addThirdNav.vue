<template>
  <div class="modelist">
    <header-content
      :title="headerTitle"
      :opertions="opertions"
      @header-btn-click="headerClick"
      v-if="!$route.query.id"
    ></header-content>
    <header-content
      :title="headerTitleEdit"
      :opertions="opertions"
      @header-btn-click="headerClick"
      v-if="$route.query.id"
    ></header-content>
    <div>
      <el-form :model="form">
        <el-form-item label="三级栏目名称:">
          <el-input v-model="form.name" auto-complete="off" style="width:200px;" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="关联一级栏目:">
          <el-select v-model="value" placeholder="请选择" @change="selectOne">
            <div v-for="item in existBusinessParent" :key="item.id">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="关联二级栏目:">
          <el-select v-model="value2" placeholder="请选择">
            <div v-for="item in existBusinessParent2" :key="item.id">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目排序:">
          <el-input type="number" v-model="form.showOrder" min="0" style="width:80px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="!$route.query.id" @click="createMenu()">保存</el-button>
        <el-button type="primary" v-if="$route.query.id" @click="createMenu()">编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
import FirstNav from "./nav/FirstNav";
import SecondNav from "./nav/SecondNav";
import ThirdNav from "./nav/ThirdNav";
export default {
  name: "secondNav",
  components: {
    HeaderContent,
    FirstNav,
    SecondNav,
    ThirdNav
  },
  data() {
    return {
      hasChild: 1,
      imgSrc:"",
      imgDec:"",
      activeName: "firstNav",
      auditStatus: 1,
      value: "",
      value2: "",
      childValue: "",
      tableData: [],
      total: 1,
      currentPage: 1,
      dialogFormAddOne: false,
      form: {
        name: "",
        showOrder: "",
        hasChild: 1
      },
      existBusiness: [],
      existBusinessParent: [],
      existBusinessParent2: [],
      liArr: [],
      id: "",
      isId: false,
      opertions: ["返回"],
      headerTitle: "添加三级栏目",
      headerTitleEdit: "编辑三级栏目",
      stylePre: "",
      style: "",
      isShow: true,
      outerUrl: "",
      openMode: 0,
      styleName: "",
      styleIsShow: 0,
      isDisabled: true,
    };
  },
  computed: {
    ...mapGetters(["userAuths", "companyid"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getType(id) {
      switch (id) {
        case 1:
          return "网站首页";
        case 2:
          return "开放视频类型";
        case 3:
          return "封闭视频类型";
        case 4:
          return "文章类型";
        case 5:
          return "活动类型";
        case 6:
          return "商城类型";
        case 7:
          return "组合类型";
        case 8:
          return "外链类型";
        case 9:
          return "资料类型";
        default:
          return "";
      }
    }
  },
  mounted() {
    this.getParentList(1);
    if (this.$route.query.id) {
      this.getParentsEdit(); //回显
      this.isDisabled = true;
    }else{
      this.isDisabled = false;
    }
  },
  methods: {
    liClick(a) {
      this.stylePre = a + 1;
      this.dialogFormAddOne = true;
      this.imgSrc = this.liArr[a].imageUrl;
      this.imgDec = this.liArr[a].description;
    },
    selectOne(val) {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.value2 = '';
      this.getChildFromChild(val);
    },
    getParentsEdit: async function(page) {
      //编辑页回显
      var res = await http.get(api.getNavigationDetail + "/" + this.$route.query.id);
      if (res.data.code === 0) {
        this.form.name = res.data.data.name;
        this.form.showOrder = res.data.data.showOrder;
        this.form.hasChild = res.data.data.hasChild;
        this.value = res.data.data.relateLevelOneId;
        this.value2 = res.data.data.relateLevelTwoId;
        this.getChildFromChild(this.value);
      }
    },
    getParentList: async function(page) {
      var res = await http.get(api.getNavigationOne);
      if (res.data.code === 0) {
        this.existBusinessParent = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    getChildFromChild: async function(id) {
      var res = await http.get(api.getChildFromChild + '/' + id);
      if (res.data.code === 0) {
        this.existBusinessParent2 = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleClick(name, showOrder, id, businessId) {
      this.value = businessId;
      this.isId = true;
      this.form = {
        name: "",
        showOrder: ""
      };
      this.form.name = name;
      this.form.showOrder = showOrder;
      this.id = id;
      this.dialogFormAddOne = true;
    },
    headerClick() {
      this.$router.back();
    },
    cancel() {
      this.$router.back();
    },
    createMenu: async function() {
      if (!this.form.name) {
          this.errorTost("请添加三级栏目名称");
          return false;
        }
      if (!this.form.name.trim()) {
        this.errorTost("三级栏目名称不能为空");
        return false;
      }
      if (this.form.name.trim().indexOf(" ") !== -1) {
        this.errorTost("三级栏目名称不能有空格");
        return false;
      }
      if (this.value === "") {
        this.errorTost("请选择关联一级栏目");
        return false;
      }
      if (this.value2 === "") {
        this.errorTost("请选择关联二级栏目");
        return false;
      }
      if (this.form.showOrder === "") {
        this.errorTost("请选择栏目排序");
        return false;
      }

      var params = {
        name: this.form.name,
        showOrder: this.form.showOrder,
        navigationLevel: 3,
        relateLevelOneId: this.value,
        relateLevelTwoId: this.value2
      };

      if (!this.$route.query.id) {
        var res = await http.post(api.navigationSave, params);
        if (res.data.code === 0) {
          this.form = {
            name: "",
            showOrder: "",
            hasChild: 1
          };
          this.value = "";
          this.successTost("保存成功");
        }else{
          this.errorTost(res.data.message);
        }
      } else {
        params.id = this.$route.query.id;
        var res = await http.post(api.navigationSave, params);
        if (res.data.code === 0) {
          this.successTost("编辑成功");
          this.$router.back();
        } else {
          this.errorTost(res.data.message);
        }
      }
    },

    getNavList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      };
      var res = await http.post(this.$api.navigation.list, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      }
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
<style rel="stylesheet/scss" lang="scss" scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}
/* ::v-deep .el-form-item{
  width: 500px;
}
::v-deep .el-form-item__content {
  width: 200px;
}
::v-deep .el-form-item__content .el-input__inner {
  width: 200px;
} */
::v-deep .el-form-item__label {
  width: 140px;
  text-align: right;
}
.nav-style {
  list-style: none;
  width: 680px;
  margin-left: 143px;
  padding: 0;
}
.nav-style li {
  position: relative;
  float: left;
  width: 150px;
  height: 150px;
  margin: 0 20px 10px 0;
  background-color: #ccc;
}
.nav-style li img{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 150px;
  height: 150px;
}
.img1{
  z-index: 1;
}
.img2{
  z-index: 2;
  visibility: hidden;
}
.nav-style li:hover {
  // background: url(https://yibaifiles-1252497236.file.myqcloud.com/CBGM/icon/magnifier-bg.png) top center;
  background-size: 100% 100%;
  .img2{
    visibility:inherit;
  }
}
.nav-style li span {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  float: left;
  width: 150px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
}
.fn-clear:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.fn-clear {
  zoom: 1; /* for IE6 IE7 */
}
.clickNow {
  box-shadow: 0 1px 3px #000000;
}
.textinfo {
  font-size: 14px;
  padding: 20px 0;
  line-height: 1.5;
}
</style>
