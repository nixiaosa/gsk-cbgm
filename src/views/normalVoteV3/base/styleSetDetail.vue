<template>
    <div class="caseDetail">
      <!-- <div class="row-tit">配色与风格</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">主题颜色:</span>
          <el-color-picker v-model="tableData.themeColorRgb" disabled></el-color-picker>
        </div>
      </div> -->
      <div class="row-tit">页面漂浮物</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">漂浮物:</span>
          <img v-if="tableData.floatDecorateNo" class="floatDecorate" :src="tableData.floatDecorateNo" alt="">
          <span v-if="!tableData.floatDecorateNo">无</span>
        </div>
      </div>
      <div class="row-tit">页面背景</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">背景图:</span>
          <img v-if="tableData.themeBackImg" class="themeBackImg" :src="tableData.themeBackImg" alt="">
          <span v-if="!tableData.themeBackImg">无</span>
        </div>
      </div>
      <div class="row-tit">背景音乐</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">背景音乐:</span>
          <span>{{ backMusicNo ? backMusicNo : '无' }}</span>
        </div>
      </div>
      <div class="row-tit">排行榜显示</div>
      <div class="wrap">
        <div class="row">
          <span class="titles">排行榜:</span>
          <span>{{ tableData.rankVisibileSwitch | rankVisibileSwitch }}</span>
        </div>
      </div>
    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import pdf from '@/views/base/check-pdf.vue'
  import musicJson from '@/views/normalVoteV3/RaffleData.json'
  export default {
    name: "styleSetDetail",
    props:{
      id: {
        type: String
      }
    },
    watch: {
      id() {
        this.voteStyleQuery()
      }
    },
    filters:{
      rankVisibileSwitch(item){
         switch(item){
          case 0:
            return '不显示'
          case 1:
            return '显示'
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
        backMusicList: musicJson.backMusicList,
        backMusicNo: ''
      }
    },
    async mounted() {
      await this.voteStyleQuery()
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
      voteStyleQuery: async function() {
        const res = await http.get(api.voteStyleQuery + this.id);
        if (res.data.code === 0) {
         this.tableData = res.data.data

         this.backMusicList.map(item => {
           if(this.tableData.backMusicNo === item.src){
             this.backMusicNo = item.title
           }
         })
         } else {
           this.$message.error(res.data.message)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
// ::v-deep .el-color-picker__mask {
//     display: none;
// }
// ::v-deep .el-color-picker__icon{
//     display: none !important;
// }
::v-deep .el-color-picker{
    transform: translateY(10px)
}
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
.floatDecorate{
  border: 1px solid #ccc;
  display: inline-block;
  width: 70px;
  border-radius: 10px;
  transform: translateY(10px);
}
.themeBackImg{
  width: 140px;
}
</style>
