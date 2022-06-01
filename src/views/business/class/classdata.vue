<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div>
      <el-tabs type="border-card" v-model="topActiveName">
        <el-tab-pane v-if="businessId === '5' && Number(this.$route.query.signUpswitch) !==0" label="报名统计" name="signUp">
          <div v-if="topActiveName === 'signUp'">
            <sign-up/>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="businessId === '5' && Number(this.$route.query.signInswitch) !==0" label="签到统计" name="signIn">
          <div v-if="topActiveName === 'signIn'">
            <sign-in/>
          </div>
        </el-tab-pane>

        <!-- 开通“观看流水/会议报表”开关且是视频详情2.0 -->
        <el-tab-pane label="观看统计" name="new" v-if="$route.query.isOld ==='0' && videoStatistic">
          <div v-if="topActiveName === 'new'">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="直播用户" name="1" v-if="type===1 || type===3">
                <LiveListV3 version="2" listType="1" ref="live1"></LiveListV3>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="2" v-if="type===2">
                <LiveListV3 version="2" listType="2" ref="video1"></LiveListV3>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="3" v-if="type===1 || type===3">
                <LiveListV3 version="2" listType="3" ref="watchl"></LiveListV3>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <!-- 未开通“观看流水/会议报表”开关 -->
        <el-tab-pane label="观看统计" name="new" v-else>
          <div v-if="topActiveName === 'new'">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="直播用户" name="1" v-if="type===1 || type===3">
                <LiveList version="2" ref="live1"></LiveList>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="2" v-if="type===2">
                <VideoList version="2" ref="video1"></VideoList>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="3" v-if="type===1 || type===3">
                <WatchList version="2" ref="watchl"></WatchList>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <el-tab-pane label="观看流水" name="watchStream" v-if="$route.query.isOld ==='0' && videoStatistic">
          <div v-if="topActiveName === 'watchStream'">
            <WatchStreamList v-if="type===1 || type===3" version="2" listType="1" ref="live1"></WatchStreamList>
            <WatchStreamList v-if="type===2" version="2" listType="2" ref="video1"></WatchStreamList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会议报表" name="reportForm" v-if="$route.query.isOld ==='0' && videoStatistic">
          <watch-report-form v-if="topActiveName === 'reportForm'"/>
        </el-tab-pane>
        <!-- <el-tab-pane label="观看统计（旧）" name="former">
          <div v-if="topActiveName === 'former'">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="直播用户" name="1" v-if="type===1 || type===3">
                <LiveList version="1" ref="live1"></LiveList>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="2" v-if="type===2">
                <VideoList version="1" ref="video1"></VideoList>
              </el-tab-pane>
              <el-tab-pane label="视频用户" name="3" v-if="type===1 || type===3">
                <WatchList version="1" ref="watchl"></WatchList>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import VideoList from './base/video'
import LiveList from './base/live'
import WatchList from './base/watch'
import LiveListV3 from './base/liveV3'
import WatchStreamList from './base/watchStreamList'
import HeaderContent from '@/components/header-content'
import SignUp from "@/views/business/class/dataStatistics/SignUp";
import SignIn from "@/views/business/class/dataStatistics/SignIn";
import WatchReportForm from "@/views/business/class/statistics/watchReportForm";
import {mapGetters} from "vuex";
export default {
  components: {WatchReportForm, SignIn, SignUp, VideoList, LiveList, WatchList,HeaderContent, LiveListV3, WatchStreamList},
  data() {
    return {
      businessId: this.$route.query.service,
      topActiveName: this.$route.query.service !== '5' ? 'new' : 'signUp',
      type: Number(this.$route.query.type),
      activeName: this.$route.query.type,
      opertions: ['返回'],
      headerTitle: '观看统计',
      page: this.$route.params.page
    }
  },
  created() {
    if(Number(this.$route.query.signUpswitch) !==0){
      this.topActiveName = 'signUp'
    }else if(Number(this.$route.query.signInswitch) !==0){
      this.topActiveName = 'signIn'
    }else{
      this.topActiveName = 'new'
    }
    // if (this.type === 3) {
      // this.activeName = '1'
    // }
  },
  computed: {
    ...mapGetters([
      "videoStatistic"
    ])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    tomin(value) {
      var theTime = parseInt(value)// 秒
      var theTime1 = 0// 分
      var theTime2 = 0// 小时
// alert(theTime);
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
// alert(theTime1+"-"+theTime);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      var result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result
    },
    sex(str) {
      if (str === 'man') {
        return '男'
      }
      if (str === 'woman') {
        return '女'
      }
    }
  },
  mounted() {
  },
  watch: {
    type() {
      if (this.type === 1) {
        this.activeName = '1'
      } else if (this.type === 2){
        this.activeName = '2'
      } else if (this.type === 3) {
        this.activeName = '3'
      }
    }
  },
  methods: {
    initialPage() {
      if (this.type === 2) {
        this.activeName = '2'
        this.$refs.video1.initialPage()
      } else if (this.type === 1) {
        this.activeName = '1'
        this.$refs.live1.initialPage()
        this.$refs.watch1.initialPage()
      }
    },
    headerClick() {
      let url = ''
      if (this.$route.query.service === '1') {
        url = '/train/manage'
      } else if (this.$route.query.service === '2') {
        url = '/classroom/manage'
      } else if (this.$route.query.service === '3') {
        url = '/interact/manage'
      } else if (this.$route.query.service === '4') {
        url = '/online/manage'
      } else if (this.$route.query.service === '5') {
        url = '/conference/manage'
      } else if (this.$route.query.service === '9') {
        url = '/jbktWh/manage'
      }
      this.$router.push({
        path: url,
        query:{
           page: this.page
        }
      })
    },
    handleClick(tab, event) {
    },
    showid() {
    },
    changeOrder() {
    },
  }
}
</script>
<style scoped>
/*.piont-flex{*/
  /*display: flex;*/
  /*justify-content: space-between;*/
  /*height:36px;*/
  /*margin-bottom:15px;*/
/*}*/
/*.piont-flex .point-title{*/
  /*height: 36px;*/
  /*line-height: 36px;*/
/*}*/
.background {
  margin-left:auto;
  margin-right:auto;
  display: block;
  width: 100px;
  height: 80px;
}
</style>
