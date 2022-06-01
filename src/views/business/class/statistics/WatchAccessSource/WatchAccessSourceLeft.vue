<template>
  <div style="margin-top: 50px">
    <watch-plate-header-bar title="观看方式"/>
    <div className="distribution">
      <div ref="myChart" id="newEcharts" className="myChart" style="width: 100%;height: 600px;" autoresize></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import {mapGetters} from "vuex";
import WatchPlateHeaderBar from "@/views/business/class/statistics/WatchPlateHeaderBar";
export default {
  name: "WatchAccessSourceLeft",
  props: {
    data: Array
  },
  components: {WatchPlateHeaderBar},
  computed: {
    ...mapGetters(['themeColor'])
  },
  mounted() {
    this.polyline()
  },
  methods: {
    polyline() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.myChart);
      let that = this
      let seriesColor = that.themeColor
      let pc = 0, mobile = 0
      this.data.map(item => {
        if (item.platform === 'web') {
          pc = item.count
        } else {
          mobile = item.count
        }
      })
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['PC端', '移动端']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: pc, name: 'PC端'},
              {value: mobile, name: '移动端'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            color: [
              seriesColor,
              '#ed7c2f',
              '#a5a5a4',
              '#5a9bd5'
            ],
          }
        ]
      };

      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme: var(--reset);
.distribution {
  width: 100%;
  margin-top: 20px;
}
</style>
