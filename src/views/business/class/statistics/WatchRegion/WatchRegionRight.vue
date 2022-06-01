<template>
  <div style="margin-top: 50px">
    <div className="distribution">
      <div ref="myChart" id="newEcharts" className="myChart" style="width: 100%;height: 600px;" autoresize></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import {mapGetters} from "vuex";

export default {
  name: "WatchRegionRight",
  props: {
    data: Array
  },
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
      let seriesColor = that.themeColor
      let seriesColor1 = that.themeColor.split(')')[0] + ', .3)'


      let nameData = []
      let pvData = [];
      let uvData = []
      this.data.forEach(item => {
        nameData.push(item.province)
        uvData.push(item.uv)
        pvData.push(item.pv)
      })

      let option = {
        backgroundColor: '#ffffff',
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        legend: {
          data:['观看人次','观看人数'],
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : nameData,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E2E8EC',
              }
            },
            axisLabel: {
              color: '#333',
              interval:0,
              rotate:40
            }
          }
        ],
        yAxis : [
          {
            minInterval: 1,
            type : 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#E2E8EC',
              }
            },
            axisLabel: {
              color: '#333'
            }
          }
        ],
        series : [
          {
            name:'观看人次',
            type:'bar',
            barWidth: 20,
            itemStyle: {
              barBorderRadius: 20,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "rgba(237,124,47, 1)"
              },
                {
                  offset: 1,
                  color: "rgba(237,124,47, .3)"
                }
              ])
            },
            data:pvData
          },
          {
            name:'观看人数',
            type:'bar',
            barWidth: 20,
            barGap: '-100%',
            stack: '观看人数',
            itemStyle: {
              barBorderRadius: 20,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0.4,
                color: seriesColor
              },
                {
                  offset: 1,
                  color: seriesColor1
                }
              ])
            },
            data:uvData
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
