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
    <IdentityTable v-if="!identityExist" :data="tableData" :tableConfig="noIdentityConfig" :hasSelect="true" :isAutoAudit="Number($route.query.isAutoAudit)" @applyPass="applyPass" @applyRefuse="applyRefuse" @handleSelectionChange="handleSelectionChange" ref="comment"></IdentityTable>
    <!-- 未开通多身份end -->

    <!-- 开通多身份start -->
    <div class="identity-tab" v-if="identityExist">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.identityName }}</el-button>
    </div>

    <IdentityTable v-if="identityExist" :data="identityTableData" :tableConfig="fieldsTitleArr" :hasSelect="true" :isAutoAudit="Number($route.query.isAutoAudit)" @applyPass="applyPass" @applyRefuse="applyRefuse" @handleSelectionChange="handleSelectionChange" ref="comment"></IdentityTable>
    <!-- 开通多身份end -->
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
    await this.getIdentityVideoVersion(this.$route.params.id)
    if(this.identityExist){
      await this.getIdentityList();
      await this.getIdentityFields();
    }
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
    getIdentityVideoVersion: async function(busId) {
      var res = await http.get(api.getIdentityVideoVersion + busId);
      if (res.data.code === 0) {
        this.identityExist = res.data.data.exist;
        // this.identityPublic = res.data.data.isPublic;
      } else {
        this.$message.error(res.data.message);
      }
    },
    getIdentityFields: async function() {
      //获取身份表头
      var res = await http.get(
        api.getIdentityFields + this.busId + "/" + this.identity
      );
      if (res.data.code === 0) {
        this.fieldsTitleArr = res.data.data.map(item => {
          const resObj = {};
          resObj.label = item.fieldTitle;
          resObj.prop = item.fieldId;
          return resObj;
        });

        this.arrIndex = this.fieldsTitleArr.length;
         var resObj1 = {
          label: "申请时间",
          prop: "last3",
          type: "lastTime"
        };
        var resObj2 = {
          label: "状态",
          prop: "last2",
          type: "applyStatus"
        };
        var resObj3 = {
          label: "审核时间",
          prop: "last1",
          type: "lastTime"
        };
        var resObj4 = {
          label: "操作",
          prop: "last",
          type: "applyAction"
        };
        var resObj5 = {
          label: "id",
          prop: "id"
        };
        var resObj6 = {
          label: "审核结果",
          prop: "message"
        };
        var resObj7 = {
          label: "手机号",
          prop: "first1"
        };
        this.fieldsTitleArr.unshift(resObj7);
        this.fieldsTitleArr.push(resObj1);
        this.fieldsTitleArr.push(resObj2);
        this.fieldsTitleArr.push(resObj3);
        this.fieldsTitleArr.push(resObj4);
        // this.fieldsTitleArr.push(resObj5);
        this.fieldsTitleArr.push(resObj6);
      } else {
        this.$message.error(res.data.message);
      }
    },
    identityClick(item, index) {
      this.identity = item.identity;
      this.identityActive = index;
      this.getIdentityFields();
      // this.videoDataList(1, 1);
      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var res = await http.get(api.getIdentityList + this.busId);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identity = this.identityArr[0].identity;
        // console.log(this.identityArr)
      } else {
        this.$message.error(res.data.message);
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
      if(this.identityExist){
        params.params.identity = this.identity
      }
      const res = await http.post(api.applyManageList, params);
      if (res.data.code === 0) {
          if(this.identityExist){ // 开通多身份情况
            var data1 = res.data.data;
            const enrollVo = res.data.data.list;
            // const enrollVo = this.testdata;
            // 用与生成el-table的data
            const data = enrollVo.map(item => {
              const res = {};
              item.enrollFieldVos.forEach(el => {
                res[el.fieldId] = el.fieldValue;
              });
    
              res["last3"] = item.createTime;
              res["last2"] = item.status;
              res["last1"] = item.passTime;
              res["id"] = item.id;
              res["message"] = item.message;
              res["first1"] = item.phone;
              return res;
            });

            this.identityTableData = data;
            this.total = data1.total;
            this.currentPage = pageNum;
          } else {  // 未开通多身份情况
            this.tableData = res.data.data.list;
            this.total = res.data.data.total
          }
          
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
