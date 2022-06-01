<template>
  <div style="margin-top: 50px">
    <div className="distribution">
      <div ref="myChart" id="newEcharts" className="myChart" style="width: 100%;height: 600px;" autoresize></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import {mapGetters} from "vuex";

export default {
  name: "WatchRegionLeft",
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
      let seriesColor1 = that.themeColor.split(')')[0] + ', .1)'
      let seriesColor2 = that.themeColor.split(')')[0] + ', .2)'
      let seriesColor3 = that.themeColor.split(')')[0] + ', .4)'
      let seriesColor4 = that.themeColor.split(')')[0] + ', .6)'
      let seriesColor5 = that.themeColor.split(')')[0] + ', .8)'

      let data = [{
        name: "北京",
        value: 0,
      },
        {
          name: "天津",
          value: 0,
        },
        {
          name: "上海",
          value: 0,
        },
        {
          name: "重庆",
          value: 0,
        },
        {
          name: "河北",
          value: 0,
        },
        {
          name: "河南",
          value: 0,
        },
        {
          name: "云南",
          value: 0,
        },
        {
          name: "辽宁",
          value: 0,
        },
        {
          name: "黑龙江",
          value: 0,
        },
        {
          name: "湖南",
          value: 0,
        },
        {
          name: "安徽",
          value: 0,
        },
        {
          name: "山东",
          value: 0,
        },
        {
          name: "新疆",
          value: 0,
        },
        {
          name: "江苏",
          value: 0,
        },
        {
          name: "浙江",
          value: 0,
        },
        {
          name: "江西",
          value: 0,
        },
        {
          name: "湖北",
          value: 0,
        },
        {
          name: "广西",
          value: 0,
        },
        {
          name: "甘肃",
          value: 0,
        },
        {
          name: "山西",
          value: 0,
        },
        {
          name: "内蒙古",
          value: 0,
        },
        {
          name: "陕西",
          value: 0,
        },
        {
          name: "吉林",
          value: 0,
        },
        {
          name: "福建",
          value: 0,
        },
        {
          name: "贵州",
          value: 0,
        },
        {
          name: "广东",
          value: 0,
        },
        {
          name: "青海",
          value: 0,
        },
        {
          name: "西藏",
          value: 0,
        },
        {
          name: "四川",
          value: 0,
        },
        {
          name: "宁夏",
          value: 0,
        },
        {
          name: "海南",
          value: 0,
        },
        {
          name: "台湾",
          value: 0,
        },
        {
          name: "香港",
          value: 0,
        },
        {
          name: "澳门",
          value: 0,
        },
      ];
      for (let item of this.data) {
        for (let item2 of data) {
          if (item.province.indexOf(item2.name) >= 0) {
            item2.value = item.uv
          }
        }
      }
// 指定图表的配置项和数据
      let option = {
        tooltip: {
          trigger: "item",
        },
        visualMap: {
          type: "piecewise",
          pieces: [{
            min: 120,
            max: 1200000,
            label: "观看数120人以上",
            color: seriesColor5,
          },
            {
              min: 81,
              max: 120,
              label: "观看数80人-120人",
              color: seriesColor4
            },
            {
              min: 51,
              max: 80,
              label: "观看数50人-80人",
              color: seriesColor3
            },
            {
              min: 20,
              max: 50,
              label: "观看数20人-50人",
              color: seriesColor2
            },
            {
              min: 0,
              max: 19,
              label: "观看数20人以下",
              color: seriesColor1
            },
          ],
          color: ["#E0022B", "#E09107", "#A3E00B"],
        },
        roamController: {
          show: true,
          left: "right",
        },

        geo: {
          //地理坐标系组件用于地图的绘制
          map: "china",
          roam: false, //不开启缩放和平移
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                }
              },
              label: {
                show: false // 隐藏文字
              }
            }
          ],
          label: {
            normal: {
              show: true,
              fontSize: "10",
              color: "rgba(0,0,0,0.7)",
            },
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(0, 0, 0, 0.2)",
            },
            emphasis: {
              areaColor: seriesColor, //鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
        series: [{
          name: "观看人数",
          type: "map", //图表类型
          geoIndex: 0,
          data: data, //图表的数据
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
