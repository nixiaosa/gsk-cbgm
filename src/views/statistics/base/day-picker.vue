<template>
  <div class="date-picker">
    <el-date-picker
      v-model="value1"
      @change="dateChange"
      type="date"
      format="yyyy年MM月dd日"
      value-format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
    <el-button type="primary" class="date-picker-btn" style="float:right" v-if="downUrl" @click="dataDown">导出数据</el-button>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'statis',
  props: {
    downUrl: { // 数据下载地址
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      value1: ''
    }
  },
  computed: {
  },
  filters: {
  },
  mounted() {
    this.value1 = moment(this.$route.params.begin).format('YYYY-MM-DD')
  },
  methods: {
    dateChange() { // 选择框时间修改触发方法
      this.$emit('change', moment(this.value1).format('YYYY-MM-DD'))
    },
    dataDown() { // 下载数据
      window.open(this.downUrl)
    },
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
.date-picker{
  margin-top: 10px;
  margin-bottom: 10px;
}
.date-picker-btn{
  width: 100px;
}
.el-date-editor--daterange.el-input {
    width: 280px;
}
</style>
