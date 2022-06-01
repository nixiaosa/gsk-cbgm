<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动状态">
        <el-select v-model="formInline.activityStatus" placeholder="请选择活动状态">
          <el-option
            v-for="(item,index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.status"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动周期">
        <el-date-picker
          type="date"
          placeholder="选择开始时间"
          format="yyyy-MM-dd"
          v-model="formInline.startTime"
          @change="startTimes"
        ></el-date-picker>
        <span style="color: #ffffff">-</span>
        <el-date-picker
          type="date"
          placeholder="选择结束时间"
          format="yyyy-MM-dd"
          v-model="formInline.endTime"
          @change="endTimes"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动标题">
        <el-input v-model="formInline.title" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="formInline.creatorName" placeholder="请输入创建人名称"></el-input>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="投票活动名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
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
      <el-table-column label="开始时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime !== null">{{ scope.row.endTime | formatDates }}</span>
          <span v-if="scope.row.endTime == null"></span>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与人数" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.participateNums}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activityStatus | getState }}</span>
        </template>
      </el-table-column>

      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.stopFlag | gethasForbidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="500">
        <template slot-scope="scope">
          <div>
          <el-button type="info" size="small" @click="godetails(scope.row.id,scope.row.voteType,scope.row.voteShowType,scope.row.scoreShowType,scope.row.voteId)">详情</el-button>
          <el-button
            v-show="scope.row.activityStatus !== 0"
            type="info"
            size="small"
            @click="goranklist(scope.row.id,scope.row.voteType,scope.row.voteId, scope.row.title,scope.row.actType)"
          >排行榜</el-button>
          <el-button type="info" size="small" @click="govoteSelect(scope.row.id,scope.row.photoStatus,scope.row.voteId)">投票选项</el-button>
          <el-button
            v-show="scope.row.stopFlag"
            type="success"
            size="small"
            @click="caseCollectSst(scope.row.voteId, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.stopFlag"
            :disabled="scope.row.activityStatus !== 2"
            type="warning"
            size="small"
            @click="caseCollectSst(scope.row.voteId, 1)"
          >暂停</el-button>
          <!-- <el-button
            v-show="scope.row.status === 1 || scope.row.status === 2"
            type="danger"
            size="small"
            @click="endcase(scope.row.id)"
          >结束活动</el-button> -->
           <el-button v-if="scope.row.activityStatus !== 0" @click="setContentColumns(scope.row)" type="info" size="small">栏目设置</el-button>
          </div>
          <div style="margin-top:10px">
             <el-button 
              type="info" 
              size="small"
              @click="goVoteSet(scope.row.id,scope.row.voteId,scope.row.actType)"
            >投票设置</el-button>
          <el-button 
            type="info" 
            size="small"
            @click="goStyleSet(scope.row.id,scope.row.voteId)"
          >外观设置</el-button>
          <el-button 
            type="info" 
            size="small"
            @click="goApplyList(scope.row)"
          >申请管理</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="确认提示" :visible.sync="ends">
      <span style="color: red;">任务被强制结束后不能再次开启，确定要结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="endsVideo">确 定</el-button>
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
    <div style="margin:20px"></div>
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
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
// import Pagination from "@/components/pagination/Pagination";
export default {
  // name: "caseCollection",
  name: "normalVoteV3",
  components: {
    HeaderContent
    // Pagination
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    gethasForbidden(v) {
      switch (v) {
        case 0:
          return "启动";
        case 1:
          return "暂停";
      }
    },
    formatDates(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      switch (state) {
        case 0:
          return "草稿";
        case 1:
          return "未开始";
        case 2:
          return "进行中";
        case 3:
          return "已结束";
        case 4:
          return "暂停中";
        // case 4:
        //   return "已过期";
        // case -1:
        //   return "未发布";
      }
    }
  },
  data() {
    return {
      headerTitle: "投票管理",
      currentPage: 1,
      total: 1,
      ends: false,
      id: "2",
      endId: "",
      voteType: "",
      voteShowType: "",
      scoreShowType: "",
      photoStatus: "", //头像 0不显示 1显示
      tableDatas: [],
      tableData2: [],
      statusList: [
        { label: "全部" },
        { label: "草稿", status: 0 },
        { label: "未开始", status: 1 },
        { label: "进行中", status: 2 },
        { label: "已结束", status: 3 }
        // { label: "已过期", status: 4 }
      ],
      formInline: {
        // type: 0,
        // status: null,
        // startTime: null,
        // endTime: null,
        // voteName: null,
        // createBy: null,

        activityStatus: null,
        creatorName: null,
        title: null,
        startTime: null,
        endTime: null,
      },
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 20,
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
    };
  },
  async mounted() {
    await this.caseCollection(this.currentPage);
    this.getParentList(this.currentPage);
    this.getChildList(this.currentPage);
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page);
      this.currentPage = page;
    } else {
      this.currentPage = this.currentPage;
    }
  },
  methods: {
    goApplyList(row){
      this.$router.push({
        path: "normalVote/applylist/" + row.voteId,
        query: {
          isAutoAudit: row.isAutoCheck
        }
      });
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
      // console.log(this.$refs.selectTwoName.selected.label)
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
        console.log(this.firstNav.type)
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.caseCollection(this.currentPage);
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
        this.caseCollection(this.currentPage);
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
  
      this.setList.contentId = obj.voteId;
      this.setList.contentTitle = obj.title;
      this.setList.contentBgUrl = obj.backgroundImage;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.startTime;
      this.setList.showTimeEnd = obj.endTime;
      this.setList.status = obj.activityStatus;
      // this.setList.busId = obj.busId;
      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(api.editReShow + "/" + this.contentType + "/" + obj.voteId);
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
        arrId.push(item.voteId);
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
          if (conditions[key].voteId == products[index].contentId) {
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
    caseCollectSst(voteId, status) {
      let params = {
        ids: [voteId],
        stopFlag: status
      };
      http.post(api.voteControlEnable, params).then(res => {
        if (res.data.code === 0) {
          this.caseCollection(this.currentPage);
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    caseCollection: async function(pageNum) {
      if(this.formInline.endTime !== null){
        if (this.formInline.startTime > this.formInline.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      let params = {};
       
        params = {
          pageIndex: pageNum,
          pageSize: 10,
          param: {
            ...this.formInline
          }
        }
      
      const res = await http.post(api.voteManageList, params);
      if (res.data.code === 0) {
        // this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;

        this.tableData2 = res.data.data.records;
        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.message);
      }
    },
    godetails(id, voteType, voteShowType, scoreShowType, voteId) {
      this.$router.push({
        path: "/activity/normalVoteDetailV3/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType,
          voteShowType: voteShowType,
          scoreShowType: scoreShowType,
          voteId: voteId
        }
      });
    },
    goVoteSet(id,voteId,actType) {
      this.$router.push({
        path: "/activity/voteSet/" + id,
        query: {
          voteId: voteId,
          actType: actType
        }
      });
    },
    goStyleSet(id,voteId) {
      this.$router.push({
        path: "/activity/styleSet/" + id,
        query: {
          voteId: voteId
        }
      });
    },
    goranklist(id, voteType, voteId, title, actType) {
      this.$router.push({
        path: "/activity/normalRankingListV3/" + id,
        query: {
          page: this.currentPage,
          voteType: voteType,
          voteId: voteId,
          title: title,
          actType: actType
        }
      });
    },
    govoteSelect(id,photoStatus,voteId) {
      this.$router.push({
        path: "/activity/normalVoteSelectV3/" + id,
        query: {
          page: this.currentPage,
          photoStatus: photoStatus,
          voteId: voteId
        }
      });
    },
    handleCurrentChange(val) {
      this.caseCollection(val);
      this.currentPage = val;
    },
    endcase(id) {
      this.endId = id;
      this.ends = true;
    },
    startTimes() {
      this.formInline.startTime = Date.parse(this.formInline.startTime);
    },
    endTimes() {
      if (this.formInline.endTime.getFullYear) {
        let Year = this.formInline.endTime.getFullYear();
        let Month = this.formInline.endTime.getMonth() + 1;
        let getDate = this.formInline.endTime.getDate();
        this.formInline.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime();
      }
    },
    endsVideo() {
      this.endcaseCollection();
      this.ends = false;
    },
    endcaseCollection: async function() {
      let params = {
        voteId: this.endId
      };
      const res = await http.post(api.endVoteCase, params);
      if (res.data.code === 0) {
        this.caseCollection(this.currentPage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.caseCollection();
    }
  }
};
</script>

<style scoped>
</style>
