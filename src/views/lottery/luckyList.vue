<template>
  <div class="winner">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInline">
      <el-form-item label="奖品描述">
        <el-input v-model="formInline.prizeDesc" placeholder="奖品描述关键字"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.userPhone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" @click="answerExport" size="small">导出</el-button>
      </el-form-item>
    </el-form>
    
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick(activeName)">
      <el-tab-pane label="全部" name="first"></el-tab-pane>
      <el-tab-pane label="通过" name="second"></el-tab-pane>
      <el-tab-pane label="拒绝" name="third"></el-tab-pane>
    </el-tabs>
    
    <div>
      <!-- 未开通多身份使用医生配置表格 -->
      <IdentityTable
        v-if="identity === 0"
        :data="tableData"
        :tableConfig="doctorConfig"
        :hasSelect="false"
        ref="comment"
        @pass="pass"
        @refuse="refuse"
        @reason="reason"
      ></IdentityTable>
    </div>
    
    <div class="identity-tab" v-if="identity === 1">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.titlename }}</el-button>
      
    </div>

    <div v-if="identity === 1">
      <IdentityTable
      v-if="titleId === 1"
      :data="tableData"
      :tableConfig="doctorConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 2"
      :data="tableData"
      :tableConfig="drugStoreConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 3"
      :data="tableData"
      :tableConfig="companyConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 4"
      :data="tableData"
      :tableConfig="patientConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 5"
      :data="tableData"
      :tableConfig="visitorConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 6"
      :data="tableData"
      :tableConfig="nurseConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 7"
      :data="tableData"
      :tableConfig="pharmacistConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 8"
      :data="tableData"
      :tableConfig="technicianConfig"
      :hasSelect="false"
      ref="comment"
      @pass="pass"
      @refuse="refuse"
      @reason="reason"
    ></IdentityTable>

    </div>
    

    <el-dialog title="审核通过" :visible.sync="endsPass">
      <span>点击【确定】审核通过，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endsPass = false">取 消</el-button>
        <el-button type="primary" @click="pass(null,1)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核拒绝" :visible.sync="endsRefuse">
      <el-form :model="form" label-width="100px">
      <el-form-item label="*拒绝原因：">
        <el-input
          style="width:500px"
          type="textarea"
          :rows="6"
          maxlength="50"
          placeholder="请输入拒绝原因50字以内"
          v-model="form.rejectReason">
        </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endsRefuse = false">取 消</el-button>
        <el-button type="primary" @click="refuse(null,1)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核拒绝" :visible.sync="endsReason">
      <el-form :model="form" label-width="100px">
      <el-form-item label="*拒绝原因：">
        <el-input
          style="width:500px"
          type="textarea"
          :rows="6"
          maxlength="50"
          placeholder="请输入拒绝原因50字以内"
          disabled
          v-model="form.rejectReason">
        </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endsReason = false">取 消</el-button>
        <el-button type="primary" @click="endsReason = false">确 定</el-button>
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
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import IdentityTable from "@/views/business/class/base/identityTable";
import LotteryConfig from "@/views/lottery/base/identity2.json";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";

export default {
  components: {
    HeaderContent,
    IdentityTable
  },
  data() {
    return {
      titleId: 1,
      identityArr: [],
      endsPass: false,
      endsRefuse: false,
      endsReason: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      activeName: "first",
      headerTitle: "抽奖列表 > 中奖名单",
      opertions: ["返回"],
      identityActive: 0,
      // identityArr: [],
      // identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      formInline: {
        prizeDesc: null,
        userPhone: null
      },
      prizeId: null,
      recordId: null,
      virtualPrizeId: null,
      verifyCode: null,
      form:{
        rejectReason: ""
      },
      lotteryId: this.$route.params.lotteryId,
      doctorConfig: LotteryConfig.doctorConfig, //医生身份
      companyConfig: LotteryConfig.companyConfig, //企业身份
      drugStoreConfig: LotteryConfig.drugStoreConfig, //药店身份
      patientConfig: LotteryConfig.patientConfig, //患者身份
      visitorConfig: LotteryConfig.visitorConfig, //游客身份
      nurseConfig: LotteryConfig.nurseConfig, //护士身份
      pharmacistConfig: LotteryConfig.pharmacistConfig, //药师身份
      technicianConfig: LotteryConfig.technicianConfig, //技师身份
    };
  },
  filters: {},
  computed: {
    ...mapGetters(["identity"])
  },
  mounted() {
    this.lotteryWinners(1);
    this.getIdentityList();
  },
  methods: {
    onSubmit() {
      this.lotteryWinners(this.currentPage);
    },
    async reason(row) {
      this.recordId = row.recordId
      await http
        .get(api.getRejectReason + "/" + this.lotteryId + "/" + this.recordId)
        .then(res => {
          const data = res.data;
          if (data.code !== 200) {
            this.$message.error(data.msg);
          } else {
            this.form.rejectReason = res.data.data
            this.endsReason = true
          }
        });
    },
    refuse: async function(row,val) {
      this.endsRefuse = true
      if(val === 1) {  // 点击确定按钮设置拒绝
        // this.verifyCode = 2
        this.winnersVerify(2)
        this.endsRefuse = false
      } else {  // 点击通过按钮设置参数
        this.form.rejectReason = ""
        this.prizeId = row.prizeId
        this.recordId = row.recordId
        this.virtualPrizeId = row.virtualPrizeId
        this.verifyCode = row.verifyCode
        this.rejectReason = this.form.rejectReason
      }
    },
    pass: async function(row,val) {
      this.endsPass = true
      if(val === 1) {  // 点击确定按钮设置通过
        // this.verifyCode = 1
        this.winnersVerify(1)
        this.endsPass = false
      } else {  // 点击通过按钮设置参数
        this.prizeId = row.prizeId
        this.recordId = row.recordId
        this.virtualPrizeId = row.virtualPrizeId
        this.verifyCode = row.verifyCode
      }
    },
    handleClick(activeName) {
      if(activeName === "first"){
        this.verifyCode = null
      }else if (activeName === "second") {
        this.verifyCode = 1
      }else {
        this.verifyCode = 2
      }
      this.lotteryWinners(1);
    },
    identityClick(item, index) {
      this.titleId = item.titleId;
      this.identityActive = index;

      // this.identity = item.titleId;
      // this.identityActive = index;
      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var params = {};
      var res = await http.post(api.getQaIdentityList, params);
      if (res.data.code === 0) {
        // this.identityArr = res.data.data;
        // this.identity = this.identityArr[0].titleId;

        this.identityArr = res.data.data;
        this.titleId = this.identityArr[0].titleId;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    winnersVerify: async function(verifyCode) {
      var params = {
        lotteryId: this.lotteryId,
        prizeId: this.prizeId,
        recordId: this.recordId,
        virtualPrizeId: this.virtualPrizeId,
        verifyCode: verifyCode,
        rejectReason: this.form.rejectReason
      }
      
      var res = await http.post(api.winnersVerify, params);
      if (res.data.code === 200) {
        this.$message.success("设置成功");
        this.verifyCode = null
        this.lotteryWinners(1)
      } else {
        this.$message.error(res.data.msg);
      }
    },
    lotteryWinners: async function() {
      var params = {
        lotteryId: this.lotteryId,
        identity: this.titleId,
        verifyCode: this.verifyCode,
        prizeDesc: this.formInline.prizeDesc,
        userPhone: this.formInline.userPhone,
        pageSize: 10,
        pageNum: this.currentPage
      }
      
      var res = await http.post(api.lotteryWinners, params);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.msg);
      }
    },

    headerClick() {
      this.$router.go(-1);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.lotteryWinners(val);
    },
    async answerExport() {
      var params = {
        lotteryId: this.$route.params.lotteryId,
        verifyCode: this.verifyCode,
        keyWord: this.formInline.prizeDesc,
        userPhone: this.formInline.userPhone
      };
      var res = await http.post(api.exportWinners, params);
      if (res.data.code === 200) {
        window.open(res.data.data);
      } else {
        this.$message.error(res.data.msg);
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.infos-block {
  display: flex;
}

.infos-block .infos-self {
  display: inline-block;
  width: 100px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  /* margin-right: 30px; */
}

.infos-block .infos-content {
  display: inline-block;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  margin-right: 30px;
}

.winner-one {
  overflow: hidden;
  padding: 20px 0;
}

.winner-one .winner-list:nth-child(1) {
  width: 150px;
}

.winner-one .winner-list:nth-child(2) {
  width: 180px;
}

winner-one .winner-list:nth-child(3) {
  width: 400px;
}

.winner-list {
  float: left;
  margin: 0 20px 0 0;
}

.winners {
  width: 200px;
}

.demo-form-inline {
  height: 55px;
  overflow: hidden;
}
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


