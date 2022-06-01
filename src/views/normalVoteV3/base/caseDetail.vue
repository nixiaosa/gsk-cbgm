<template>
    <div class="caseDetail">
      <div class="wrap">
        <span class="titles">活动标题:</span>
        <span>{{ tableData.title }}</span>
      </div>
      <div class="wrap">
        <span class="titles">活动时间:</span>
        <span>{{ tableData.startTime | formatDate }} </span>
        <span v-if="tableData.endTime !== null">-{{ tableData.endTime | formatDate }}</span>
        <span v-if="tableData.endTime == null"></span>
      </div>
      <div class="wrap p-img" v-if="tableData.backgroundImages">
        <span class="titles">活动封面:</span>
        <div>
          <p class="p-img-box">
            <img :src="tableData.backgroundImages[0]" alt="">
          </p>
        </div>
      </div>
      <div class="wrap" v-if="tableData.actType">
        <span class="titles">活动类型:</span>
        <span v-if="tableData.actType === 1">投票形式</span>
        <span v-if="tableData.actType === 2">评分形式</span>
      </div>
      <div class="wrap">
        <span class="titles">显示方式:</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 1">票数从高到低</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 2">票数从低到高</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 3">编号从大到小</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 4">编号从小到大</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 5">参与时间正序</span>
        <span v-if="tableData.actType === 1 && tableData2.sortType === 6">参与时间倒序</span>

        <span v-if="tableData.actType === 2 && tableData2.sortType === 1">票数从高到低</span>
        <span v-if="tableData.actType === 2 && tableData2.sortType === 2">票数从低到高</span>
        <span v-if="tableData.actType === 2 && tableData2.sortType === 3">编号从大到小</span>
        <span v-if="tableData.actType === 2 && tableData2.sortType === 4">编号从小到大</span>
        <span v-if="tableData.actType === 2 && tableData2.sortType === 5">参与时间正序</span>
        <span v-if="tableData.actType === 2 && tableData2.sortType === 6">参与时间倒序</span>
      </div>
      <!-- <div class="wrap">
        <span class="titles">投票方式:</span>
        <span style="margin-right:30px">{{ voteMode | voteStyle }}</span>
        <span v-if="voteMode == 0">每位用户可投票总数<strong>{{ fixedVoteNum }}</strong>票</span>
        <span v-if="voteMode == 1">每位用户每天可投票数<strong>{{ periodVoteNum }}</strong>票</span>
      </div> -->
      <div class="wrap" v-if="tableData.voteLimitModeVote">
        <span class="titles">投票周期:</span>
        <span v-if="tableData.voteLimitModeVote.votePeriod === 1">每天可投</span>
        <span v-if="tableData.voteLimitModeVote.votePeriod === 2">每场可投</span>
      </div>
      <div class="wrap" v-if="tableData.voteLimitModeVote">
        <span class="titles">票数限定:</span>
        <span v-if="tableData.voteLimitModeVote.everyoneVoteNums">每个用户可以投<strong style="margin: 0 5px">{{ tableData.voteLimitModeVote.everyoneVoteNums}}</strong>票</span>
        <span v-if="tableData.voteLimitModeVote.optionVoteNums">，可以为同一个选项投<strong style="margin: 0 5px">{{ tableData.voteLimitModeVote.optionVoteNums}}</strong>票</span>
      </div>
      <div class="wrap" v-if="tableData.voteLimitModeVote">
        <span class="titles">选项限定:</span>
        <span v-if="tableData.voteLimitModeVote.lessOptionSelect">最少投<strong style="margin: 0 5px">{{ tableData.voteLimitModeVote.lessOptionSelect}}</strong>个选项</span>
        <span v-if="tableData.voteLimitModeVote.mostOptionSelect">可以为同一个选项投<strong style="margin: 0 5px">{{ tableData.voteLimitModeVote.mostOptionSelect}}</strong>个选项</span>
        <span v-if="tableData.voteLimitModeVote.mustOptionSelect">可以为同一个选项投<strong style="margin: 0 5px">{{ tableData.voteLimitModeVote.mustOptionSelect}}</strong>个选项</span>
      </div>
      <div class="wrap" v-if="tableData.voteLimitModeScore">
        <span class="titles">选项限定:</span>
        <span v-if="tableData.voteLimitModeScore.lessOptionMark">最少评<strong style="margin: 0 5px">{{ tableData.voteLimitModeScore.lessOptionMark}}</strong>个选项</span>
        <span v-if="tableData.voteLimitModeScore.mostOptionMark">可以为同一个选项评<strong style="margin: 0 5px">{{ tableData.voteLimitModeScore.mostOptionMark}}</strong>个选项</span>
        <span v-if="tableData.voteLimitModeScore.mustOptionMark">可以为同一个选项评<strong style="margin: 0 5px">{{ tableData.voteLimitModeScore.mustOptionMark}}</strong>个选项</span>
      </div>
      <div class="wrap">
        <span class="titles">参与条件:</span>
        <span>{{ tableData.joinType | publicStatus }}</span>
        <span class="p-info">登录成功需提交申请信息后参与</span>
      </div>
      <div class="wrap" v-if="tableData.joinType === 1">
        <span class="titles">自动审核:</span>
        <span>{{ tableData.isAutoCheck | auditStatus}}</span>
        <span class="p-info">观众申请，系统不发送短信通知，需登录进入“个人中心--->申请管理”栏目查看</span>
      </div>
      <div class="wrap">
        <span class="titles">访问量:</span>
        <span>{{ tableData2.visitsVisibileSwitch | visitsStatus }}</span>
        <span class="p-info">投票活动页显示“访问人数”“参与人数”“累计票数&评分总和”</span>
      </div>
      <div class="wrap p-rule">
        <span class="titles">活动规则:</span>
        <!-- <p class="p-block">
          <span v-html="description"></span>
        </p> -->
        <div class="des-block" v-html="tableData.introduce"></div>
      </div>
      <!--预览图片-->
      <el-dialog
        :lock-scroll="false"
        :show-close="false"
        :visible.sync="dialogVisible"
        width="50%">
        <div style="text-align: center">
          <img style="max-width: 100%" :src="imgUrl" alt="">
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import pdf from '@/views/base/check-pdf.vue'
  export default {
    name: "caseDetail",
    props:{
      id: {
        type: String
      }
    },
    watch: {
      id() {
        this.caseActivityDetail()
      }
    },
    filters:{
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
      isTrue(item) {
        switch(item){
          case 0:
            return '否'
          case 1:
            return '是'
          default:
            return '未设置'
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
        tableData2: {}
      }
    },
    async mounted() {
      await this.caseActivityDetail()
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
      caseActivityDetail: async function() {
        const res = await http.get(api.voteBasicInfoDetail + this.id);
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
      },
      See(id) {
        // this.$router.push({
        //   path: '/activity/caseprview/' + this.id
        // })

        let routes = this.$router.resolve({
          path: '/activity/caseprview/' + this.id
        });
        window.open(routes.href, "_blank");

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.caseDetail .wrap {
  margin-left: 20px;
  margin-top: 20px;
}
.caseDetail .wrap .titles {
  display: inline-block;
  width: 130px;
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
  background: #cccccc;
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
