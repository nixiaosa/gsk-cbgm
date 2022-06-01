<template>
  <div>
    <el-row class="headers">
      <el-col class="info" v-for="(item,index) in headerConfig" :key="index">
        <div class="info-content info-title">{{ item.title }}</div>
        <div class="info-content info-body">{{ item.body }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      headerConfig: {
        type: Array,
        default: () => {}
      }
    },
    data() {
      return {}
    },
    created: function() {
    },
    methods: {},
    components: {}
  }
</script>
<style>
  .headers {
    display: flex;
    flex-wrap: nowrap;
    border: 1px solid #ccc;
  }
  .info {
    text-align: center;
  }
  .info-content {
    height: 50px;
    line-height: 50px;
  }
  .info-title {
    font-size: 16px;
  }
  .info-body {
    font-size: 26px;
  }
</style>
<style scoped>
</style>
