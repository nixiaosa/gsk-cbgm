<template>
  <div class="analysis">
    <div class="wrap message">
      <el-button class="down-btn" size="medium" @click="audittjDown" :loading="isLoding" type="primary">申请导出</el-button>
      <el-button v-if="(companyid == 274 || companyid == 39) && caseType == 0" class="down-btn2" size="medium" @click="audittjDown2" :loading="isLoding" type="primary">申请导出全部表单</el-button>
      <span class="message">参与用户总份数:</span>
      <span>{{ total }}</span>
      <div class="statistical" v-if="caseType == 0">
        <span>已收集：<em>{{ocrTotal}}</em>份</span>
        <span v-if="caseType == 0 && isOcr ==1">OCR识别成功数：<em>{{ocrSuccess}}</em>次</span>
        <span v-if="caseType == 0 && isOcr ==1">OCR识别失败数：<em>{{ocrFail}}</em>次</span>
        <span v-if="caseType == 0 && grabKeywords ==1">有效病例：<em>{{effectiveCount}}</em>份</span>
        <span v-if="caseType == 0 && grabKeywords ==1">无效病例：<em>{{unEffectiveCount}}</em>份</span>
        <span v-if="caseType == 0 && grabKeywords ==1">抓取病例关键字：<em>{{effectiveCount}}</em>份</span>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间范围:" class="timeLabel">
          <el-date-picker
            v-model="formInline.startDate"
            type="date"
            :picker-options="pickerOptions0"
            value-format="timestamp"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" class="timeLabel">
          <el-date-picker
            v-model="formInline.endDate"
            :picker-options="pickerOptions1"
            value-format="timestamp"
            type="date"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="表单名称:" style="width:100%" v-if="caseType == 0 || caseType == 3">
          <el-select v-model="formInline.formId" placeholder="请选择" @change="formIdChange">
            <el-option
              v-for="item in caseFormListArr"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表单阶段级别:" style="width:100%" v-if="caseType == 0 ">
          <el-select v-model="formInline.rankStates" placeholder="请选择" @change="rankChange" :disabled="formDisable">
            <el-option
              v-for="item in rankOptionsStates"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 多阶段关联表单 || 表单阶段级别 -->
        <el-form-item label="表单阶段级别:" style="width:100%" v-if="caseType == 3 ">
          <el-select v-model="caseShowAll" placeholder="请选择"  disabled>
          </el-select>
        </el-form-item>
        <!-- 多阶段关联表单 -->
        <el-form-item label="表单阶段:" style="width:100%" v-if="caseType == 0">
          <el-select v-model="formInline.formIdChild" placeholder="请选择" @change="childChange" :disabled="formDisable">
            <el-option
              v-for="item in caseFormListChildArr"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 多阶段关联表单 || 表单阶段 -->
        <el-form-item label="表单阶段:" style="width:100%" v-if="caseType == 3">
          <el-select v-model="caseShowAll" placeholder="请选择" disabled>
          </el-select>
        </el-form-item>
        <el-form-item label="数据范围:" style="width:100%" v-if="caseType == 3 && grabKeywords ==1">
          <el-select v-model="formInline.wholeStates" placeholder="请选择">
            <el-option
              v-for="item in wholeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 多阶段关联表单 -->
        <el-form-item label="数据范围:" style="width:100%" v-if="caseType == 0 && grabKeywords ==1">
          <el-select v-model="formInline.wholeStates" placeholder="请选择">
            <el-option
              v-for="item in wholeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    
    <p class="titls titlsMessage">导出说明：</p>
    <p class="titls titlsMessage">1. 100条以内数据处理时限为5分钟；500条以内数据处理时限为10分钟；500-1000条数据处理时限为20分钟；1000-3000条数据处理时限为40分钟；3000-5000条数据处理时限为60分钟；5000条及以上数据处理时限为120分钟；具体导出时长以实际数据为准</p>
    <p class="titls titlsMessage">2. 处理完毕，请“刷新”当前页面</p>
    <p class="titls titlsMessage">3. 您可以在申请记录列表中，下载申请文件；若未出现下载按钮，请继续等待</p>
    <p class="titls titlsMessage">4. 若导出时出现异常提示，请联系相关人员解决</p>    
    <div style="margin: 20px 20px 40px 20px"></div>
    <p class="titls titlsMessage">申请记录：</p>
    <table-list name="CaseExport" :data="tableData" @change="downLoad"/>
    <pagination :page-num="page.pageNumber" :total="tableListTotal" @change="paginationChange"/>
  </div>
</template>

<script>
import http from "@/utils/tenant2";
import api from "@/api/tenantInfoSave";
import TableList from "@/components/table-content/TableList";
import Pagination from "@/components/pagination/Pagination";
import { setTimeout } from 'timers';
import { mapGetters } from 'vuex'
import { nextTick } from 'q';

export default {
  name: "statisticalAnalysis",
  components: { TableList, Pagination },
  computed: {
    ...mapGetters(['companyid'])
  },
  props: {
    id: {
      type: String
    }
  },
  watch: {
    async id() {
      await this.getCaseFillCount();
      this.getExportList(); // 获取申请人员列表
      await this.caseFormList();
    }
  },
  data() {
    return {
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.formInline.endDate != "") {
            return time.getTime() > Date.now() || time.getTime() > this.formInline.endDate;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.formInline.startDate || time.getTime() > Date.now();
        }
      },
      isLoding: false,
      page: {
        pageSize: 10,
        pageNumber: 1
      },
      tableListTotal: 10,
      tableData: [],
      total: "",
      list: [],
      ocrTotal: null,
      ocrSuccess: null,
      ocrFail: null,
      caseType: null,
      isOcr: null,
      formId: null,
      grabKeywords: null,
      effectiveCount: null,
      unEffectiveCount: null,
      normalShow: false,
      mulShow: false,

      wholeOptions: [
        {
          value: "WHOLE",
          label: "全部数据"
        },
        {
          value: "EFFECTIVE",
          label: "有效病例"
        },
        {
          value: "UN_EFFECTIVE",
          label: "无效病例"
        },
        {
          value: "GRAB_KEYWORD",
          label: "抓取病例关键字数据"
        },
      ],
      disableType: '',
      rankOptionsStates: [],
      formInline: {
        rankStates: null,
        wholeStates: "WHOLE",
        demoName: null,
        startDate: '',
        endDate:'',

        nickname: null,
        hospital: null,
        phone: null,
        title: null,
        states: null,
        province: null,
        caseCollectId: this.$route.params.id,
        formId: 0,
        effective: null,
        formIdChild: null,
      },
      setDialog: false,
      formDisable: false,
      caseFormType: '',
      disableType: '',
      wholetype: '',
      multistageOcr: false,
      caseFormListArr: [],
      caseFormListArrNormal: [],
      caseFormListArrMultistage: [],
      caseFormListChildArr: [],
      multistageTitle: '',
      caseShowAll: '全部'
    };
  },
  async mounted() {
    await this.getCaseFillCount();
    this.getExportList(); // 获取申请人员列表
    await this.caseFormList();
  },
  methods: {
    getRank(val) {
        switch (val) {
          case 1:
            return '一级别'
          case 2:
            return '二级别'
          case 3:
            return '三级别'
          case 4:
            return '四级别'
          case 5:
            return '五级别'
        }
    },
    getOcr: async function(val) {
      let caseFormId = ''
      if (this.caseType == 0) {
        if(this.formInline.formIdChild != null ){
          caseFormId = this.formInline.formIdChild //选择子表单传子表单ID
        }else{
          caseFormId = this.formInline.formId //子表单选择全部传父表单ID
        }

        let params = {};
        params = {
          id: caseFormId,
          rank: this.formInline.rankStates
        };
       
        const res = await http.post(api.ocrCount,params);
        if (res.data.code === 0) {
          this.ocrTotal = res.data.data.totalCount
            ? res.data.data.totalCount
            : 0;
          this.ocrSuccess = res.data.data.ocrSuccessCount
            ? res.data.data.ocrSuccessCount
            : 0;
          this.ocrFail = res.data.data.ocrFailCount
            ? res.data.data.ocrFailCount
            : 0;
          this.effectiveCount = res.data.data.effectiveCount
            ? res.data.data.effectiveCount
            : 0;
          this.unEffectiveCount = res.data.data.unEffectiveCount
            ? res.data.data.unEffectiveCount
            : 0;
          
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    childChange(){
      this.getOcr()
    },
    rankChange(){
      this.caseFormChilds()
      this.getOcr()
    },
    formIdChange: async function(val){
      this.caseFormListArr.map(item=>{
        if( item.id == val ){
          this.disableType = item.type;
        }
      });
      if(this.disableType === 'multistage'){
        const res = await http.get(api.getCaseFormRanks + this.formInline.formId)
        if (res.data.code === 0) {
            this.rankOptionsStates = []
            res.data.data.map((item,index) => {
              let rankItem = this.getRank(item)
              this.rankOptionsStates.push(
                {
                  value: item,
                  label: `${rankItem}`
                }
              )
            })
            this.formInline.rankStates = this.rankOptionsStates[0].value
        } else {
            this.$message.error(res.data.message);
        }


        this.caseFormChilds()
        this.formDisable = false
      } else {
        this.getOcr()
        this.formDisable = true
        this.rankOptionsStates = []
        this.formInline.rankStates = null
        return false
      }
    },
    caseFormList: async function(b) {
      if (this.caseType == 0 || this.caseType == 3) {
        const res = await http.get(api.caseFormList + this.id);
        if (res.data.code === 0) {
          this.caseFormListArr = res.data.data;
          if(!b){
            this.formInline.formId = res.data.data[0].id;
          }
          if(!b){ //b不存在则是首次进来，存在则是在调用多阶段表单时
              if(res.data.data[0].type === 'multistage' ){
                this.formDisable = false
                this.formIdChange(this.formInline.formId);
              } else {
                this.formIdChange(this.formInline.formId);
                this.formInline.formIdChild = null
                this.formInline.rankStates = null
                this.formDisable = true
                this.getOcr()
              }
          } 
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    caseFormChilds: async function(){
        let params = {};
        params = {
          id: this.formInline.formId,
          rank: this.formInline.rankStates
        };
        const res = await http.post(api.caseFormChilds,params);
        if (res.data.code === 0) {
          this.caseFormListChildArr = res.data.data
          this.formInline.formIdChild = res.data.data[0].id
          this.getOcr()
        } else {
          this.$message.error(res.data.message);
        }
    },
    open(id,type,title){
      this.setDialog = true
      this.caseFormChilds(id)
      this.wholetype = type
      this.multistageTitle = title
    },
    
    
    paginationChange(value) {
      // 切换分页
      this.page = value;
      this.getExportList(); // 获取列表数据
    },
    downLoad(value) {
      // 表格回调
      if (value.DOWNLOAD) window.location.href = value.fileUrl;
    },
    getExportList() {
      // 申请导出人员列表
      let params = {
        ...this.page,
        params: {
          sourceId: this.$route.params.id
        }
      };
      this.$http
        .post(this.$api.case.exportList, params)
        .then(res => {
          let { code, data } = res.data;
          if (code === 0) {
            this.tableData = data.data;
            this.tableListTotal = data.total;
            this.tableData.map(item => {
              if (item.states === 1) {
                item.DOWNLOAD = true;
              } else {
                item.WAIT = true;
              }
            });
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // getExl(formId,type) {
    //   this.isLoding = true;
    //   this.audittjDown(formId,type);
    // },
    audittjDown() {
      // 申请导出数据
      this.isLoding = true;
      var parames = {
        caseCollectId: this.$route.params.id,
        formId: this.formInline.formId,
        type: this.formInline.wholeStates,
        start: this.formInline.startDate,
        end: this.formInline.endDate
      }
      if(this.disableType === 'multistage' && this.caseType !== 3){
        parames.formId = this.formInline.formIdChild
      }
      if(this.formInline.startDate > this.formInline.endDate) {
        this.$message.error('开始时间不能大于结束时间')
        return false
      }

      if (this.caseType == 0 ||this.caseType == 3 ) {
        //表单类型
        this.$http
          .post(this.$api.case.export, parames)
          .then(res => {
            // console.log(res, "xiazai ");
            let { code, data } = res.data;
            this.isLoding = false;
            if (code === 0) {
              this.$message.success("申请成功");
              this.getExportList(); // 更新申请列表
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        // 附件类型
        parames.formId = 0
        parames.type = "WHOLE"
        this.$http
          .post(this.$api.case.export, parames)
          .then(res => {
            // console.log(res, "xiazai ");
            let { code, data } = res.data;
            this.isLoding = false;
            if (code === 0) {
              this.$message.success("申请成功");
              this.getExportList(); // 更新申请列表
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    audittjDown2() {
      // 申请导出数据
      this.isLoding = true;
      var parames = {
        caseCollectId: this.$route.params.id,
        type: "ZIP",
        start: this.formInline.startDate,
        end: this.formInline.endDate
      }
      if(this.formInline.startDate > this.formInline.endDate) {
        this.$message.error('开始时间不能大于结束时间')
        return false
      }
      if (this.caseType == 0) {
        //表单类型
        this.$http
          .post(this.$api.case.export, parames)
          .then(res => {
            let { code, data } = res.data;
            this.isLoding = false;
            if (code === 0) {
              this.$message.success("申请成功");
              this.getExportList(); // 更新申请列表
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    async getCaseFillCount() {
      await http.get(api.caseFillCount + this.$route.params.id).then(res => {
        // this.total = res.data.data
        this.total = res.data.data.totalCount;
        this.caseType = res.data.data.caseType;
        this.isOcr = res.data.data.isOcr;
        this.grabKeywords = res.data.data.grabKeywords;
      });
    },
    tabRes() {}
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.titlsMessage {
  color: #999999;
  font-size: 14px;
}

.message {
  position: relative;
  width: 100%;
  line-height: 40px; 
}
.down-btn{
  position: absolute;
  right: 0;
  top: 0;
}
.down-btn2{
  position: absolute;
  right: 110px;
  top: 0;
}
.message span,
.message p {
  color: $c-theme;
}

.box {
  display: flex;
  align-items: center;
}
.margin-left {
  margin-left: 80px
}
.wrap .demo-form-inline >>> .el-form-item__content {
  line-height: 0;
}
.wrap .demo-form-inline .el-form-item {
  clear: both;
}
.analysis .wrap .demo-form-inline >>> .el-form-item {
  margin-bottom: 0;
}
/*.analysis .wrap {*/
/*  margin-top: 20px;*/
/*  margin-left: 20px;*/
/*  position: relative;*/
/*}*/
.analysis .wrap .titls {
  margin-right: 20px;
}

.analysis .wrap:nth-of-type(2) .titls {
  width: 240px;
}

.tabs {
  border: 1px solid #ccc;
  border-bottom: none;
}

ul,
li {
  list-style: none;
}

.tabs ul li {
  float: left;
  height: 40px;
  line-height: 40px;
}

.tabs ul {
  height: 40px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}

.hang {
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #ccc;
}

.lie {
  flex: 1;
  padding: 0 10px;
  border-right: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.tabs ul li {
  list-style: none;
  flex: 1;
}

.tabs ul:nth-child(1) {
  border-bottom: 1px solid #ccc;
  background: #eef1f6;
}

.tabs ul li {
  margin: 0;
  height: 40px;
  text-align: left;
  border-right: 1px solid #ccc;
  padding: 0 10px;
  font-size: 14px;
}

.download-link {
  display: inline-block;
  width: 80px;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  font-size: 12px;
  color: #ffffff;
  background: #20a0ff;
  border-radius: 4px;
  overflow: hidden;
}
.form-list-ul {
  list-style: none;
}
.form-list-ul li span {
  margin-right: 10px;
  font-size: 14px;
}
.ocr {
  display: inline-block;
  line-height: 1;
  /* transform: translateY(-12px); */
  margin-left: 10px;
  color: $c-theme;
  font-size: 14px;
}
.ocr em {
  font-style: normal;
  font-size: 14px;
}
.multistageOcr-statis-wrap{
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-bottom: 30px;
}
.multistageOcr-statis{
  font-size: 16px !important;
  color: $c-theme;
  font-weight: bold;
}
.form-wrap{
  border: 1px solid #ccc;
  border-top: none; 
  padding: 10px;
  box-sizing: border-box;
}
.form-tit{
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  font-weight: bold;
}
.border-bot-none{
  border-bottom: none;
}
::v-deep .el-form--inline .el-form-item__label {
  display: block;
  text-align: left;
}
::v-deep .el-select {
  width: 375px
}
.statistical{
  margin-bottom: 10px;
  span{
    color: #606266;
    margin-right: 10px;
  }
  em{
    font-style:normal
  }
}
</style>
<style>
.timeLabel .el-form-item__label{
  display: inline-block !important;
}
</style>
