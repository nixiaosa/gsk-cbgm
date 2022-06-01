<template>
  <div>
    <watch-plate-header-bar title="用户分布情况"/>
    <div class="distribution">
      <div ref="myChart" id="newEcharts" class="myChart" style="width: 100%;height: 300px;" autoresize></div>
    </div>
  </div>
</template>

<script>
import WatchPlateHeaderBar from "@/views/business/class/statistics/WatchPlateHeaderBar";
import echarts from 'echarts'
import {mapGetters} from "vuex";

export default {
  name: "WatchUserDistribution",
  props: {
    data: Array,
  },
  components: {WatchPlateHeaderBar},
  computed: {
    ...mapGetters(['themeColor'])
  },
  data() {
    return {}
  },
  mounted() {
    this.polyline()
  },
  methods: {
    polyline() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.myChart);
      let that = this
      let seriesColor = that.themeColor.split(')')[0] + ', .3)'
      let seriesColor2 = that.themeColor
      let seriesColor3 = that.themeColor.split(')')[0] + ', .1)'
      let data = [];
      let data1 = [];
      this.data.map(item => {
        data.push(item.date)
        data1.push(item.userCount)
      })
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        backgroundColor: "#fff",
        grid: {
          left: '3%',
          right: '3%',
          bottom: '0%',
          top: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#E2E8EC',
              },
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#666',
              },
            },
            data: data,
          },
        ],
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#E2E8EC',
              },
            },
            axisLabel: {
              formatter:'{value} 人',
              show: true,
              margin: 10,
              textStyle: {
                fontSize: 14,
                color: '#666',
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#1C3A9A',
              },
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: seriesColor,
                  },
                  {
                    offset: 1,
                    color: seriesColor2,
                  },
                ]),
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: seriesColor,
                    },
                    {
                      offset: 1,
                      color: seriesColor3,
                    },
                  ]),
                },
              },
            },

            lineStyle: {
              width: 1,
              shadowColor: seriesColor2,
              shadowBlur: 10,
              shadowOffsetY: 10
            },
            data: data1,
          },
        ],
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
