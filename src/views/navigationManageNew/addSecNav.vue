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
        <el-form-item label="二级栏目名称:">
          <el-input v-model="form.name" auto-complete="off" style="width:200px;" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="关联一级栏目:">
          <el-select v-model="value" placeholder="请选择" @change="selectOne">
            <div v-for="item in existBusinessParent" :key="item.id">
              <el-option :label="item.name" :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="栏目排序:">
          <el-input type="number" v-model="form.showOrder" min="0" style="width:80px;"></el-input>
        </el-form-item>
        <el-form-item label="二级栏目类型:">
          <el-select v-model="childValue" placeholder="请选择" @change="selectOne" :disabled="isDisabled">
            <div v-for="item in existBusiness" :key="item.id">
              <el-option :label="item.id | getType " :value="item.id"></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="选择风格:" v-if="childValue != 8 && styleIsShow">
          <ul class="nav-style fn-clear">
            <li
              v-for="(item,index) in liArr"
              :key="index"
              :class="index == style -1 ? {clickNow:isShow}:' '"
              @click="liClick(index)"
            >
              <img class="img1" :src="liArr[index].imageUrl">
              <img class="img2" src="https://yibaifiles-1252497236.file.myqcloud.com/CBGM/icon/magnifier-bg.png">
              <span>{{ styleName | getType }}样式{{ index+1 }}</span>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="外链地址:" v-if="childValue == 8">
          <el-input v-model="outerUrl" auto-complete="off" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item label="打开方式：" v-if="childValue == 8">
          <el-radio-group v-model="openMode">
            <el-radio :label="0">打开新窗口</el-radio>
            <el-radio :label="1">刷新现有窗口</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="!$route.query.id" @click="createMenu()">保存</el-button>
        <el-button type="primary" v-if="$route.query.id" @click="createMenu()">编辑</el-button>
      </div>
    </div>
    <el-dialog
      :lock-scroll="false"
      :show-close="false"
      :visible.sync="dialogFormAddOne"
      width="50%"
    >
      <div class="dialog-content">
        <img style="max-width: 100%" :src="imgSrc" alt>
        <div class="textinfo">{{ imgDec }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getStyle">选用此风格</el-button>
        <el-button @click="dialogFormAddOne = false">取消</el-button>
      </span>
    </el-dialog>
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
  name: "secondNav",
  components: {
    HeaderContent,
    FirstNav,
    SecondNav
  },
  data() {
    return {
      imgSrc:"",
      imgDec:"",
      activeName: "firstNav",
      auditStatus: 1,
      value: "",
      childValue: "",
      tableData: [],
      total: 1,
      currentPage: 1,
      dialogFormAddOne: false,
      form: {
        name: "",
        showOrder: ""
      },
      existBusiness: [],
      existBusinessParent: [],
      liArr: [],
      id: "",
      isId: false,
      opertions: ["返回"],
      headerTitle: "添加二级栏目",
      headerTitleEdit: "编辑二级栏目",
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
    this.getType();
    if (this.$route.query.id) {
      this.getParentsEdit(); //回显
      this.styleIsShow = 1;
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
    selectOne() {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.styleIsShow = 1;
      this.styleName = this.childValue;
      this.getStyle();
    },
    getExamineValue: async function() {
     
    },
    getStyle: async function() {
      this.style = this.stylePre;
      this.dialogFormAddOne = false;
      this.getStyleIn();
    },
    getStyleIn: async function() {
      var res = await http.get(api.getStyle + "/" + this.childValue);
      if (res.data.code === 0) {
        this.liArr = res.data.data;
      }
    },
    getParentsEdit: async function(page) {
      //二级栏目编辑页回显
      var res = await http.get(api.childList + "/" + this.$route.query.id);
      if (res.data.code === 0) {
        this.form.name = res.data.data.name;
        this.form.showOrder = res.data.data.showOrder;
        // this.form.havingChild = res.data.data.havingChild;
        // this.value = res.data.data.parentId;
        this.value = res.data.data.parentId == -1 ? null : res.data.data.parentId;
        this.style = res.data.data.style;
        this.outerUrl = res.data.data.url;
        this.openMode = res.data.data.openMode;
        this.childValue = res.data.data.type;
        this.styleName = this.childValue;
        this.getStyleIn();
      }
    },
    getParentList: async function(page) {
      //获取一级栏目
      var res = await http.get(api.relateList);
      if (res.data.code === 0) {
        this.tableDataFirst = res.data.data;
        // this.total = res.data.data.total;
        this.existBusinessParent = res.data.data;
      } else {
        this.$message.error(message);
      }
    },
    getType: async function() {
      var res = await http.get(api.getType);
      if (res.data.code === 0) {
        this.existBusiness = res.data.data.filter(
          item => item.id !== 1 && item.id !== 6
        );
      } else {
        this.$message.error(message);
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
      if (this.childValue != 8) {
        // 添加二级栏目为否且栏目类型非外链
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
        if (this.value === "") {
          this.errorTost("请选择关联一级栏目");
          return false;
        }
        if (this.form.showOrder === "") {
          this.errorTost("请选择栏目排序");
          return false;
        }
        if (this.style === "") {
          this.errorTost("请选择风格");
          return false;
        }
      } else if (this.childValue == 8) {
        // 添加二级栏目为否且栏目类型是外链
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
        if (this.value === "") {
          this.errorTost("请选择关联一级栏目");
          return false;
        }
        if (this.form.showOrder === "") {
          this.errorTost("请选择栏目排序");
          return false;
        }
        if (!this.outerUrl.trim()) {
          this.errorTost("链接地址不能为空");
          return false;
        }
      }

      var params = {
        name: this.form.name,
        showOrder: this.form.showOrder,
        parentId: this.value
        // havingChild: this.form.havingChild
      };
      if (this.childValue != 8) {
        params.type = this.childValue;
        params.style = this.style;
      } else if (this.childValue == 8) {
        params.type = this.childValue;
        params.url = this.outerUrl;
        params.openMode = this.openMode;
      }
      // var res = await http.post(api.navigationAdd, params);

      if (!this.$route.query.id) {
        var res = await http.post(api.navigationAdd, params);
        if (res.data.code === 0) {
          this.form = {
            name: "",
            showOrder: ""
          };
          this.value = "";
          this.childValue = "";
          this.style = "";
          this.isId = false;
          this.outerUrl = "";
          this.dialogFormAddOne = false;
          this.currentPage = 1;
          // this.getNavList(1);
          this.successTost("保存成功");
        }else{
          this.errorTost(res.data.message);
        }
      } else {
        params.id = this.$route.query.id;
        // var res = await http.post(api.NavigationUpdate, params);
        var res = await http.post(api.updateNavigation, params);
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
    // lc(v) {
    //   if (v == 2) {
    //     this.getNavList(1);
    //   } else {
    //     this.handleClick(v.name, v.showOrder, v.id, v.businessId);
    //   }
    // },
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
