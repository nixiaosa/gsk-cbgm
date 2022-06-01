<template>
  <div class="statis-area">
    <div class="header" style="border-bottom: 1px solid #ccc;">
      <div class="header-title">网站统计</div>
    </div>
    <date-picker :datePickerDate="datePickerDate" :downUrl="downUrl"></date-picker>
  </div>
</template>
<script>
// import http from '@/utils/tenant'
// import api from '@/api/tenantInfoSave'
import datePicker from './base/date-picker'
import { formatDate } from '@/common/data'
export default {
  name: 'statis',
  components: {
    datePicker
  },
  data() {
    return {
      datePickerDate: [
        { name: '今天', days: [0, 0], type: '' },
        { name: '昨天', days: [-1, 0], type: '' },
        { name: '7天', days: [0, -7], type: '' },
        { name: '30天', days: [0, -30], type: '' }],
      downUrl: ''
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
  },
  methods: {
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    }
  }
}
</script>
<style scoped>
.statis-area {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.statis-area .header {
  display: block;
  overflow: hidden;
  margin-bottom: 10px;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #ccc;
}
.statis-area .header .header-title {
  height: 30px;
  font-size: 18px;
  line-height: 30px;
}
.date-picker-btn{
  width: 100px;
}
.el-date-editor--daterange.el-input {
    width: 280px;
}
</style>
