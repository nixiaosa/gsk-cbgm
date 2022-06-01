<template>
  <div class="createTenant">
    <header-content :title="headerTitle"></header-content>
    <div class="title-info">
      <p>此模块是科室设置，您可以依据平台需要，设置哪些科室让平台用户在手机端和web端登录后看到。</p>
      <p>注意：1. 默认所有科室对用户可见，在第一次使用时，可以根据需要，设置【对用户不可见】；</p>
      <p>2科室不能增加、修改和删除，如果您有增加或修改科室的要求，请联系负责您平台的我司项目人员或销售人员。</p>
    </div>
    <div class="basicInfo">
      <el-form :model="basicInfo" ref="basicInfo" label-width="100px" class="demo-ruleForm">
        <div>
          <el-form-item label="科室名称：" prop="name">
            <el-input class="input400" v-model="basicInfo.name"></el-input>
            <el-button type="primary" @click="search()" style="margin-left:20px">{{searchButton}}</el-button>
            <el-button
              type="success"
              @click="dialogShow = true"
              style="float:right"
            >{{sevealVisible}}</el-button>
            <el-button
              type="primary"
              @click="dialogHide = true"
              style="float:right"
            >{{sevealUnvisible}}</el-button>
          </el-form-item>
        </div>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="ID" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="科室名称">
            <template slot-scope="scope">
              <span>{{ scope.row.officeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.visible===true"
                size="small"
                type="primary"
                @click="setVisible(scope.row.id,scope.row.visible)"
              >{{ visibleName }}</el-button>
              <el-button
                v-if="scope.row.visible===false"
                size="small"
                type="danger"
                @click="setVisible(scope.row.id,scope.row.visible)"
              >{{ unvisibleName }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-pagination
        background
        :current-page="pageNum"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total"
        :page-size="20"
        style="margin-top:20px"
      ></el-pagination>
    </div>
    <el-dialog title="批量设置科室" :visible.sync="dialogShow" width="30%">
      <span>
        您确认要将您选择的
        <strong>{{this.multipleLength}}</strong>条科室名称设置为【对用户可见】
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="batchSet()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量设置科室" :visible.sync="dialogHide" width="30%">
      <span>
        您确认要将您选择的
        <strong>{{this.multipleLength}}</strong>条科室名称设置为【对用户不可见】
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHide = false">取 消</el-button>
        <el-button type="primary" @click="unbatchSet()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import http from "@/utils/tenant";
// import api from "@/api/tenantInfoSave";
import HeaderContent from "@/components/header-content";
// import { mapGetters } from "vuex";

export default {
  name: "createTenant",
  components: {
    HeaderContent
  },
  data() {
    return {
      headerTitle: "科室管理",
      searchButton: "搜索",
      sevealVisible: "批量可见",
      sevealUnvisible: "批量不可见",
      visibleName: "对用户可见",
      unvisibleName: "对用户不可见",
      dialogShow: false,
      dialogHide: false,
      pageNum: 1,
      tableData: [],
      multipleSelection: [],
      multipleLength: 0,
      multipleArray: [],
      total: 1,
      basicInfo: {
        name: ""
      }
    };
  },
  filters: {},
  computed: {},
  mounted() {
    this.getAllCompanyOffice();
  },
  methods: {
    getAllCompanyOffice: async function() {
      let params = {
        pageNum: this.pageNum,
        pageSize: 20,
        params: {
          officeName: this.basicInfo.name
        }
      };
      let res = await this.$http.post(this.$api.getcompanyoffice, params);
      this.tableData = res.data.data.list;
      this.total = res.data.data.total;
      if (res.data.code !== 0) {
        this.errorTost(res.data.message);
      }
    },
    search: async function() {
      this.pageNum = 1;
      this.getAllCompanyOffice();
    },
    setVisible: async function(id, state) {
      //单个点击设置可见
      let params = {
        visible: state === true ? false : true,
        hospitalOffices: [
          {
            id: id,
            officeName: this.basicInfo.name
          }
        ]
      };
      let res = await this.$http.post(this.$api.handleCompanyOffices, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getAllCompanyOffice(this.pageNum);
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAllCompanyOffice();
    },
    batchSet: async function() {
      //批量设置可见
      this.dialogShow = false;
      const list = [];
      this.multipleSelection.map(item =>
        list.push({
          id: item.id,
          officeName: item.officeName
        })
      );
      let params = {
        visible: true,
        hospitalOffices: list
      };
      let res = await this.$http.post(this.$api.handleCompanyOffices, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getAllCompanyOffice(this.pageNum);
      }
    },
    unbatchSet: async function() {
      //批量设置不可见
      this.dialogHide = false;
      const list = [];
      this.multipleSelection.map(item =>
        list.push({
          id: item.id,
          officeName: item.officeName
        })
      );
      let params = {
        visible: false,
        hospitalOffices: list
      };
      let res = await this.$http.post(this.$api.handleCompanyOffices, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getAllCompanyOffice(this.pageNum);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleLength = this.multipleSelection.length;
      this.multipleArray = this.multipleSelection;
    },
    messageTost(val) {
      // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: "success"
      });
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: "error"
      });
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.basicInfo {
  margin-top: 30px;
  margin-left: 20px;
}
.input400 {
  width: 400px;
}
strong {
  margin: 0 3px;
  color: #f00;
}
.title-info {
  p {
    line-height: 1;
    font-size: 12px;
    &:last-child {
      text-indent: 37px;
    }
  }
}
</style>
