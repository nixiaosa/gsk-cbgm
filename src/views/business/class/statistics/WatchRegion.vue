<template>
  <div style="margin-top: 50px">
    <watch-plate-header-bar title="地域分布"/>
    <div class="main">
      <!--    地图-->
      <div class="item">
        <watch-region-left :data="data"/>
      </div>
      <!--      报表-->
      <div class="item">
        <watch-region-right v-if="data.length > 0" :data="data"/>
      </div>
    </div>
  </div>
</template>

<script>
import WatchPlateHeaderBar from "@/views/business/class/statistics/WatchPlateHeaderBar";
import WatchRegionLeft from "@/views/business/class/statistics/WatchRegion/WatchRegionLeft";
import WatchRegionRight from "@/views/business/class/statistics/WatchRegion/WatchRegionRight";

export default {
  name: "WatchRegion",
  props: {
    data: Array
  },
  components: {WatchRegionLeft, WatchPlateHeaderBar, WatchRegionRight},
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme: var(--reset);
.main {
  display: flex;
  flex-direction: column;
  .item {
    width: 100%;
    height: 100%;
  }
}

.distribution {
  width: 100%;
  margin-top: 20px;
}
</style>
