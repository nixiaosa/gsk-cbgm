<template>
    <div class="caseDetail">
      <div class="wrap">
        <span class="titles">试卷名称:</span>
        <span>{{ answerData.examPaperName}}</span>
      </div>

      <div class="wrap">
        <span class="titles">试卷状态:</span>
        <span>{{ answerData.status | getState }}</span>
      </div>

      <div class="wrap">
        <span class="titles">试卷总分:</span>
        <span>{{ answerData.totalScore}}分</span>
      </div>

      <div class="wrap">
        <span class="titles">答题时间:</span>
        <span>{{ answerData.startTime | formatDate }} —— {{ answerData.endTime | formatDate }}</span>
      </div>
      <div class="wrap">
        <span class="titles">答题时限:</span>
        <span>{{ answerData.limitTime }}分钟</span>
      </div>
      <div class="wrap">
        <span class="titles">限答次数:</span>
        <span>{{ answerData.useTime }}次</span>
      </div>

      <!-- <div class="wrap">
        <span class="titles">完善信息:</span>
        <span>{{ answerData.improvingStatus | improvingStatus }}</span>
      </div> -->

      <div class="wrap">
        <span class="titles">已答题人数:</span>
        <span>{{ answerData.finishExamPaperNum }}</span>
      </div>

      <div class="wrap">
        <span class="titles">创建人:</span>
        <span>{{ answerData.createBy }}</span>
      </div>
      <div class="wrap">
        <span class="titles">活动简介:</span>
        <div class="area intro-content ql-editor"  v-html="answerData.description"></div>
      </div>
    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  export default {
    name: "caseDetail",
    props:{
      id: {
        type: String
      }
    },
    filters:{
      improvingStatus(val) {
        switch (val) {
          case 0:
            return '否'
          case 1:
            return '是'
        }
      },
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      getState(state) {
        switch (state) {
          case 0:
            return '未发布'
          case 1:
            return "未开始"
          case 2:
            return '进行中'
          case 3:
            return '已结束'
          case 4:
            return '已失效'
        }
      }
    },
    data() {
      return {
        total: '',
        answerData: ''
      }
    },
    mounted() {
      this.caseActivityDetail()
    },
    methods: {
      caseActivityDetail: async function() {
        const res = await http.post(api.findExamPaper + this.id)
        if (res.data.code === 0) {
          this.answerData = res.data.data
          this.total = res.data.data.total
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
  padding-top: 30px;
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
</style>
