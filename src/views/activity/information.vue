<template>
    <div class="active-info">
        <div class="info-block">
            <span class="info-self">创建时间：</span>
            <span class="info-content">{{createTime|formatDate}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">创建者：</span>
            <span class="info-content">{{creatorName}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">活动类型：</span>
            <span class="info-content">活动投票</span>
        </div>
        <div class="info-block">
            <span class="info-self">活动名称：</span>
            <span class="info-content">{{title}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">活动状态：</span>
            <span class="info-content">{{state|getState}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">开始时间：</span>
            <span class="info-content">{{beginTime|formatDate}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">结束时间：</span>
            <span class="info-content">{{endTime|formatDate}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">参与人数：</span>
            <span class="info-content" v-if="!personCount">0</span>
            <span class="info-content" v-if="personCount">{{personCount}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">投票系数：</span>
            <span class="info-content">{{specialistScoreMax}}</span>
        </div>
        <div class="info-block">
            <span class="info-self">最低得分：</span>
            <span class="info-content">{{voteScoreMin}}</span>
        </div>
        <div class="info-block2">
            <div class="info-self">活动背景图：</div>
            <div class="info-content">
                <img class="active-img" :src="coverMap" alt="">
                <el-button type="primary" style="height:36px;margin-left:30px;margin-top:90px;" @click="downImg()">另存为...</el-button>
            </div>
        </div>
        <div class="info-block3">
            <div class="info-self">活动介绍：</div>
            <div class="infos  intro-content ql-editor infos-editor"  v-html="discription"></div>
        </div>
        <div class="info-block">
            <span class="info-self">排行榜URL：</span>
            <span class="info-content">{{id|idToUrl}}</span>
        </div>
        <div class="info-block" style="margin-top:10px;" v-if="isDeleted===0">
            <el-button type="danger" style="width:100px;" @click="deteleActive()">删 除</el-button>
        </div>
    </div>
</template>

<script>
    import http from '@/utils/tenant'
    import api from '@/api/tenantInfoSave'
    import { formatDate } from '@/common/data'
    export default {
//    props: {
//      dialogVisible: {
//        type: Boolean,
//        default: false
//      }
//    },
      data() {
        return {
          id: this.$route.params.id,
          beginTime: 0,
          coverMap: '',
          createTime: 0,
          creatorName: '',
          discription: '',
          endTime: 0,
          isDeleted: 0,
          isStop: 0,
          personCount: 0,
          phone: '',
          specialistScoreMax: 0,
          state: 0,
          title: '',
          voteScoreMin: 0
        }
      },
      filters: {
        formatDate(time) {
          var date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm')
        },
        getState(num) {
          if (num === 0) {
            return '未开始'
          } else if (num === 1) {
            return '进行中'
          } else if (num === 2) {
            return '已结束'
          }
        },
        idToUrl(id) {
          return 'http://' + window.location.host + '/#/activityRank/' + id
        }
      },
      created: function() {
      },
      mounted() {
        this.activeDetail()
      },
      methods: {
        activeDetail: async function() {
          var res = await http.get(api.activeDetail + this.$route.params.id, {})
          if (res.data.code !== 0) {
            this.$message.error(res.data.message)
          } else {
            var data = res.data.data
            this.beginTime = data.beginTime
            this.coverMap = data.coverMap
            this.createTime = data.createTime
            this.creatorName = data.creatorName
            this.discription = data.discription
            this.endTime = data.endTime
            this.isDeleted = data.isDeleted
            this.isStop = data.isStop
            this.personCount = data.personCount
            this.phone = data.phone
            this.specialistScoreMax = data.specialistScoreMax
            this.state = data.state
            this.title = data.title
            this.voteScoreMin = data.voteScoreMin
          }
        },
        deteleActive: async function() {
          var res = await http.get(api.deteleActive + this.$route.params.id, {})
          if (res.data.code !== 0) {
            this.$message.error(res.data.message)
          } else {
            this.$message.success('创建成功')
            this.$router.back(-1)
          }
        },
        downImg() {
          window.open(this.coverMap)
        }
      }
//    components: {
//      SurveyDialog, Comment, ...
//    }
    }
</script>
<style>
.infos-editor img{
  max-width: 100%;
}
</style>

<style scoped>
.active-info {
  padding: 20px 30px;
  border:1px solid #eee;
}
.info-block .info-self{
  display:inline-block;
  width:100px;
  padding-top:15px;
  padding-bottom:15px;
  text-align: right;
  margin-right: 30px;
}
.info-block .info-content{
  display:inline-block;
  padding-top:15px;
  padding-bottom:15px;
  text-align: left;
}
.info-block2{
  height:220px;
  display: flex;
  margin-bottom:20px;
}
.info-block3{
  position: relative;
  display: flex;
  margin-bottom:20px;
  max-height: auto;
  min-height: 200px;
}
.info-block2 .info-self{
  width:100px;
  padding-top:15px;
  padding-bottom:15px;
  text-align: right;
  margin-right: 30px;
}
.info-block2 .info-content{
  display: flex;
  flex: 1;
  padding-top:10px;
  padding-bottom:15px;
  text-align: left;
  line-height: 30px;
}
 .infos{
  width: 800px;
  max-height: auto;
  min-height: 200px;
  border:1px solid #e5e5e5;
  padding:5px;
  padding-top:20px;
  font-size: 14px;
}
.info-block2 .info-content .active-img{
    width:300px;
    height:220px;
}
</style>
