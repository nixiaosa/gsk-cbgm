<template>
  <div style="margin-top: 50px">
    <watch-plate-header-bar :title="videoType === '2' ? '点播概况' : '直播概况'"/>
    <div class="distribution">
      <div ref="myChart" id="newEcharts" class="myChart" style="width: 100%;height: 600px;" autoresize></div>
    </div>
  </div>
</template>

<script>
import WatchPlateHeaderBar from "@/views/business/class/statistics/WatchPlateHeaderBar";
import echarts from 'echarts'
import {mapGetters} from "vuex";

export default {
  name: "WatchLive",
  props: {
    data: Array
  },
  components: {WatchPlateHeaderBar},
  computed: {
    ...mapGetters(['themeColor'])
  },
  data() {
    return {
      videoType: this.$route.query.type
    }
  },
  mounted() {
    this.polyline()
  },
  methods: {
    polyline() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.myChart);
      let that = this
      let seriesColor3 = that.themeColor.split(')')[0] + ', .1)'
      let seriesColor5 = that.themeColor.split(')')[0] + ', .9)'
      let seriesColor6 = that.themeColor.split(')')[0] + ', .7)'
      let data = ["5分钟以内", "5-10分钟", "10-30分钟", "30-60分钟", "60分钟以上"]
      let data1 = []
      for (let item of data) {
        for (let val of this.data) {
          if (val.key === item) {
            data1.push(val.value)
          }
        }
      }

      let option = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
        },
        grid: {
          left: '5%',
          top: '10%',
          right: '5%',
          bottom: '10%',
        },
        legend: {
          show: true,
          icon: 'circle',
          orient: 'horizontal',
          top: '90.5%',
          right: 'center',
          itemWidth: 16.5,
          itemHeight: 6,
          // itemGap: 30,
          textStyle: {
            // color: '#FFFFFF'
            color: '#C9C8CD',
            fontSize: 14
          }
        },
        xAxis: [{
          data: data,
          axisLabel: {
            textStyle: {
              color: '#38455D',
              fontSize:12
            },
            margin: 30, //刻度标签与轴线之间的距离。
          },

          axisLine: {
            show: true, //不显示x轴
            lineStyle: {
              color: '#E2E8EC'
            }
          },
          axisTick: {
            show: false //不显示刻度
          },
          boundaryGap: true,
          splitLine: {
            show: false,
            width: 0.08,
            lineStyle: {
              type: "solid",
              color: "#03202E"
            }
          }
        }],
        yAxis: [{
          minInterval: 1,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E2E8EC',
              type: 'dashed'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#E2E8EC"
            }
          },
          axisLabel: {
            formatter:'{value} 人',
            textStyle: {
              color: '#38455D',
              fontSize: 12
            },
          }
        }],
        series: [
          {//柱底圆片
            name: "",
            type: "pictorialBar",
            symbolSize: [60, 20],//调整截面形状
            symbolOffset: [0, 10],
            z: 12,
            itemStyle: {
              "normal": {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: seriesColor3
                },
                  {
                    offset: 1,
                    color: seriesColor3
                  }
                ],false)
              }
            },
            data: data1
          },

          //柱体
          {
            name: '',
            type: 'bar',
            barWidth: 60,
            barGap: '0%',
            itemStyle: {
              "normal": {
                "color": {
                  "x": 0,
                  "y": 0,
                  "x2": 0,
                  "y2": 1,
                  "type": "linear",
                  "global": false,
                  "colorStops": [{//第一节下面
                    "offset": 0,
                    "color": seriesColor6
                  }, {
                    "offset": 1,
                    "color": seriesColor3
                  }]
                }
              }
            },

            data: data1
          },

          //柱顶圆片
          {
            name: "",
            type: "pictorialBar",
            symbolSize: [60, 20],//调整截面形状
            symbolOffset: [0, -10],
            z: 12,
            symbolPosition: "end",
            "itemStyle": {
              "normal": {
                color: new echarts.graphic.LinearGradient(0,0,0,1,
                    [{
                      offset: 0,
                      color: seriesColor5
                    },
                      {
                        offset: 1,
                        color: seriesColor5
                      }
                    ],
                    false
                ),
              }
            },
            data: data1
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
