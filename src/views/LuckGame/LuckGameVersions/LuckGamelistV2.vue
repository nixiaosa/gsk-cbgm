<template>
  <div class="jhg">
    <header-content :title="headerTitle"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form"></Headers>
    <el-button type="primary" class="btnsl" @click="Inquire">查询</el-button>
    <div style="margin:20px;"></div>
    <el-table :data="tableData" border>
      <el-table-column width="240" label="抽奖游戏名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
      <el-table-column width="144" label="模式">
        <template slot-scope="scope">
          <span>{{ scope.row.patternName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="290" label="游戏周期">
        <template slot-scope="scope">
          <span>{{ scope.row.periodBegin | formatDate }}</span>
          -
          <span>{{ scope.row.periodEnd | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="144" label="游戏状态">
        <template slot-scope="scope">
          <span>{{ scope.row.states | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="260" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="godetail(scope.row.id)"
            v-if="userAuths.activity_game_detail"
          >查看详情</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.id,1)"
            v-if="scope.row.status == 0"
          >启用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.id,0)"
            v-if="scope.row.status == 1"
          >停用</el-button>
          <el-button
            type="info"
            size="small"
            @click="setContentColumns(scope.row)"
          >栏目设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
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
</template>
<script>
import HeaderContent from "@/components/header-content";
import Headers from "../base/header1";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
export default {
  name: "LuckGamelist",
  components: {
    HeaderContent,
    Headers
  },
  data() {
    return {
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 3,
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
      tableData: [],
      tableData2: [],
      headerTitle: "抽奖游戏管理",
      form: {
        title: "",
        startTime: "",
        endTime: "",
        status: ""
      },
      total: 0,
      currentPage: 1,
      labelPosition: "left",
      itemDatas: [
        {
          label: "游戏状态",
          placeholder: "请选择"
        },
        {
          label: "游戏周期"
        },
        {
          label: "游戏名称",
          placeholder: "请输入游戏名称"
        }
      ],
      options: [
        {
          label: "全部"
        },
        {
          status: 1,
          label: "未开始"
        },
        {
          status: 0,
          label: "未发布"
        },
        {
          status: 2,
          label: "进行中"
        },
        {
          status: 3,
          label: "已结束"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["userAuths"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      if (state === 0) {
        return "未发布";
      } else if (state === 1) {
        return "未开始";
      } else if (state === 2) {
        return "进行中";
      } else if (state === 3) {
        return "已结束";
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
    await this.luckyGamelist(1);

    this.getParentList(this.currentPage);
    this.getChildList(this.currentPage);
  },
  methods: {
    // selectOne() {
    //   //change 触发事件
    //   //直接就拿到当前的这个对象了
    //   for (const index1 in this.firstNav) {
    //     for (const key1 in this.editForm) {
    //       if (this.editForm.firstColumnId == this.firstNav[index1].id) {
    //         this.editForm.type1 = this.firstNav[index1].type;
    //       }
    //     }
    //   }
    //   this.firstNav.type = this.editForm.type1;
    //   // console.log(this.editForm.type1);
    // },
    // selectOne2() {
    //   //change 触发事件
    //   //直接就拿到当前的这个对象了
    //   for (const index2 in this.secondNav) {
    //     for (const key2 in this.editForm) {
    //       if (this.editForm.secondColumnId == this.secondNav[index2].id) {
    //         this.editForm.type2 = this.secondNav[index2].type;
    //       }
    //     }
    //   }
    //   this.secondNav.type = this.editForm.type2;
    //   // console.log(this.editForm.type2);
    // },
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
      this.setList.contentTitle = obj.name;
      // this.setList.contentBgUrl = obj.imageUrl;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.periodBegin;
      this.setList.showTimeEnd = obj.periodEnd;
      this.setList.busId = obj.busId;
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
    forbidden: async function(id, status) {
      var res = await http.get(
        api.luckyGameForbidden + "/" + id + "/" + status
      );
      if (res.data.code === 0) {
        this.luckyGamelist(this.currentPage);
        this.$message.success(res.data.data);
      } else {
        this.$message.error(res.data.data);
      }
    },

    godetail(id) {
      let page = this.currentPage;
      this.$router.push({ path: "luckdetail/gamedetail/" + id + "/" + page });
    },
    luckyGamelist: async function() {
      var params1 = {
        pageSize: 10,
        pageNum: this.currentPage,
        params: {}
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
          params: {
            states: this.form.status,
            periodBegin: this.form.startTime,
            periodEnd: this.form.endTime,
            name: this.form.title
          }
        };
      }
      if (this.form.startTime !== "" && this.form.endTime !== "") {
        if (this.form.startTime > this.form.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      var res = await http.post(api.luckyGamelist, params1);
      // console.log(res);
      if (res.data.code === 0) {
        this.tableData2 = res.data.data.data;
        this.total = res.data.data.total;

        this.getAllId(this.tableData2);
      } else {
        this.$message.error(res.data.message);
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
<style scoped>
.btnsl {
  /* width: 130px; */
  position: absolute;
  top: 140px;
}
</style>


