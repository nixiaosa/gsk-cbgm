<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="试卷状态">
        <el-select v-model="formInline.states" placeholder="请选择试卷状态">
          <el-option
            v-for="(item,index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.states"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="答题周期">
        <el-date-picker
          type="date"
          placeholder="选择开始时间"
          format="yyyy-MM-dd"
          v-model="formInline.beginTime"
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
      <el-form-item label="试卷名称">
        <el-input v-model="formInline.name" placeholder="请输入试卷名称"></el-input>
      </el-form-item>
      <el-form-item style>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="试卷名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.examPageName }}</span>
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
      <el-table-column label="答题周期" width="280px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDates }} - {{ scope.row.endTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答题时限">
        <template slot-scope="scope">
          <span>{{ scope.row.limitTime }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="已答题数">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.finishiNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetail(scope.row.id)">查看</el-button>
          <el-button
            type="danger"
            size="small"
            @click="endcase(scope.row.id)"
            v-if="scope.row.status === 2"
          >结束答题</el-button>
          <el-button v-show="scope.row.isCredentials" type="info" size="small" @click="photoExport(scope.row.id)">导出证件信息</el-button>
          <el-button v-if="scope.row.status !== 0" @click="setContentColumns(scope.row)" type="info" size="small">栏目设置</el-button>
          <el-button
            type="info"
            size="small"
            @click="goApplyList(scope.row)"
          >申请管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="确认提示" :visible.sync="ends">
      <span style="color: red;">强制结束后不能再次开启，确定要结束吗？</span>
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
export default {
  name: "findExamManageLis",
  components: {
    HeaderContent
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    gethasTask(v) {
      switch (v) {
        case 0:
          return "否";
        case 1:
          return "是";
      }
    },
    formatDates(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      switch (state) {
        case 0:
          return "未发布";
        case 1:
          return "未开始";
        case 2:
          return "进行中";
        case 3:
          return "已结束";
        case 4:
          return "已失效";
      }
    }
  },
  data() {
    return {
      xlsUrls: '',
      headerTitle: "线上答题管理",
      currentPage: 1,
      total: 1,
      ends: false,
      id: "2",
      endId: "",
      tableDatas: [],
      tableData2: [],
      statusList: [
        { label: "全部" },
        { label: "未发布", states: 0 },
        { label: "未开始", states: 1 },
        { label: "进行中", states: 2 },
        { label: "已结束", states: 3 },
        { label: "已失效", states: 4 }
      ],
      formInline: {
        states: null,
        beginTime: null,
        endTime: null,
        name: null
      },
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 4,
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
      }
    };
  },
  async mounted() {
    await this.findExamManageLis(this.currentPage);
    this.getParentList(this.currentPage);
    this.getChildList(this.currentPage);
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page);
      this.currentPage = page;
    }
  },
  methods: {
    // 导出证件照
    async photoExport(id) {
      var res = await http.get(api.questionManageCredentialsExport + id)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.xlsUrls = res.data.data
        window.open(this.xlsUrls)
      } else {
        this.$message.error(res.data.message)
      }
    },
    goApplyList(row){
      this.$router.push({
        path: "answerManage/applylist/" + row.id,
        query: {
          isAutoAudit: row.auditStatus
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
      this.secondNavName = "";
      this.secondNav.map(item=>{
        if( item.id == val ){
          this.secondNavName = item.name;
          // console.log(this.secondNavName);
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
      if (!this.editForm.secondColumnId && this.firstNav.type === null ) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.findExamManageLis(this.currentPage);
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
        this.findExamManageLis(this.currentPage);
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
        // console.log(this.firstNavArr)
        // this.firstNav = res.data.data.list;
        // if(this.contentType == 7){
          // this.firstNavArr.filter(item =>{
          //   if (item.type == 5 || item.type == null || item.type == 1) {
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
      this.setList.contentTitle = obj.examPageName;
      this.setList.contentBgUrl = obj.imgUrl;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.startTime;
      this.setList.showTimeEnd = obj.endTime;
      this.setList.busId = obj.busId;
      this.setList.status = obj.status;
      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(
        api.editReShow + "/" + this.contentType + "/" + obj.id
      );
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
        arrId.push(item.id);
      }
      const res = await http.post(
        api.getContentColumnsByIds + "/" + this.contentType,
        arrId
      );
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
    findExamManageLis: async function(pageNum) {
      if (this.formInline.beginTime > this.formInline.endTime) {
        this.$message.error("开始时间不能大于结束时间");
        return false;
      }
      let params = {};
      if (
        this.formInline.states === null &&
        this.formInline.beginTime === null &&
        this.formInline.endTime === null &&
        this.formInline.name === null
      ) {
        params = {
          pageNum: pageNum,
          pageSize: 10
        };
      } else {
        this.formInline.states === ""
          ? (this.formInline.states = null)
          : this.formInline.states;
        this.formInline.name === ""
          ? (this.formInline.name = null)
          : this.formInline.name;
        params = {
          pageNum: pageNum,
          pageSize: 10,
          status: this.formInline.states,
          examPaperName: this.formInline.name,
          startTime: this.formInline.beginTime,
          endTime: this.formInline.endTime
        };
      }
      const res = await http.post(api.findManageLis, params);
      if (res.data.code === 0) {
        // this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        this.tableData2 = res.data.data.list;

        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.message);
      }
    },
    godetail(id) {
      this.$router.push({
        path: "/activity/answerDetail/" + id,
        query: {
          page: this.currentPage
        }
      });
    },
    handleCurrentChange(val) {
      this.findExamManageLis(val);
      this.currentPage = val;
    },
    endcase(id) {
      this.endId = id;
      this.ends = true;
    },
    startTimes() {
      this.formInline.beginTime = Date.parse(this.formInline.beginTime);
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
      const res = await http.post(api.doFinish + this.endId);
      if (res.data.code === 0) {
        this.findExamManageLis(this.currentPage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit() {
      this.findExamManageLis(this.currentPage);
    }
  }
};
</script>

<style scoped>
</style>
