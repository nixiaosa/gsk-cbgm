<template>
  <div class="createTenant">
    <header-content :title="headerTitle"></header-content>
    <div class="title-info">
      <p>此功能是职称管理，您可以根据平台需要，设置哪些职称让平台用户看到。</p>
      <p>注意：1.默认仅 住院医师、主治医师、副主任医师、主任医师对用户可见，您可以根据需要，设置其他职称【对用户可见】</p>
      <p>2.职称不能增加、修改和删除。</p>
    </div>
    <div class="basicInfo">
      <el-form :model="basicInfo" ref="basicInfo" label-width="100px" class="demo-ruleForm">
        <div>
          <el-button
              type="success"
              @click="dialogShow = true"
              style="float:right;margin:0 0 20px 10px"
            >{{sevealVisible}}</el-button>
            <el-button
              type="primary"
              @click="dialogHide = true"
              style="float:right"
            >{{sevealUnvisible}}</el-button>
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
          <el-table-column label="职称名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isDeleted"
                size="small"
                type="primary"
                @click="setVisible(scope.row.id,0)"
              >{{ visibleName }}</el-button>
              <el-button
                v-if="!scope.row.isDeleted"
                size="small"
                type="danger"
                @click="setVisible(scope.row.id,1)"
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
    <el-dialog title="批量设置职称" :visible.sync="dialogShow" width="30%">
      <span>
        您确认要将您选择的
        <strong>{{this.multipleLength}}</strong>条职称名称设置为【对用户可见】
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="batchSet()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量设置职称" :visible.sync="dialogHide" width="30%">
      <span>
        您确认要将您选择的
        <strong>{{this.multipleLength}}</strong>条职称名称设置为【对用户不可见】
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
  name: "professional",
  components: {
    HeaderContent
  },
  data() {
    return {
      headerTitle: "职称管理",
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
    this.getProfessional();
  },
  methods: {
    getProfessional: async function() {
      let params = {
        pageNum: this.pageNum,
        pageSize: 20
      };
      let res = await this.$http.post(this.$api.getProfessional, params);
      this.tableData = res.data.data.list;
      this.total = res.data.data.total;
      if (res.data.code !== 0) {
        this.errorTost(res.data.message);
      }
    },
    search: async function() {
      this.pageNum = 1;
      this.getProfessional();
    },
    setVisible: async function(id, state) {
      //单个点击设置可见
      let params = {
        isDeleted: state,
        ids: [id]
      };
      let res = await this.$http.post(this.$api.handleProfessional, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getProfessional(this.pageNum);
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getProfessional();
    },
    batchSet: async function() {
      //批量设置可见
      this.dialogShow = false;
      const list = [];
      this.multipleSelection.map(item =>
        list.push(item.id)
      );
      let params = {
        isDeleted: 0,
        ids: list
      };
      let res = await this.$http.post(this.$api.handleProfessional, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getProfessional(this.pageNum);
      }
    },
    unbatchSet: async function() {
      //批量设置不可见
      this.dialogHide = false;
      const list = [];
      this.multipleSelection.map(item =>
        list.push(item.id)
      );
      let params = {
        isDeleted: 1,
        ids: list
      };
      let res = await this.$http.post(this.$api.handleProfessional, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getProfessional(this.pageNum);
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
