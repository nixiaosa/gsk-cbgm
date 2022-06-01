<template>
  <div>
    <header-content :title="headerTitle"/>
    <questionnaire-aliases/>
    <search-form :loading="searchLoading" @change="searchChange" name="QuestionnaireManage"/>
    <table-list :data="listData" name="QuestionnaireManageV2" @change="tableListChange"/>
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
      style="margin-top: 20px"
      background
      :current-page="pageNum"
      @current-change="pageNumChange"
      layout="total, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import SearchForm from "@/components/search/SearchForm";
import HeaderContent from "@/components/header-content";
import TableList from "@/components/table-content/TableList";
import { mapGetters } from "vuex";
import QuestionnaireAliases from "@/views/activity/questionnaire/questionnaireManageVersion/QuestionnaireAliases";

export default {
  name: "questionnaireManage",
  components: {
    QuestionnaireAliases,
    HeaderContent,
    TableList,
    SearchForm
  },
  data() {
    return {
      listData: [],
      tableData2: [],
      pageNum: parseInt(this.$route.query.page) || 1,
      total: 0,
      searchLoading: false,
      firstNavName:"",
      secondNavName:"",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      firstNavArr: [],
      contentType: 2,
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
      headerTitle: "调研问卷管理",
      xlsUrls: ''
    };
  },
  computed: {
    ...mapGetters(["identity"])
  },
  async mounted() {
    await this.getQuestionnaireList();
    this.getParentList(this.pageNum);
    this.getChildList(this.pageNum);
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
      if (!this.editForm.secondColumnId && this.firstNav.type === null ) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      var res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.getQuestionnaireList();
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
        this.getQuestionnaireList();
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
      this.setList.contentTitle = obj.questionName;
      this.setList.contentBgUrl = obj.backImg;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.startTime;
      this.setList.showTimeEnd = obj.endTime;
      this.setList.busId = obj.busId;
      this.setList.status = obj.status;
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
        this.listData = this.tableData2;
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
    tableListChange(item) {
      // 列表按钮触发
      if (item.btnName.prop === "END") {
        this.questionnaireFinish(item.id);
      } else if(item.btnName.prop === "STOP" || item.btnName.prop === "START") {
        this.questionnaireStop(item.id, item.btnName.prop)
      } else if (item.btnName.prop === "CHECK") {

        // if(this.identity === 0){  // 0未开启身份开关
        //   this.$router.push({ path: `questionnaireDetails/${item.id}` });
        // }else if(this.identity === 1){ // 1开启身份开关
        //   this.$router.push({ path: `questionnaireDetailsV2/${item.id}` });
        // }

        this.$router.push({path: `questionnaireDetails/${item.id}`})
      } else if (item.btnName.prop === "SET") {
        this.setContentColumns(item);
      } else if(item.btnName.prop === "EXPORT") {
        this.photoExport(item.id)
      } else if(item.btnName.prop === "EXPORTDATA") {
        this.$router.push({
          path: `questionnaireDetails/${item.id}`,
          query: {
            active: "exportList"
          }
        })
      } else if (item.btnName.prop === "APPLYMANAGE"){
        this.$router.push({
          path: "questionnaireManage/applylist/" + item.id,
          query: {
            isAutoAudit: item.autoAudit
          }
        });
      }
    },
    // 停/启用
    async questionnaireStop(id, prop) {
      var res = await http.get(api.questionnaireStop + id)
      let {code, message} = res.data
      if (code === 0) {
        if (prop === "STOP") {
          this.$message.success('停用成功')
        } else if(prop === "START") {
          this.$message.success('启用成功')
        }
        this.getQuestionnaireList()
      } else {
        this.$message.error(message)
      }
    },
    // 导出证件照
    async photoExport(id) {
      var res = await http.post(api.questionnaireExportIdPhotoList + id)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.xlsUrls = res.data.data
        window.open(this.xlsUrls)
      } else {
         this.$message.error(res.data.message)
      }
    },
    questionnaireFinish(id) {
      // 结束问卷
      http.post(this.$api.questionnaireFinish + id).then(res => {
        let { code, message } = res.data;
        if (code === 0) {
          this.$message.success("结束成功");
          this.getQuestionnaireList();
        } else {
          this.$message.error(message);
        }
      });
    },
    pageNumChange(num) {
      // 切换分页器时触发
      this.pageNum = num;
      this.getQuestionnaireList();
      // 页面切换后 回到当前分页
      this.$router.push({
        query: {
          page: num
        }
      });
    },
    searchChange(item) {
      // 搜索触发
      this.pageNum = 1;
      this.getQuestionnaireList(item);
      this.searchLoading = true;
    },
    getQuestionnaireList(search) {
      // 获取调研问卷管理列表
      let params = {
        ...search,
        questionName: search ? search.title : null,
        creater: search ? search.creater : null,
        pageSize: 10,
        pageNum: this.pageNum ? this.pageNum : 1
      };
      http.post(this.$api.questionnaireList, params).then(res => {
        this.searchLoading = false;
        let { code, data, message } = res.data;
        if (code === 0) {
          let list = data.list;
          list.map(item => {
            if (item.status > 0 && item.status < 4) {
              item.END = true;
            }
            if (item.isCredentials) {
              item.EXPORT = true
            }
            if( item.status !== 0) {
              item.SET = true
            }
            if (item.stop) {
              item.START = true
            } else {
              item.STOP = true
            }
          });
        //   this.listData = data.list;
          this.total = data.total;

          this.tableData2 = data.list;
          this.getAllId(this.tableData2);
        } else {
          this.$message.error(message);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
