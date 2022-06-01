<template>
  <div>
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" v-if="!Number($route.query.isAutoAudit)" @click="applyPassBatch" style="margin-left:10px">批量同意</el-button>
        <el-button type="info" size="small" v-if="!Number($route.query.isAutoAudit)" @click="applyRefuseBatch" style="margin-left:10px">批量拒绝</el-button>
        <el-button type="info" size="small" @click="downLoad" style="margin-left:10px">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 未开通多身份start -->
    <IdentityTable :data="tableData" :tableConfig="noIdentityConfig" :hasSelect="true" :isAutoAudit="Number($route.query.isAutoAudit)" @applyPass="applyPass" @applyRefuse="applyRefuse" @handleSelectionChange="handleSelectionChange" ref="comment"></IdentityTable>
    <!-- 未开通多身份end -->

    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>


    <el-dialog title="拒绝原因" :visible.sync="refuseDia">
      <el-radio-group v-model="reasonStatus">
        <el-radio :label="1">仅限邀请用户参加</el-radio>
        <el-radio :label="2">仅限内部用户参加</el-radio>
        <el-radio :label="3">申请信息不符合参与条件</el-radio>
      </el-radio-group>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDia = false">取 消</el-button>
        <el-button type="primary" @click="refuse(isBatchRefuse)">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import IdentityTable from "@/views/business/class/base/identityTable";
import applyNotIdentityJson from "@/views/business/class/base/applyNotIdentity";

export default {
  name: "applyList",
  components: {
    HeaderContent,IdentityTable
  },
  props: {
  },
  data() {
    return {
      reasonStatus: 1,
      reasonMessage: "",
      refuseId: "",
      refuseDia: false,
      identityExist: "",
      identityPublic: "",
      headerTitle: '申请管理',
      opertions: ['返回'],
      tableData: [],
      currentPage: 1,
      total: 1,
      formInline:{
        phone: null
      },
      busId: this.$route.params.id,
      identityActive: 0,
      identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      multipleSelection: [],
      isBatchRefuse: false,
      noIdentityConfig: applyNotIdentityJson.applyManageCourse //未开通多身份配置
    }
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return ''
      }
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    sex(val) {
      switch (val) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return "";
      }
    },
    states(v) {
      switch (v) {
        case 1:
          return "未审核";
        case 2:
          return "审核未通过";
        case 3:
          return "审核通过";
        case 4:
          return "已失效";
      }
    }
  },
  async mounted() {
    this.getApplyList(1)
  },
  methods: {
    async downLoad(){
      const res = await http.get(api.applyManageListExport + this.busId);
      if (res.data.code === 0) {
        window.open(res.data.data)
        this.$message.success("导出成功");
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = []
      val.map(item => {
        this.multipleSelection.push(item.id)
      })
      // console.log(this.multipleSelection)
    },
    applyPassBatch: async function(row){
      const params = {
        enrollIds: this.multipleSelection,
        status: 3
      };
      const res = await http.post(api.applyApproveBatch, params);
      if (res.data.code === 0) {
        this.getApplyList(1)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.data.message);
      }
    },
    applyPass: async function(row){
      const params = {
        id: row.id,
        status: 3
      };
      const res = await http.post(api.applyApprove, params);
      if (res.data.code === 0) {
        this.getApplyList(1)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.data.message);
      }
    },
    applyRefuse(row){
      this.isBatchRefuse = false
      this.refuseDia = true
      this.reasonStatus = 1
      this.refuseId = row.id
    },
    applyRefuseBatch(row){
      this.isBatchRefuse = true
      this.refuseDia = true
      this.reasonStatus = 1
    },
    refuse: async function(isBatchRefuse){
      this.refuseDia = false
      if(this.reasonStatus === 1){
        this.reasonMessage = "仅限邀请用户参加"
      } else if(this.reasonStatus === 2){
        this.reasonMessage = "仅限内部用户参加"
      } else {
        this.reasonMessage = "申请信息不符合参与条件"
      }
      if(!isBatchRefuse){ // 单个拒绝
        const params = {
        id: this.refuseId,
        status: 2,
        message: this.reasonMessage
      };
      const res = await http.post(api.applyApprove, params);
        if (res.data.code === 0) {
          this.getApplyList(1)
        } else {
        this.$message.error(res.data.message);
        }
      }else{ // 批量拒绝
        const params = {
          enrollIds: this.multipleSelection,
          status: 2,
          message: this.reasonMessage
        };
        const res = await http.post(api.applyApproveBatch, params);
          if (res.data.code === 0) {
            this.getApplyList(1)
          } else {
            this.$message.error(res.data.message);
          }
      }
    },
    getApplyList: async function(pageNum){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          ...this.formInline,
          busId: this.$route.params.id
        }
      };
      const res = await http.post(api.applyManageList, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total
        this.currentPage = pageNum;
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit(){
      this.getApplyList(1)
    },
    headerClick() {
      this.$router.back()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getApplyList(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.identity-tab {
  margin-bottom: 10px;
}
.identity-tab .el-button:hover{
  background-color: $c-theme2;
  color: $c-theme;
  border: 1px solid $c-theme;
}
.identityActive {
  background-color: $c-theme2;
  color: $c-theme;
}
</style>
