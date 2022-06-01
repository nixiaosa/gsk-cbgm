<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="资料名称">
        <el-input v-model="formInline.title" placeholder="请输入资料名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="资料名称" width="300px">
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
      <el-table-column label="上传时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大小">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}M</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row.available | availableStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.status !== 0"
            type="info"
            size="small"
            @click="goEdit(scope.row.id)"
          >编辑</el-button>
          <el-button
            v-show="!scope.row.available"
            type="success"
            size="small"
            @click="forbidden(scope.row.id, 1)"
          >启用</el-button>
          <el-button
            v-show="scope.row.available"
            type="warning"
            size="small"
            @click="forbidden(scope.row.id, 0)"
          >停用</el-button>
          <el-button v-if="scope.row.status !==0 " @click="setContentColumns(scope.row)" type="info" size="small">栏目设置</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  name: "materialList",
  components: {
    HeaderContent
    // Pagination
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatDates(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    availableStatus(state){
      switch (state) {
        case 0:
          return "已停用";
        case 1:
          return "已启用";
      }
    }
  },
  data() {
    return {
      headerTitle: "资料管理",
      opertions: ["新建资料"],
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
        title: ""
      },
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 21,
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
    };
  },
  async mounted() {
    await this.materialList(this.currentPage);

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
    headerClick(id){
      this.$router.push({
        path: "edit/",
        query: {
          busId: "847407440"
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
        if (item.parentId == this.editForm.firstColumnId && item.type == 9) {
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
        this.materialList(this.currentPage);
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
        this.materialList(this.currentPage);
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
        typeList: [9],
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
      this.setList.contentId = obj.id;
      this.setList.contentTitle = obj.title;
      // this.setList.contentBgUrl = obj.coverUrlPc;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.createTime;
      // this.setList.showTimeEnd = obj.endTime;
      // this.setList.busId = obj.busId;
      this.setList.status = obj.status;
      // this.setList.size = obj.size;
      // this.setList.author = obj.author;
      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(api.editReShow + "/" + this.contentType + "/" + obj.id);
      if (res.data.code === 0 && res.data.data != null) {
        // this.editForm.firstColumnId = res.data.data.firstColumnId;
        this.editForm.firstColumnId = res.data.data.firstColumnId == 0 ? null : res.data.data.firstColumnId;
        this.editForm.secondColumnId = res.data.data.secondColumnId == 0 ? null : res.data.data.secondColumnId;
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
        if (item.parentId == this.editForm.firstColumnId && item.type == 9) {
          this.secondNav.push(item)
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
    forbidden(id, status) {
      let params = {
        id: id,
        available: status
      };
      http.post(api.documentCreate, params).then(res => {
        if (res.data.code === 0) {
          this.materialList(this.currentPage);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    materialList: async function(pageNum) {
      let params = {
        title: this.formInline.title,
        pageNum: pageNum,
        pageSize: 10
      };
      const res = await http.post(api.documentList, params);
      if (res.data.code === 0) {
        // this.tableDatas = res.data.data.list;
        this.total = res.data.data.total;
        
        this.tableData2 = res.data.data.list;
        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.message);
      }
    },
    goEdit(id) {
      this.$router.push({
        path: "/material/edit/",
        query: {
          id: id,
          busId: id
        }
      });
    },
    handleCurrentChange(val) {
      this.materialList(val);
      this.currentPage = val;
    },
    onSubmit() {
      this.materialList(1);
    }
  }
};
</script>

<style scoped>
</style>
