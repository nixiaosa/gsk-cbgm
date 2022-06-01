<template>
  <div class="main">
      <watch-access-source-left :data="data"/>
  </div>
</template>

<script>
import WatchAccessSourceLeft from "@/views/business/class/statistics/WatchAccessSource/WatchAccessSourceLeft";
export default {
  name: "WatchAccessSource",
  props: {
    data: Array
  },
  components: {WatchAccessSourceLeft},
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
}
</style>
