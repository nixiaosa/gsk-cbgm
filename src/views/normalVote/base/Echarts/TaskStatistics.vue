<template>
    <div class="charts-box">
        <div ref="myChart" class="myChart" style="width: 400px;height: 300px;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            data: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {}
        },
        mounted() {
            this.getPie()
        },
        methods: {
            getPie() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(this.$refs.myChart);
                // 绘制图表，this.echarts1_option是数据
                let colorList = ['#73ACFF', '#F54D2E', '#8c939d', '#FDB36A']
                let option = {
                    title: {
                        text: this.title,
                        x: 'center',
                        y: 'center',
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },


                    series: [{
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: ['34%', '45%'],
                        clockwise: true,
                        avoidLabelOverlap: true,
                        hoverOffset: 8,
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{a|{b}：{d}%}\n{hr|}',
                            rich: {
                                hr: {
                                    backgroundColor: 't',
                                    borderRadius: 3,
                                    width: 3,
                                    height: 3,
                                    padding: [3, 3, 0, -12]
                                },
                                a: {
                                    padding: [-30, 15, -20, 15]
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                length2: 20,
                                lineStyle: {
                                    width: 1
                                }
                            }
                        },
                        data: this.data,
                    }]
                };
                myChart.setOption(option);
            }
        },
        components: {}
    }
</script>
<style>
    .charts-box {
    }
</style>
