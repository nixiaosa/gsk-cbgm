<template>
  <div class="modelist">
    <header-content
      :title="headerTitle"
      :opertions="opertions"
      @header-btn-click="headerClick"
      v-if="userAuths.article_add"
    ></header-content>
    <list-search @change="getSearchInfo"/>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" v-if="scope.row.imageUrl" class="background" alt>
        </template>
      </el-table-column>
      <el-table-column label="一级栏目">
        <template slot-scope="scope">{{scope.row.firstColumnName}}</template>
      </el-table-column>
      <el-table-column label="二级栏目">
        <template slot-scope="scope">
          <span>{{scope.row.secondColumnName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="推荐">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.recommend===1">已推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" label="启用/停用">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isdelete===0">启用中</el-tag>
          <el-tag type="danger" v-if="scope.row.isdelete===1">停用中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="显示时间" width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{scope.row.showTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="380">
        <template slot-scope="scope">
          <div>
            <el-button
              type="info"
              @click="handleClick(scope.row.id)"
              size="small"
              v-if="userAuths.article_edit"
            >详情&编辑</el-button>
            <el-button
              type="info"
              v-if="scope.row.recommend===0 && userAuths.article_list_action"
              @click="recommend(scope.row.id,scope.row.recommend)"
              size="small"
            >设置推荐</el-button>
            <el-button
              type="danger"
              v-if="scope.row.recommend===1 && userAuths.article_list_action"
              @click="recommend(scope.row.id,scope.row.recommend)"
              size="small"
            >取消推荐</el-button>
            <el-button
              :type="scope.row.top === 0 ? 'info' : 'danger'"
              @click="newsTop(scope.row.id, scope.row.top)"
              size="small"
              v-if="userAuths.article_list_action"
            >{{scope.row.top | isTop}}</el-button>
            <el-button
              type="info"
              v-if="scope.row.isdelete===1 && userAuths.article_list_action"
              @click="stopArticle(scope.row.id,scope.row.isdelete)"
              size="small"
            >启用</el-button>
            <el-button
              type="danger"
              v-if="scope.row.isdelete===0 && userAuths.article_list_action"
              @click="stopArticle(scope.row.id,scope.row.isdelete)"
              size="small"
            >停用</el-button>
            <!-- <el-button type="danger" @click="artId=scope.row.id,dialogVisible=true" size="small">删除</el-button> -->
          </div>
          <div style="margin-top: 6px">
            <el-button type="info" @click="checkManage(scope.row.id)" size="small">浏览设置</el-button>
            <el-button type="info" @click="goInteraction(scope.row.id)" size="small">评论管理</el-button>
            <el-button @click="setContentColumns(scope.row)" type="info" size="small">栏目设置</el-button>
            <el-button v-if="cmsStatistic === 1" @click="browsingHistory(scope.row.id)" type="info" size="small">浏览记录</el-button>
          </div>
          <div style="margin-top: 6px">
            <el-button @click="goGoodsSets(scope.row)" type="info" size="small">商品设置</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      :current-page="newpage"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="10"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteNews()">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <!--设置密码-->
      <el-dialog
        :lock-scroll="false"
        title="浏览设置"
        :visible.sync="passwordShow"
        width="30%"
        :before-close="handleClose"
      >
        <div>
          <el-form class="demo-form-inline">
            <el-form-item label="浏览权限设置：">
              <el-radio-group v-model="isPassword">
                <el-radio :label="1">设置密码</el-radio>
                <el-radio :label="0">不设置密码</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="isPassword" label="浏览密码：">
              <el-input style="width: 200px" v-model="password" placeholder="******"></el-input>
            </el-form-item>
            <span v-if="isPassword" style="color: #999999">密码不允许包含数字、英文以外的字符且长度为6-10位</span>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="paswwordSave">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="栏目设置" :visible.sync="setContentColumn">
      <el-form label-width="100px" :model="editForm" ref="form3">
        <el-form-item label="选择一级栏目:">
          <el-select
            v-model="editForm.firstColumnId"
            placeholder="请选择一级栏目"
            class="searchStyle"
            style="width:200px;height:100%;"
            @change="selectOne"
          >
            <el-option v-for="item in firstNav" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择二级栏目:">
          <el-select
            v-model="editForm.secondColumnId"
            placeholder="请选择二级栏目"
            class="searchStyle"
            style="width:200px;height:100%;"
            @change="selectOne2"
          >
            <el-option v-for="item in secondNav" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setContentColumn = false">取 消</el-button>
        <el-button type="primary" v-if="!editForm.firstColumnId2" @click="columnSave(setList)">保存</el-button>
        <el-button type="primary" v-if="editForm.firstColumnId2" @click="columnEdit(setList)">修改</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import ListSearch from "../components/ListSearchV2";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
import { egandnum } from "@/utils/validate";
import md5 from "js-md5";
import HeaderContent from "@/components/header-content";

export default {
  name: "modelist",
  components: {
    HeaderContent,
    ListSearch
  },
  computed: {
    ...mapGetters(["userAuths", "companyid", "cmsStatistic"])
  },
  data() {
    return {
      newId: "",
      password: "",
      passwordShow: false,
      isPassword: null,
      searchInfo: {},
      headerTitle: "文章管理",
      opertions: ["新建文章"],
      searchVal: "",
      tableData: [],
      tableData2: [],
      multipleSelection: [],
      array: [],
      total: 0,
      newpage: 1,
      artId: "",
      dialogVisible: false,
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 17,
      setContentColumn: false,
      contentIdArr: [],
      editForm: {
        id: "",
        contentTitle: null,
        contentType: null,
        contentBgUrl: "",
        showTimeStart: "",
        showTimeEnd: "",
        firstColumnId: null,
        secondColumnId: "",
        firstColumnName: "",
        secondColumnName: "",
        imageUrl: "",
        createdTime: "",
        showTimeStart: ""
      },
      setList: {
        // contentId: "",
        // contentTitle: null,
        // contentBgUrl: "",
        // contentType: null,
        // // firstColumnId: null,
        // // secondColumnId: null,
        // // columnType: null,
        // showTimeStart: "",
        // showTimeEnd: "",
        // busId: ""
      },
      form: {
        order: 0
      },
      id: ""
    };
  },
  filters: {
    isTop(top) {
      if (top === 1) {
        return "取消置顶";
      } else {
        return "置顶";
      }
    },
    formatDate(time) {
      time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    sureType(v, h) {
      if (h) {
        return "回放";
      }
      if (v === 1) {
        return "直播";
      }
      if (v === 2) {
        return "视频";
      }
    },
    longToShort(str) {
      if (str.length > 20) {
        return str.substring(0, 20) + "...";
      } else {
        return str;
      }
    }
  },
  async mounted() {
    await this.getNewsList(this.newpage);

    this.getParentList(this.newpage);
    this.getChildList(this.newpage);
  },
  methods: {
    selectOne(val) {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.firstNavName = "";
      this.secondNavName = "";
      this.firstNav.map(item=>{
        if( item.id == val ){
          this.firstNavName = item.name;
          // console.log(this.firstNavName);
        }
      });

      this.secondNav = [];
      this.editForm.secondColumnId = "";
      this.secondNav2.filter(item => {
        if (item.parentId == this.editForm.firstColumnId && item.type == 4) {
          this.secondNav.push(item)
        }
      });

      this.firstNav.filter(item =>{
        if (item.id == this.editForm.firstColumnId) {
          this.firstNav.type = item.type;
          // console.log(this.firstNav.type);
        }
      });
    },
    selectOne2(val) {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.secondNavName = "";
      this.secondNav.map(item=>{
        if( item.id == val ){
          this.secondNavName = item.name;
        }
      });

      this.secondNav.filter(item =>{
        if (item.id == this.editForm.secondColumnId) {
          this.secondNav.type = item.type;
          // console.log(this.firstNav.type);
        }
      });
    },
    columnSave: async function() {
      var params = {
        firstColumnId: this.editForm.firstColumnId,
        secondColumnId:
          this.editForm.secondColumnId == "" ? 0 : this.editForm.secondColumnId,
        columnType: this.secondNav.type ? this.secondNav.type : this.firstNav.type,
        firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        ...this.setList
      };

      if (this.editForm.firstColumnId == "") {
        this.$message.error("一级栏目不能为空");
        return false;
      }
      if (!this.editForm.secondColumnId && this.firstNav.type === null ) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.getNewsList(this.newpage);
        this.setContentColumn = false;
        this.$message.success("保存成功");
      } else {
        this.$message.error(res.data.message);
        this.setContentColumn = false;
      }
    },
    columnEdit: async function() {
      var params = {
        contentId: this.setList.contentId,
        contentType: this.contentType,
        firstColumnId: this.editForm.firstColumnId,
        // secondColumnId: this.editForm.secondColumnId
        secondColumnId:
          this.editForm.secondColumnId == "" ? 0 : this.editForm.secondColumnId,
          firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        ...this.setList
      };
      if (!this.editForm.secondColumnId && this.firstNav.type === null ) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.editReShowContent, params);
      if (res.data.code === 0) {
        this.getNewsList(this.newpage);
        this.setContentColumn = false;
        this.$message.success("编辑成功");
      } else {
        this.$message.error(res.data.message);
        this.setContentColumn = false;
      }
    },
    getContentType(item) {
      switch (item) {
        case 1: //原店员培训
          return 8;
        case 2: //原空中课堂
          return 9;
        case 3: //原互动公开课
          return 10;
        case 4: //原线上公开课
          return 11;
        case 5: //原学术会议
          return 12;
        case 8: //原病例征集
          return 15;
        case 9: //原互动课堂
          return 16;
        default:
          return "";
      }
    },
    // getParentList: async function(page) {
    //   //获取一级栏目
    //   var params = {
    //     // pageNum: page,
    //     pageSize: 1000
    //   };
    //   var res = await http.post(api.parentsList, params);
    //   if (res.data.code === 0) {
    //     this.firstNav = res.data.data.list;
    //   } else {
    //     this.$message.error(res.data.message);
    //   }
    // },
    getParentList: async function(page) {
      //获取一级栏目
      var params = {
        // pageNum: page,
        pageSize: 1000,
        typeList: [4,1],
      };
      var res = await http.post(api.parentsList, params);
      if (res.data.code === 0) {
        // this.firstNavArr = res.data.data.list.filter(items => items.isdelete == 0)
        this.firstNav = res.data.data.list
        // console.log(this.firstNavArr)
        // this.firstNav = res.data.data.list;
        // if(this.contentType == 7){
          // this.firstNavArr.filter(item =>{
          //   if (item.type == 4 || item.type == null || item.type == 1) {
          //     this.firstNav.push(item);
          //   }
          // })
        // }
      } else {
        this.$message.error(res.data.message);
      }
    },
    getChildList: async function(page) {
      //获取二级栏目
      var params = {
        // pageNum: page,
        // pageSize: 10
        pageSize: 1000
      };
      var res = await http.post(api.childList, params);
      if (res.data.code === 0) {
        // this.secondNav = res.data.data.list;
        this.secondNav2 = res.data.data.list;
      } else {
        this.$message.error(res.data.message);
      }
    },
    setContentColumns: async function(obj) {
      if (!this.setContentColumn) {
        this.setContentColumn = true;
      } else {
        this.setContentColumn = false;
      }
      this.setList.contentId = obj.id;
      this.setList.contentTitle = obj.title;
      this.setList.contentBgUrl = obj.imageUrl;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.showTime;
      // this.setList.showTimeEnd = obj.endTime;
      this.setList.busId = obj.busId;
      // this.setList.status = obj.busId;
      this.setList.articleAbstract = obj.keyword;
      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(api.editReShow + "/" + this.contentType + "/" + obj.id);
      if (res.data.code === 0 && res.data.data != null) {
        // this.editForm.firstColumnId = res.data.data.firstColumnId;
        this.editForm.firstColumnId = res.data.data.firstColumnId == 0 ? null : res.data.data.firstColumnId;
        this.editForm.secondColumnId =
          res.data.data.secondColumnId == 0
            ? null
            : res.data.data.secondColumnId;
        this.editForm.firstColumnId2 = this.editForm.firstColumnId;
      }

      this.firstNavName = "";
      this.secondNavName = "";
      this.firstNav.map(item=>{
        if( item.id == this.editForm.firstColumnId ){
          this.firstNavName = item.name;
        }
      });
      this.secondNav.map(item=>{
        if( item.id == this.editForm.secondColumnId ){
          this.secondNavName = item.name;
        }
      });
      //过滤二级菜单
        this.secondNav = [];
        this.secondNav2.filter(item => {  
        if (item.parentId == this.editForm.firstColumnId && item.type == 4) {
          this.secondNav.push(item)
        }
        });
    },
    browsingHistory (id) {
      this.$router.push({
        path: "oneSoltCms",
        query: {
          columnId: id
        }
      });
    },
    getAllId: async function(obj) {
      let arrId = [];
      for (let item of obj) {
        arrId.push(item.id);
      }
      const res = await http.post(api.getContentColumnsByIds + "/" + this.contentType, arrId);
      if (res.data.code === 0) {
        // console.log(arrId);
        this.contentIdArr = res.data.data;
        // console.log(this.contentIdArr);
        this.doFilter(this.contentIdArr, this.tableData2);
        this.tableData = this.tableData2;
      } else {
        this.$message.error(res.data.message);
      }
    },
    doFilter(products, conditions) {
      // products = JSON.parse(JSON.stringify(products));
      for (const index in products) {
        for (const key in conditions) {
          if (conditions[key].id == products[index].contentId) {
            conditions[key].firstColumnName = products[index].firstColumnName;
            conditions[key].secondColumnName = products[index].secondColumnName;

            conditions[key].firstColumnId = products[index].firstColumnId;
            conditions[key].secondColumnId = products[index].secondColumnId;
            // this.tableData = this.tableData2;
            // console.log("匹配");
          } else {
            // console.log("无匹配");
          }
        }
      }
    },
    cancle() {
      this.passwordShow = false;
      this.password = "";
    },
    checkManage(id) {
      // 回显浏览设置
      this.newId = id;
      this.passwordShow = true;
      let params = {
        id: id
      };
      this.$http.post(this.$api.cmsPasswordGet, params).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          this.isPassword = data.viewSet;
        } else {
          this.$message.error(message);
        }
      });
    },
    paswwordSave() {
      // 设置浏览密码
      if (this.isPassword) {
        if (this.password === "") {
          this.$message.error("请输入密码");
          return false;
        }
        if (this.password.length < 6 || this.password.length > 10) {
          this.$message.error("请设置6-10位密码");
          return false;
        }
        if (!egandnum(this.password)) {
          this.$message.error("密码不允许包含数字、英文以外的字符");
          return false;
        }
      } else {
        this.password = null;
      }

      let params = {
        id: this.newId,
        viewSet: this.isPassword,
        password: this.password ? md5(this.password) : null
      };
      this.$http.post(this.$api.cmsPasswordSave, params).then(res => {
        console.log(res);
        let { code } = res.data;
        if (code === 0) {
          this.passwordShow = false;
          this.password = "";
          this.$message.success("浏览密码设置成功");
        } else {
          this.$message.error(code);
        }
      });
    },
    handleClose() {
      this.passwordShow = false;
    },
    getSearchInfo(item) {
      // 获取搜索信息
      this.searchInfo.title = item.title;
      this.searchInfo.columnId = item.columnId[1] ? item.columnId[1] : "";
      this.getNewsList(this.newpage);
    },
    rank(id, sort) {
      this.id = id;
      this.form.order = sort;
    },
    headerClick() {
      this.$router.push({ path: "edit" });
    },
    stopArticle: async function(id, state) {
      var params = {
        id: id,
        isdelete: state === 0 ? 1 : 0
      };
      var res = await http.post(api.newsStop, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      }
    },
    recommend: async function(id, state) {
      var params = {
        id: id,
        recommend: state === 0 ? 1 : 0
      };
      var res = await http.post(api.newsStop, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      }
    },
    handleCurrentChange(val) {
      this.newpage = val;
      this.getNewsList(val);
    },
    getNewsList: async function(page) {
      var params = {
        companyId: this.companyid,
        pageNum: page,
        pageSize: 10,
        ...this.searchInfo
      };
      var res = await http.post(api.getNewsList, params);
      if (res.data.code === 0) {
        this.total = res.data.data.total;
        this.tableData2 = res.data.data.list;

        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.message);
      }
    },
    newsTop: async function(id, top) {
      var params = {
        id: id,
        top: top === 0 ? 1 : 0
      };
      var res = await http.post(api.newsTop, params);
      if (res.data.code === 0) {
        let topMessage = top === 0 ? "置顶成功" : "取消置顶成功";
        this.success(topMessage);
        this.getNewsList(1);
        this.newpage = 1;
      }else{
        this.$message.error(res.data.message);
      }
    },
    deleteNews: async function(id) {
      var params = {
        id: this.artId
      };
      var res = await http.post(api.deleteNews, params);
      if (res.data.code === 0) {
        this.dialogVisible = false;
        this.artId = "";
        this.getNewsList(1);
        this.newpage = 1;
      }
    },
    handleClick(id) {
      this.$router.push({ path: "edit" + "?id=" + id });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    success(val) {
      this.$message({
        message: val,
        type: "success"
      })
    },
    goInteraction(commentId) {
      this.$router.push({
        path: "comment",
        query: {
          businessId: 1000,
          sourceId: commentId
        }
      })
    },
    goGoodsSets(rows) {
      this.$router.push({
        path: "goodsSets",
        query: {
          imageUrl: rows.imageUrl,
          id: rows.id,
          title: rows.title
        }
      })
    }
  }
};
</script>
<style scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  /*width: 160px;*/
  height: 120px;
}
</style>
