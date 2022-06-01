<template>
  <div>
    <watch-plate-header-bar :title="videoType === '2' ? '点播概括' : '直播概况'"/>
    <div class="formMain">
      <ul>
        <li v-if="videoType === '2'">
          <span>视频时长</span>
          <span>{{data.videoDuration | minutes}}分钟</span>
        </li>
        <li v-if="videoType === '1'">
          <span>回放视频时长</span>
          <span>{{data.videoDuration | minutes}}分钟</span>
        </li>

        <li>
          <span>观看人数(UV)</span>
          <span>{{data.uvCount}}人</span>
        </li>
        <li>
          <span>观看人次(PV)</span>
          <span>{{data.pvCount}}次</span>
        </li>
        <li>
          <span>观看总时长</span>
          <span>{{data.totalWatchedDuration | minutes}}分钟</span>
        </li>

        <li v-if="videoType === '1'">
          <span>直播观看总时长</span>
          <span>{{data.liveWatchedDuration | minutes}}分钟</span>
        </li>
        <li v-if="videoType === '1'">
          <span>回放观看总时长</span>
          <span>{{data.playbackWatchedDuration | minutes}}分钟</span>
        </li>

        <li>
          <span>平均观看时长</span>
          <span>{{data.watchedDurationAvg | minutes}}分钟</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import WatchPlateHeaderBar from "@/views/business/class/statistics/WatchPlateHeaderBar";
export default {
  name: "WatchSummary",
  components: {WatchPlateHeaderBar},
  props: {
    data:Object,
  },
  filters: {
    minutes(s) {
      let time = s / 60
      return time.toFixed(1)
    }
  },
  data() {
    return {
      videoType: this.$route.query.type
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme: var(--reset);
.formMain {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px 40px;

  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    li {
      display: flex;
      flex-direction: column;
      list-style: none;
      justify-content: center;
      align-items: center;

      span {
        &:nth-child(1) {
          margin-bottom: 10px;
        }

        &:nth-child(2) {
          color: $c-theme;
        }
      }
    }
  }
}
</style>
