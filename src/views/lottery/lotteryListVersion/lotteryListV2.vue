<template>
  <div class="jhg">
    <header-content :title="headerTitle"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form"></Headers>
    <el-button type="primary" class="btnsl" @click="Inquire">查询</el-button>
    <div style="margin:20px;"></div>
    <el-table :data="tableDatas" border>
      <el-table-column width="240" label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-show="isOld === 1" label="一级栏目">
        <template slot-scope="scope">{{scope.row.firstColumnName}}</template>
      </el-table-column>
      <el-table-column v-show="isOld === 1" label="二级栏目">
        <template slot-scope="scope">
          <span>{{scope.row.secondColumnName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="130" label="活动模版">
        <template slot-scope="scope">
          <span>{{ scope.row.type | activityType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="290" label="游戏周期">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | formatDate }}</span>
          -
          <span>{{ scope.row.endTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="144" label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activityState | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getStatus }}</span>
        </template>
      </el-table-column> -->
      <el-table-column  width="700" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="goDetail(scope.row.lotteryId,true)"
          >查看详情</el-button>
          <el-button
            type="info"
            size="small"
            @click="goUserList(scope.row.lotteryId)"
          >用户列表</el-button>
          <el-button
            type="info"
            size="small"
            @click="goLuckyList(scope.row.id,scope.row.lotteryId,scope.row.verifyCode)"
          >中奖名单</el-button>
          <el-button
            type="info"
            size="small"
            @click="goStatistics(scope.row.lotteryId)"
          >抽奖统计</el-button>
          <el-button v-if="isOld === 1" @click="setContentColumns(scope.row)" type="info" size="small">栏目设置</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,2)"
            v-if="scope.row.activityState == 1 || scope.row.activityState == -4 || scope.row.activityState == -2"
          >暂停</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.lotteryId,-2)"
            v-if="scope.row.activityState == 2"
          >取消暂停</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.lotteryId,-4)"
            v-if="scope.row.activityState == 4"
          >启用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,4)"
            v-if="scope.row.activityState == 1 || scope.row.activityState == -4 || scope.row.activityState == -2 || scope.row.activityState == 2"
          >停用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,3)"
            v-if="scope.row.activityState !== 0 && scope.row.activityState !== 3" 
          >结束</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:20px"></div>
    <el-dialog
      title="详情"
      :visible.sync="ends"
    >
      <ul class="detail-dia-ul">
        <li><span>活动模版：</span><em>{{ this.detailForm.type | activityType }}</em></li>
        <li><span>活动标题：</span><em>{{ this.detailForm.name }}</em></li>
        <li><span>活动时间：</span><em>{{this.detailForm.beginTime }} ~ {{ this.detailForm.endTime }}</em></li>
        <li class="activityDetail"><span>活动介绍：</span><em v-html="detailForm.activityDetail"></em></li>
        <li>
          <span>主要奖品：</span>
          <div v-for="(item,index) in prizeForm" :key="index">{{ item.name}}：{{ item.description}}</div>  
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goDetail(false)">取 消</el-button>
        <el-button type="primary" @click="goDetail(false)">确 定</el-button>
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
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import HeaderContent from "@/components/header-content";
import Headers from "../base/header1";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
export default {
  name: "lotterylist",
  components: {
    HeaderContent,
    Headers
  },
  data() {
    return {
      isOld: null, // 0为老版 1为新版
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 19,
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
      setList: {},
      tableData: [],
      tableDatas: [],
      tableData2: [],
      headerTitle: "抽奖游戏管理",
      form: {
        title: "",
        startTime: "",
        endTime: "",
        status: ""
      },
      detailForm: {
        name: "",
        beginTime: "",
        endTime: "",
        type: 1,
        activityDetail: ""
      },
      prizeForm: {

      },
      ends: false,
      total: 0,
      currentPage: 1,
      labelPosition: "left",
      itemDatas: [
        {
          label: "活动状态",
          placeholder: "请选择"
        },
        {
          label: "活动周期"
        },
        {
          label: "活动名称",
          placeholder: "请输入活动名称"
        }
      ],
      options: [
        {
          label: "全部"
        },
        {
          status: 0,
          label: "未开始"
        },
        {
          status: 1,
          label: "进行中"
        },
        {
          status: 2,
          label: "已暂停"
        },
        {
          status: 4,
          label: "已停用"
        },
        {
          status: 3,
          label: "已结束"
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userAuths"])
  },
  filters: {
    activityType(type){
      if (type === 1) {
        return "大转盘";
      } else {
        return "九宫格";
      }
    },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      if (state === 0) {
        return "未开始";
      } else if (state === 1) {
        return "进行中";
      } else if (state === 2) {
        return "已暂停";
      } else if (state === -2) {
        // return "取消暂停";
        return "进行中";
      } else if (state === 3) {
        return "已结束";
      } else if (state === 4) {
        return "已停用";
      } else if (state === -4) {
        // return "启用";
        return "进行中";
      }
    },
    getStatus(status) {
      if (status === 0) {
        return "停用";
      } else if (status === 1) {
        return "启用";
      }
    }
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = Number(this.$route.query.page);
    }
  },
  async mounted() {
    await this.getVersion();
    this.luckyGamelist(1);
    if(this.isOld === 1){
      this.getParentList(this.currentPage);
      this.getChildList(this.currentPage);
    }
  },
  methods: {
    getVersion: async function() {
      var res = await http.post(api.getVersion);
      if (res.data.code === 0) {
        this.isOld = res.data.data.webversion;
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


      this.secondNav = [];
      this.editForm.secondColumnId = "";
      this.secondNav2.filter(item => {
        if (item.parentId == this.editForm.firstColumnId && item.type == 5) {
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
        columnType: this.secondNav.type
          ? this.secondNav.type
          : this.firstNav.type,
          firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        ...this.setList
      };

      if (this.editForm.firstColumnId == "") {
        this.$message.error("一级栏目不能为空");
        return false;
      }
      if (!this.editForm.secondColumnId && this.firstNav.type === null) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.luckyGamelist(this.currentPage);
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
      if (!this.editForm.secondColumnId && this.firstNav.type === null) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.editReShowContent, params);
      if (res.data.code === 0) {
        this.luckyGamelist(this.currentPage);
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
    //     // pageSize: 10
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
        typeList: [5,1],
      };
      var res = await http.post(api.parentsList, params);
      if (res.data.code === 0) {
        // this.firstNavArr = res.data.data.list.filter(items => items.isdelete == 0)
        this.firstNav = res.data.data.list
          // this.firstNavArr.filter(item =>{
          //   if (item.type == 5 || item.type == null) {
          //     this.firstNav.push(item);
          //   }
          // })

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
      this.setList.contentId = obj.lotteryId;
      this.setList.contentTitle = obj.name;
      this.setList.contentBgUrl = obj.contentBgUrl;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.beginTime;
      this.setList.showTimeEnd = obj.endTime;
      // this.setList.busId = obj.busId;
      this.setList.status = obj.activityState;
      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(api.editReShow + "/" + this.contentType + "/" + obj.lotteryId);
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
        if (item.parentId == this.editForm.firstColumnId && item.type == 5) {
          this.secondNav.push(item)
        }
        });
    },
    getAllId: async function(obj) {
      let arrId = [];
      for (let item of obj) {
        arrId.push(item.lotteryId);
      }
      const res = await http.post(api.getContentColumnsByIds + "/" + this.contentType, arrId);
      if (res.data.code === 0) {
        // console.log(arrId);
        this.contentIdArr = res.data.data;
        // console.log(this.contentIdArr);
        this.doFilter(this.contentIdArr, this.tableData2);
        this.tableDatas = this.tableData2;
      } else {
        this.$message.error(res.data.message);
      }
    },
    doFilter(products, conditions) {
      // products = JSON.parse(JSON.stringify(products));
      for (const index in products) {
        for (const key in conditions) {
          if (conditions[key].lotteryId == products[index].contentId) {
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
    goLuckyList(id,lotteryId,verifyCode) { // 中奖名单
      this.$router.push({ path: "lottery/luckyList/"+ id + "/" + lotteryId });
    },
    goUserList(lotteryId) { // 用户列表
      this.$router.push({ path: "lottery/userlist/" + lotteryId });
    },
    goStatistics(lotteryId) { // 抽奖统计
      this.$router.push({ path: "lottery/statistics/" + lotteryId });
    },
    forbidden: async function(lotteryId, status) {
      var params = {
        lotteryId: lotteryId,
        operationType: status,
      };
      var res = await http.post(api.lotteryForbidden, params);
      if (res.data.code === 200) {
        this.luckyGamelist(this.currentPage);
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.data.msg);
      }
    },
    
    goDetail: async function (id,type) { // 详情弹窗
      this.ends = type
      if(id){
        var res = await http.get(api.getActivityDetail + id);
        if (res.data.code === 200) {
          this.detailForm = res.data.data.lottery;
          this.prizeForm = res.data.data.prizesVO.prizes;
        } else {
          this.$message.error(res.data.msg);
        }
      }
    },

    luckyGamelist: async function() {
      var params1 = {
        pageSize: 10,
        pageNum: this.currentPage,
      };
      if (
        this.form.status !== "" ||
        this.form.startTime !== "" ||
        this.form.endTime !== "" ||
        this.form.title !== ""
      ) {
        params1 = {
          pageSize: 10,
          pageNum: this.currentPage,
          activityState: this.form.status,
          beginTime: this.form.startTime,
          endTime: this.form.endTime,
          name: this.form.title
        };
      }
      if (this.form.startTime !== "" && this.form.endTime !== "") {
        if (this.form.startTime > this.form.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      var res = await http.post(api.lotteryGamelist, params1);
      // console.log(res);
      if (res.data.code === 200) {
        // this.tableData = res.data.data.list;
        this.total = res.data.data.total;
        this.tableData2 = res.data.data.list;
        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.msg);
      }
    },
    Inquire: async function() {
      this.luckyGamelist(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.luckyGamelist(val);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.btnsl {
  /* width: 130px; */
  position: absolute;
  top: 140px;
  right:20px;
}
.detail-dia-ul{
  list-style: none;
  li{
    position: relative;
    margin-bottom: 30px;
    span{
      position: absolute;
      left: 0;
      top: 3px;
      font-weight: bold;
    }
    em{
      display: inline-block;
      max-width:500px; 
      font-style: normal;
      line-height: 1.5;
      margin-left: 80px;
    }
    div{
      line-height: 1.5;
      margin: 0 0 20px 80px;
    }
  }
  .activityDetail{
    em{
      display: inline-block;
      margin-top: -14px 
    }
  }
}
</style>


