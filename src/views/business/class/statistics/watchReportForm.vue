<template>
  <div>
    <el-button style="margin-bottom: 20px" @click="getPdf()">导出PDF</el-button>
    <div id="pdfDom">
      <!--    总汇-->
      <watch-summary :data="watchSituationData"/>
      <!--用户分布-->
      <watch-user-distribution v-if="userCountByDateHistogramShow" :data="userCountByDateHistogramData"/>
      <!--    直播概况 时间 人数-->
      <watch-live-overview v-if="watchTimeCountShow" :data="watchTimeCountData"/>
      <!--    地域分布-->
      <watch-region v-if="locationStatisticsShow" :data="locationStatisticsData"/>
      <!--   访问来源&观看方式 -->
      <watch-access-source v-if="watchDeviceDistributeShow" :data="watchDeviceDistributeData"/>
    </div>
  </div>
</template>

<script>
import WatchSummary from "@/views/business/class/statistics/WatchSummary";
import WatchUserDistribution from "@/views/business/class/statistics/WatchUserDistribution";
import WatchLiveOverview from "@/views/business/class/statistics/WatchLiveOverview";
import WatchRegion from "@/views/business/class/statistics/WatchRegion";
import WatchAccessSource from "@/views/business/class/statistics/WatchAccessSource";
import {formatDate} from "@/common/data"
import {mapGetters} from "vuex";

export default {
  name: "watchReportForm",
  computed: {
    ...mapGetters([
      'companyid'
    ])
  },
  data() {
    return {
      watchSituationData: {},
      userCountByDateHistogramShow: false,
      userCountByDateHistogramData: [], // 用户分布
      watchTimeCountShow: false,
      watchTimeCountData: [], // 时间 人数
      watchDeviceDistributeShow: false,
      watchDeviceDistributeData: [], // 观看方式
      realStartTime: '', // 推流时间
      realEndTime: '', // 查询结束时间
      basics: {},
      locationStatisticsShow: false,
      locationStatisticsData: [],
    }
  },
  components: {WatchAccessSource, WatchRegion, WatchLiveOverview, WatchUserDistribution, WatchSummary},
  created() {
    let params = {
      companyId: this.companyid,
      businessId: this.$route.query.service,
      contentId: this.$route.params.id
    }
    this.basics = params
  },
  mounted() {
    this.getLiveTime() // 获取推流时间
    this.watchSituation() // 直播点播概况
    this.watchTimeCount() // 时间人数
    this.locationStatistics() // 地域分布
    this.watchDeviceDistribute() // 观看方式
  },
  methods: {
    exportPDF() {

    },
    watchDeviceDistribute() {
      /*
      * 观看方式
      * */
      this.$http.post(this.$api.watch.watchDeviceDistribute, this.basics).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.watchDeviceDistributeData = data
          this.watchDeviceDistributeShow = true
        } else {
          this.$message.error(this.$api.watch.watchDeviceDistribute + ':::' + code)
        }
      })
    },
    locationStatistics() {
      /*
      * 地域分布
      * */
      this.$http.post(this.$api.watch.locationStatistics, this.basics).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.locationStatisticsData = data
          this.locationStatisticsShow = true
        } else {
          this.$message.error(this.$api.watch.locationStatistics + ':::' + code)
        }
      })
    },
    watchTimeCount() {
      // 时间人数
      this.$http.post(this.$api.watch.watchTimeCount, this.basics).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.watchTimeCountData = data
          this.watchTimeCountShow = true
        } else {
          this.$message.error(this.$api.watch.watchTimeCount + ':::' + code)
        }
      })
    },
    getLiveTime() {
      /*
      * 获取推流时间
      * */
      this.$http.get(this.$api.watch.getLiveTime + this.basics.contentId).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          let time = data.realStartTime ? data.realStartTime : (data.startTime || data.createTime)
          this.realStartTime = time
          this.realEndTime = time + 259200000 // 推三天
          this.userCountByDateHistogram() // 用户分布情况
        } else {
          this.$message.error(message)
        }
      })
    },
    userCountByDateHistogram() {
      /*
      * 用户分布情况
      * */
      let params = {
        ...this.basics,
        endDate: this.realEndTime,
        startDate: this.realStartTime
      }
      this.$http.post(this.$api.watch.userCountByDateHistogram, params).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          for (let item of data) {
            item.date = formatDate(new Date(item.histogramDate), 'MM/dd hh:mm')
          }
          this.userCountByDateHistogramData = data
          this.userCountByDateHistogramShow = true
        } else {
          this.$message.error(this.$api.watch.userCountByDateHistogram + ':::' + code)
        }
      })
    },
    watchSituation() {
      /*
      * 直播点播概况
      * */
      this.$http.post(this.$api.watch.watchSituation, this.basics).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.watchSituationData = data
        } else {
          this.$message.error(`${this.$api.watch.watchSituation}:::${code}`)
        }
      })
    }
  }
}
</script>

