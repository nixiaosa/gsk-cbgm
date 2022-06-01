<template>
    <div class="caseDetail">
      <div class="row-tit">内部投票/评分:</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">内部投票/评分:</span>
          <span>{{ tableData.innerVoteType | innerVoteType }}</span>
        </div>
        <div class="row" v-if="tableData.innerVoteType !== 1">
          <span class="titles">验证时机:</span>
          <span>{{ tableData.verifyStage | verifyStage }}</span>
        </div>
      </div>
      <!-- <div class="row-tit">暂停投票/评分:</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">暂停投票/评分:</span>
          <span>{{ tableData.pauseSwitch | pauseSwitch }}</span>
          <span class="p-info">(活动正常进行)</span>
        </div>
      </div> -->
      <div class="row-tit">投票/评分结果:</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">投票/评分结果:</span>
          <span>{{ tableData.voteResultVisableSwitch | voteResultVisableSwitch }}</span>
          <span class="p-info">(整个投票过程中显示票数/评分)</span>
        </div>
      </div>
      <div class="row-tit" v-if="actType ===1">防刷票设置:</div>
      <div class="wrap" v-if="tableData.voteAntiBrushSetting && actType ===1">
        <div class="row">
          <span class="titles">选项限制:</span>
          <span>每小时最多可以获得票数：<strong>{{ tableData.voteAntiBrushSetting.everyHourMaxVotes ? tableData.voteAntiBrushSetting.everyHourMaxVotes : '不限制'}}</strong></span>
          <span style="margin-left:20px">每天最多可以获得票数：<strong>{{ tableData.voteAntiBrushSetting.everyDayMaxVotes ? tableData.voteAntiBrushSetting.everyDayMaxVotes : '不限制'}}</strong></span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">每天投票时间段限制:</span>
          <span>{{ tableData.voteAntiBrushSetting.timeIntervalSwitch| timeIntervalSwitch }}</span>
        </div>
        <!-- <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">验证码:</span>
          <span>{{ tableData.voteAntiBrushSetting.verifyCodeSwitch| verifyCodeSwitch }}</span>
        </div> -->
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">黑名单:</span>
          <span>{{ tableData.voteAntiBrushSetting.blackListSwitch| verifyCodeSwitch }}</span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">禁止投票地区:</span>
          <span>{{ tableData.voteAntiBrushSetting.forbidZones }}</span>
          <span class="p-info-red" v-if="tableData.voteAntiBrushSetting.forbidZones">地区限制原理是根据IP地址获取，部分运营商网络可能导致地区获取不准确，请谨慎使用。</span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">封禁IP:</span>
          <span>{{ tableData.voteAntiBrushSetting.forbidIps }}</span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">白名单:</span>
          <span>{{ tableData.voteAntiBrushSetting.blankListSwitch| verifyCodeSwitch }}</span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">允许投票地区:</span>
          <span>{{ tableData.voteAntiBrushSetting.allowZones }}</span>
          <span class="p-info-red" v-if="tableData.voteAntiBrushSetting.allowZones">地区限制原理是根据IP地址获取，部分运营商网络可能导致地区获取不准确，请谨慎使用。</span>
        </div>
        <div class="row" v-if="tableData.voteAntiBrushSetting">
          <span class="titles">允许IP:</span>
          <span>{{ tableData.voteAntiBrushSetting.allowIps }}</span>
        </div>
      </div>


    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import pdf from '@/views/base/check-pdf.vue'
  export default {
    name: "voteSetDetail",
    props:{
      id: {
        type: String
      }
    },
    watch: {
      id() {
        this.voteManageQuerySet()
      }
    },
    filters:{
      blackListSwitch(item){
         switch(item){
          case 0:
            return '关闭'
          case 1:
            return '开启'
        }
      },
      verifyCodeSwitch(item){
        switch(item){
          case 0:
            return '关闭'
          case 1:
            return '开启'
        }
      },
      timeIntervalSwitch(item){
        switch(item){
          case 0:
            return '关闭'
          case 1:
            return '开启'
        }
      },
      voteResultVisableSwitch(item){
        switch(item){
          case 1:
            return '显示'
          case 2:
            return '隐藏'
        }
      },
      pauseSwitch(item){
        switch(item){
          case 0:
            return '关闭'
          case 1:
            return '开启'
        }
      },
      verifyStage(item){
        switch(item){
          case 1:
            return '第一次进入活动页时'
          case 2:
            return '第一次投票时'
        }
      },
      innerVoteType(item) {
        switch(item){
          case 1:
            return '任何人可查看和投票'
          case 2:
            return '凭密码查看和投票'
          case 3:
            return '凭邀请码查看和投票'
          case 4:
            return '凭验证码查看和投票'
        }
      },
      visitsStatus(item) {
        switch(item){
          case 0:
            return '不显示'
          case 1:
            return '显示'
        }
      },
      auditStatus(item) {
        switch(item){
          case 0:
            return '否'
          case 1:
            return '是'
        }
      },
      publicStatus(item) {
        switch(item){
          case 0:
            return '公开'
          case 1:
            return '申请'
        }
      },
      voteRule(item) {
        switch(item){
          case 0:
            return '每天只能对每个投票项投一票'
          case 1:
            return '每天可对同一个投票项投多票'
        }
      },
      voteStyle(item) {
        switch(item){
          case 0:
            return '固定次数'
          case 1:
            return '周期次数'
        }
      },
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    data() {
      return {
        pdfUrl: '',
        imgUrl: '',
        dialogVisible: false,
        startTime: '',
        endTime: '',
        states: '',
        whetherShowCount: '', // 是否显示病例数 0否 1是
        isAutoAudit: 3, // 是否自动审核 0 否 1 是
        introduce: '',
        total: '',
        surplus: '',
        formName: '',
        type: '',
        attachs: [],

        coverUrlPc: '',
        coverUrlMobile: '',
        voteRule: '',
        description:'',
        voteMode:'',
        fixedVoteNum:'',
        periodVoteNum:'',
        publicStatus:'',
        auditStatus:'',
        visitsStatus:'',
        voteName: '',

        tableData: {},
        tableData2: {},
        actType: this.$route.query.actType
      }
    },
    async mounted() {
      await this.voteManageQuerySet()
      this.voteStyleQuery()
      // this.seeCaseForm()
    },
    components: {
      pdf
    },
    methods: {
      goPFill(url) {
        let urlList = url.split('.')
        let length = urlList.length
        let fileName = urlList[length - 1]
        let office = 'doc,xls,ppt,docx,xlsx,pptx'
        if (office.indexOf(fileName) >= 0) {
          window.open('https://view.officeapps.live.com/op/view.aspx?src=' + url)
        } else if (fileName.indexOf('pdf') >= 0) {
          this.pdfUrl = url
          this.$router.push({
            path: '/activity/checkPdf',
            query: { url: url }
          })
        } else {
          this.dialogVisible = true
          this.imgUrl = url
        }
      },
      voteManageQuerySet: async function() {
        const res = await http.get(api.voteManageQuerySet + this.id);
        if (res.data.code === 0) {
           this.tableData = res.data.data
         } else {
           this.$message.error(res.data.message)
        }
      },
      voteStyleQuery: async function() {
        const res = await http.get(api.voteStyleQuery + this.id);
        if (res.data.code === 0) {
         this.tableData2 = res.data.data
         } else {
           this.$message.error(res.data.message)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.caseDetail .wrap {
  border: 1px solid #ccc;
  padding: 0 10px 20px 10px;
  margin-bottom: 20px;
}
.row{
  margin-top: 20px;
}
.row-tit{
  font-weight: bold;
  margin-bottom: 10px;
}
.caseDetail .wrap .titles {
  display: inline-block;
  width: 150px;
  margin-right: 20px;
}
.caseDetail .area {
  width: 800px;
  min-height: 150px;
  max-height: auto;
  padding-top: 30px;
}
.wrap img{
  max-width: 300px;
  margin-right: 30px
}
.formName{
  display: inline-block;
  width: 400px;
  height: 40px;
  background: #cccccc;
  line-height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  overflow: hidden;
  margin-bottom: -14px;
}
.formNames{
  height: auto;
  position: relative;
}
.userBoxRightList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 20px;
}
.userBoxRightList li:nth-last-child(1) {
  border-bottom: none
}
.userBoxRightList li {
  color: #333333;
  font-size: 16px;
  height: 62px;
  width: 100%;
  line-height: 62px;
  border-bottom: 1px solid #ECECEC;
}
.form-rt{
  width: 400px;
  height: 40px;
  margin: 20px 0;
  background: #666666;
  line-height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  overflow: hidden;
  margin-bottom: -14px;
}
.btns{
  position: absolute;
  left: 430px;
  top: 5px;
}
.listBtn {
  cursor: pointer;
  margin-top: 20px;
  text-align: center;
  /*float: right;*/
  margin-left: 20px;
  display: inline-block;
  width: 78px;
  height: 22px;
  line-height: 22px;
  color: #ffffff;
  font-size: 12px;
  background: $c-theme;
}
.p-info{
  font-size: 12px;
  color: #666666;
  margin-left: 10px;
}
.p-info-red{
  font-size: 12px;
  color: #f00;
  margin-left: 10px;
}
.p-rule,.p-img{
  position: relative;
}
.p-rule .titles{
  position: absolute;
  left: 0;
  top:0;
}
.p-img .titles{
  position: absolute;
  left: 0;
  top:0;
}
.des-block{
  display: block;
  width: 1000px;
  margin-left: 150px;
  line-height: 1.5;
}
.p-block{
  display: inline-block;
  width: 1000px;
  margin-left: 150px;
  line-height: 1.5;
  transform: translateY(-20px)
}
.p-img-box{
  display: inline-block;
  margin-left: 150px;
  line-height: 1.5;
  transform: translateY(-20px)
}
.p-img-box strong{
  display: block;
  text-align: center
}
</style>
