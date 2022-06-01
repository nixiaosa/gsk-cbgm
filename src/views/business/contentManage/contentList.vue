<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <list-search @change="getSearchInfo"/>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="标题" width="360">
        <template slot-scope="scope">
          <span>{{ scope.row.contentTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="160">
        <template slot-scope="scope">
          <img v-if="scope.row.contentBgUrl" :src="scope.row.contentBgUrl" class="background" alt>
          <span v-if="!scope.row.contentBgUrl"></span>
        </template>
      </el-table-column>
      <el-table-column label="内容类型" width="140">
        <template slot-scope="scope">{{scope.row.contentType | getContentType }}</template>
      </el-table-column>
      <el-table-column label="所属一级栏目" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.firstColumnName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属二级栏目" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.secondColumnName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.columnType | getType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端显示时间" width="140" class="wraper">
        <template slot-scope="scope">
          <span
            class="time"
            v-if="scope.row.showTimeStart"
          >{{scope.row.showTimeStart | formatDate }}</span>
          <span class="time" v-if="!scope.row.showTimeStart"></span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" width="50">
        <template slot-scope="scope">
          <span class="time">{{scope.row.istop }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="添加时间" width="140" class="wraper">
        <template slot-scope="scope">
          <span class="time" v-if="scope.row.createdTime">{{scope.row.createdTime | formatDate }}</span>
          <span class="time" v-if="!scope.row.createdTime"></span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="启用/停用">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.available===1">启用中</el-tag>
          <el-tag type="danger" v-if="scope.row.available===0">停用中</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="360">
        <template slot-scope="scope">
          <div>
            <el-button
              type="info"
              @click="handleEdit(scope.row)"
              size="small"
              v-if="userAuths.article_edit"
            >编辑</el-button>

            <el-button
              type="info"
              @click="setTop(scope.row.id)"
              size="small"
              v-if="!scope.row.istop"
            >置顶</el-button>

            <el-button
              type="danger"
              @click="cancelTop(scope.row.id)"
              size="small"
              v-if="scope.row.istop"
            >取消置顶</el-button>

            <!-- <el-button
              type="danger"
              v-if="scope.row.available"
              @click="forbidden(scope.row.id,0)"
              size="small"
            >停用</el-button>
            <el-button
              type="success"
              v-if="!scope.row.available"
              @click="forbidden(scope.row.id,1)"
              size="small"
            >启用</el-button> -->

            <el-button
              type="danger"
              v-if="scope.row.available"
              @click="cancelRelation(scope.row.id)"
              size="small"
            >取消栏目关联</el-button>
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
      <el-dialog title="编辑内容" :visible.sync="userAccountInfo">
        <el-form label-width="100px" :model="editForm" ref="form3">
          <el-form-item label="标题：" prop="name" style="width:550px;">
            <el-input v-model="editForm.contentTitle" v-if="editForm.contentType == 15"></el-input>
            <span v-if="editForm.contentType != 15">{{ editForm.contentTitle }}</span>
          </el-form-item>
          <el-form-item label="内容类型：" style="width:550px;">
            {{ editForm.contentType | getContentType }}
          </el-form-item>
          <el-form-item label="封面：" width="100" v-if="editForm.contentBgUrl">
            <el-upload
              v-if="editForm.contentType == 15"
              class="avatar-uploader"
              :action="upimgurl"
              :headers="token"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="editForm.contentBgUrl && editForm.contentType == 15" :src="editForm.contentBgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
            </el-upload>
            <img v-if="editForm.contentBgUrl && editForm.contentType != 15" :src="editForm.contentBgUrl" class="avatar">
          </el-form-item>
          <el-form-item label="前端显示时间:" v-if="editForm.contentType != 17 && editForm.contentType != 21">
             <el-date-picker
              v-model="editForm.showTimeStart"
              type="datetime"
              placeholder="选择开始日期时间"
              default-time="12:00:00"
              style="margin-right:10px"
              :disabled="editForm.contentType != 15"
              >
            </el-date-picker>
             <el-date-picker
                v-model="editForm.showTimeEnd"
                type="datetime"
                placeholder="选择结束日期时间"
                default-time="12:00:00"
                :disabled="editForm.contentType != 15"
                >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="前端显示时间:" v-if="editForm.contentType == 17 || editForm.contentType == 21">
            <el-date-picker
              type="date"
              placeholder="选择开始时间"
              format="yyyy-MM-dd"
              @change="times"
              v-model="editForm.showTimeStart"
              :picker-options="pickerDisabled"
              style="margin-right:10px"
              disabled
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="归属栏目:">
            <el-select
              v-model="editForm.firstColumnId"
              placeholder="请选择一级栏目"
              class="searchStyle"
              style="width:200px;height:100%;"
              @change="selectOne"
            >
              <el-option
                v-for="(item,index) in firstNav"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="editForm.secondColumnId"
              placeholder="请选择二级栏目"
              class="searchStyle"
              clearable
              style="width:200px;height:100%;margin-left:10px"
              @change="selectOne2"
            >
              <el-option
                v-for="item in secondNav"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="userAccountInfo = false">取 消</el-button>
          <el-button type="primary" @click="update()">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import ListSearch from "./components/ListSearch";
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
    ...mapGetters(["userAuths", "companyid"])
  },
  data() {
    return {
      newId: "",
      password: "",
      passwordShow: false,
      isPassword: null,
      searchInfo: {},
      headerTitle: "内容管理",
      searchVal: "",
      tableData: [],
      multipleSelection: [],
      array: [],
      total: 0,
      newpage: 1,
      artId: "",
      dialogVisible: false,
      userAccountInfo: false,
      upimgurl: api.uploadImg,
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      secondNavArr: [],
      contentTypes: [],
      options: [],
      addoptions: {},
      secItemType: "",
      form: {
        order: 0,
        imageUrl: ""
      },
      editForm: {
        id: "",
        contentTitle: null,
        contentType: null,
        contentBgUrl: "",
        showTimeStart: "",
        showTimeEnd: "",
        firstColumnId: null,
        secondColumnId: null,
        firstColumnName: "",
        secondColumnName: "",
        imageUrl: "",
        createdTime: "",
        showTimeStart: ""
      },
      isCms: true,
      id: "",
      token: {
        Authorization: localStorage.getItem("yibai_token_s"),
        "Remote-Host": window.localStorage.getItem("locationHost")
      },
      pickerDisabled: {
        disabledDate: time => {
          return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
        }
      }
    };
  },
  filters: {
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
    },
    getContentType(id) {
      switch (id) {
        case 1:
          return "百福袋";
        case 2:
          return "调查问卷";
        case 3:
          return "抽奖活动";
        case 4:
          return "在线答题";
        case 5:
          return "线上竞赛";
        // case 6:
        //   return "病例征集";
        case 7:
          return "投票活动";
        case 8:
          return "店员培训";
        case 9:
          return "空中课堂";
        case 10:
          return "互动公开课";
        case 11:
          return "线上公开课";
        case 12:
          return "学术会议";
        case 13:
          return "积分商城";
        case 14:
          return "(旧)投票活动";
        case 15:
          return "病例征集";
        case 16:
          return "互动课堂";
        case 17:
          return "CMS文章";
        case 18:
          return "病例投票";
        case 19:
          return "抽奖活动";
        case 20:
          return "(新)投票管理";
        case 21:
          return "资料下载";
        default:
          return "";
      }
    },
    formatDate(time) {
      // time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  async mounted() {
    await this.getNewsList(this.newpage);
  },
  methods: {
    cancelRelation: async function(id) {
      var res = await http.get(api.cancelRelation + "/" + id);
      if (res.data.code === 0) {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
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

      this.judgeItemType(this.editForm.contentType)
      // console.log(this.editForm.contentType)
      this.secondNav = [];
      this.editForm.secondColumnId = "";
      this.secondNav2.filter(item => {
        if (item.parentId == this.editForm.firstColumnId && item.type == this.secItemType) {
          this.secondNav.push(item);
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
    judgeItemType(num){
      if(num == 8){
          this.secItemType = 3;
        }else if(num == 9){
          this.secItemType = 3;
        }else if(num == 11){
          this.secItemType = 2;
        }else if(num == 12){
          this.secItemType = 2;
        }else if(num == 16){
          this.secItemType = 2;
        }else if(num == 2){
          this.secItemType = 5;
        }else if(num == 4){
          this.secItemType = 5;
        }else if(num == 7){
          this.secItemType = 5;
        }else if(num == 15){
          this.secItemType = 5;
        }else if(num == 18){
          this.secItemType = 5;
        }else if(num == 19){
          this.secItemType = 5;
        }

        // else if(num == 2 || 4 || 7 || 15 || 18){
        //   console.log(2471518)
        //   this.firstNavArr.filter(item =>{
        //     if (item.type == 5 || item.type == null || item.type == 1) {
        //       this.firstNav.push(item);
        //     }
        //   })
        // }

        else if(num == 17){
          this.secItemType = 4;
        }else if(num == 21){
          this.secItemType = 9;
        }
    },
    judgeCms() {
      if (this.editForm.contentType == 17) {
        this.isCms = false;
      } else {
        this.isCms = true;
      }
    },
    forbidden: async function(id, available) {
      var params = {
        id: id,
        available: available
      };
      var res = await http.post(api.available, params);
      if (res.data.code === 0) {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    setTop: async function(id) {
      var params = {
        id: id
      };
      var res = await http.post(api.setTopContent, params);
      if (res.data.code === 0) {
        this.$message.success("置顶成功");
        this.getNewsList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    cancelTop: async function(id) {
      var params = {
        id: id
      };
      var res = await http.post(api.cancelTopContent, params);
      if (res.data.code === 0) {
        this.$message.success("取消置顶成功");
        this.getNewsList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    update: async function(page) {
      if (this.editForm.contentTitle == "") {
        this.$message.error("标题不能为空");
        return false;
      }
      if (!this.editForm.secondColumnId && this.firstNav.type === null) {
        // console.log(this.firstNav.type)
        this.$message.error("请选择正确的栏目类型");
        return false;
      }

      if (!this.editForm.showTimeStart) {
        this.$message.error("开始时间不能为空");
        return false;
      }

      if (!this.editForm.showTimeEnd && this.editForm.contentType != 17 && this.editForm.contentType != 21) {
        this.$message.error("结束时间不能为空");
        return false;
      }
      if (
        this.editForm.showTimeStart > this.editForm.showTimeEnd &&
        this.editForm.contentType != 17 &&
        this.editForm.contentType != 21
      ) {
        this.$message.error("开始时间不能大于结束时间");
        return false;
      }
      var params = {
        id: this.editForm.id,
        contentTitle: this.editForm.contentTitle,
        contentBgUrl: this.editForm.contentBgUrl,
        contentType: this.editForm.contentType,
        firstColumnId: this.editForm.firstColumnId,
        // secondColumnId: this.editForm.secondColumnId,
        secondColumnId:
          this.editForm.secondColumnId == ""
            ? 0
            : this.editForm.secondColumnId,
        showTimeStart: this.editForm.showTimeStart,
        showTimeEnd: this.editForm.showTimeEnd,
        firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        columnType: this.secondNav.type ? this.secondNav.type : this.firstNav.type,
      };
      var res = await http.post(api.editContent, params);
      if (res.data.code === 0) {
        this.userAccountInfo = false;
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    getParentList: async function(page) {
      //获取一级栏目
      var params = {
        // pageNum: page,
        // pageSize: 10
        pageSize: 1000
      };

      if(this.editForm.contentType == 8){
        params.typeList = [3]
      }else if(this.editForm.contentType == 9){
        params.typeList = [3]
      }else if(this.editForm.contentType == 11){
        params.typeList = [2,1]
      }else if(this.editForm.contentType == 12){
        params.typeList = [2,1]
      }else if(this.editForm.contentType == 16){
        params.typeList = [2,1]
      }else if(this.editForm.contentType == 2 || this.editForm.contentType ==4 || this.editForm.contentType ==7 || this.editForm.contentType==15 || this.editForm.contentType==18 || this.editForm.contentType==19){
        params.typeList = [5,1]
      }else if(this.editForm.contentType == 17){
        params.typeList = [4,1]
      }else if(this.editForm.contentType == 21){
        params.typeList = [9]
      }


      var res = await http.post(api.parentsList, params);
      if (res.data.code === 0) {
        this.firstNavArr = [];
        this.firstNav = [];
        // this.firstNavArr = res.data.data.list.filter(items => items.isdelete == 0)
        this.firstNav = res.data.data.list
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
        // this.tableDataSecond = res.data.data.list;
        // this.total = res.data.data.total;
        // this.secondNav = res.data.data.list;
        this.secondNav2 = res.data.data.list;
        // console.log('lc',this.secondNav2)
        //过滤二级菜单
        this.judgeItemType(this.editForm.contentType);
        this.secondNav = [];
        this.secondNav2.filter(item => {
          if (item.parentId == this.editForm.firstColumnId && item.type == this.secItemType) {
            this.secondNav.push(item)
          }

        });


      } else {
        this.$message.error(res.data.message);
      }
    },
    getContentTypes: async function(page) {
      //获取内容类型
      var res = await http.get(api.getContentTypes);
      if (res.data.code === 0) {
        // this.tableDataSecond = res.data.data.list;
        // this.total = res.data.data.total;
        this.contentTypes = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },

    handleEdit(row) {
      // if (row.contentType == 17) {
      //   this.isCms = false;
      // } else {
      //   this.isCms = true;
      // }
      this.userAccountInfo = true;
      this.editForm.id = row.id;
      this.editForm.contentTitle = row.contentTitle;
      this.editForm.contentType = row.contentType;
      // alert(this.editForm.contentType)
      // this.editForm.imageUrl = row.imageUrl;
      // this.editForm.contentBgUrl = row.imageUrl;
      this.editForm.contentBgUrl = row.contentBgUrl;
      this.editForm.showTimeStart = row.showTimeStart;
      this.editForm.showTimeEnd = row.showTimeEnd;
      this.editForm.firstColumnId = row.firstColumnId == 0 ? null : row.firstColumnId;
      // this.editForm.secondColumnId = row.secondColumnId;
      this.editForm.secondColumnId = row.secondColumnId == 0 ? null : row.secondColumnId;
      this.firstNavName = row.firstColumnName;
      this.secondNavName = row.secondColumnName;
      // this.firstNav.type = row.type;
      // console.log(this.firstNav)

      // this.firstNavName = "";
      // this.secondNavName = "";
      // this.firstNav.map(item=>{
      //   if( item.id == this.editForm.firstColumnId ){
      //     this.firstNavName = item.name;
      //   }
      // });
      // this.secondNav.map(item=>{
      //   if( item.id == this.editForm.secondColumnId ){
      //     this.secondNavName = item.name;
      //   }
      // });

      console.log(this.firstNavName)
      console.log(this.secondNavName)
      console.log(this.editForm.firstColumnId)
      console.log(this.editForm.secondColumnId)
      console.log(this.secondNav2)
      console.log("--------")

      this.getParentList();
      this.getChildList();
      this.getContentTypes();


    },
    times() {
      this.editForm.showTimeStart = Date.parse(this.editForm.showTimeStart);
    },
    endTimes() {
      if (this.editForm.showTimeEnd.getFullYear) {
        let Year = this.editForm.showTimeEnd.getFullYear();
        let Month = this.editForm.showTimeEnd.getMonth() + 1;
        let getDate = this.editForm.showTimeEnd.getDate();
        this.editForm.showTimeEnd = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime();
      }
    },
    handleAvatarSuccess(res) {
      // this.form.imageUrl = res.data;
       this.editForm.contentBgUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像只能是jpg、png、gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    getSearchInfo(item) {
      // 获取搜索信息
      this.searchInfo.contentTitle = item.title;
      this.searchInfo.firstColumnId = item.firstNav;
      this.searchInfo.secondColumnId = item.secondNav;
      this.searchInfo.contentType = item.contentTypes;
      this.getNewsList(this.newpage);
    },
    // headerClick() {
    //   this.$router.push({ path: "edit" });
    // },
    handleCurrentChange(val) {
      this.newpage = val;
      this.getNewsList(val);
    },
    getNewsList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          // contentTitle: "",
          // contentType: "",
          // firstColumnId: "",
          // secondColumnId: ""
          ...this.searchInfo
        }
      };
      var res = await http.post(api.contentManageList, params);
      if (res.data.code === 0) {
        this.total = res.data.data.total;
        this.tableData = res.data.data.list;
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
      });
    },
  }
};
</script>
<style scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 120px;
}
.avatar {
  width: 300px !important;
}
</style>
