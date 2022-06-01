<template>
  <div class="date-picker">
    <el-button-group>
      <el-button class="date-picker-btn" :type="item.type" @click="btnTime(index)" v-for="(item, index) in datePickerDate" :key="index">{{item.name}}</el-button>
    </el-button-group>
    <el-date-picker
      @change="dateChange"
      v-model="timeValue"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy年MM月dd日"
      value-format="yyyy-MM-dd">
    </el-date-picker>
    <el-button type="primary" class="date-picker-btn" style="float:right" v-if="downUrl" @click="dataDown">导出数据</el-button>
  </div>
</template>
<script>
import moment from 'moment'
import { getSomeDay } from '../js/function'
export default {
  name: 'statis',
  props: {
    /*
    * datePickerDate数据格式说明 *
    * { name: '今天', days: [0, 0], type: '' },
        { name: '昨天', days: [-1, 0], type: '' },
        { name: '7天', days: [0, -6], type: '' },
        { name: '30天', days: [0, -29], type: '' }]
    * 数组 name为名称 days是一个数组，[0,0] 第一个0代表着今天，第二个0也即时间段为0天（代表着今天的当天，）
    *                               [-1,0]第一个-1代表着昨天，第二个0也即时间段为0天（代表着今天的当天，）
    *                               [0, -6]第一个0代表着今天，第二个-6也即时间段为6天（负值代表着往回数6天+今天=7天）
    */
    datePickerDate: {
      type: Array,
      default: () => {}
    },
    downUrl: { // 数据下载地址
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      timeValue: [],
      btnValue: []
    }
  },
  computed: {},
  filters: {
  },
  mounted() {
    if (this.$route.params.begin && this.$route.params.end) {
      this.timeValue = [moment(this.$route.params.begin).format('YYYY-MM-DD'), moment(this.$route.params.end).format('YYYY-MM-DD')]
    } else {
      if (this.datePickerDate.length !== 0) {
        this.btnTime(0) // 确定button数组（今天，昨天。。）存在，将第一组数据进行选择
      }
    }
  },
  methods: {
    getSomeDay,
    btnTime(index) { // 将点击的按钮变色选中
      if (this.datePickerDate[index].type !== 'primary') { // 是否当前已经被选中
        for (var i = 0; i < this.datePickerDate.length; i++) { // 首先全部取消选中
          this.datePickerDate[i].type = ''
        }
        this.datePickerDate[index].type = 'primary' // 选中该按钮
        var timeArr = this.getTimeslot(this.datePickerDate[index].days) // 时间段获取
        if (this.timeValue !== timeArr) { // 如果时间选择框时间不一致，进行更改
          this.timeValue = timeArr // 选择框时间更改
        }
        this.btnValue = timeArr // 当前btn时间修改
        this.changeTime(timeArr) // 调用父组件传值方法
      }
    },
    changeTime(timeArr) {
      this.$emit('change', timeArr) // 父组件接受子组件方法传值（@change）
    },
    dateChange() { // 选择框时间修改触发方法
      var timeArr = [moment(this.timeValue[0]).format('YYYY-MM-DD'), moment(this.timeValue[1]).format('YYYY-MM-DD')]
      if (timeArr[0] !== this.btnValue[0] || timeArr[1] !== this.btnValue[1]) { // 判断选择框的时间是否与btn时间一致
        for (var i = 0; i < this.datePickerDate.length; i++) {
          this.datePickerDate[i].type = ''
          var timeArr2 = this.getTimeslot(this.datePickerDate[i].days)
          if (timeArr2[0] === timeArr[0] && timeArr2[1] === timeArr[1]) { // 判断btn组中是否有相同的时间区间
            this.datePickerDate[i].type = 'primary'
          }
        }
        this.$emit('change', timeArr) // 父组件接受子组件方法传值（@change）
      }
    },
    getTimeslot(days) { // 获取区间段时间 格式['2018-10-04', '2018-10-11']
      return [this.getSomeDay(days[0] + days[1]), this.getSomeDay(days[0])]
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
