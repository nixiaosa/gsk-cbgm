<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <VTable :tableConfig="tableConfig" :tableData="tableData"></VTable>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import VTable from './base/v-table'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'statis',
    components: {
      VTable,
      HeaderContent
    },
    data() {
      return {
        /*
        * TODO 配置表格
        * TODO title 表头名
        * TODO body 表内容
        * */
        /*
        * TODO 配置表格
        * TODO label 表头名
        * TODO prop 表头名对应tableData的字段
        * */
        tableConfig: [{
          label: '业务名称',
          prop: 'name'
        }, {
          label: '内容总量',
          prop: 'total'
        }, {
          label: '正在直播 (场)',
          prop: 'liveCount'
        }, {
          label: '下一小时直播总量 (场)',
          prop: 'nextHourLiveCount'
        },
          {
            label: '占比 (%)',
            prop: 'retio'
          }
        ],
        headerTitle: '实时统计',
        /*
        * TODO 表格数据
        * */
        tableData: []
      }
    },
    computed: {},
    filters: {
    },
    mounted() {
      this.realTimeBus()
    },
    methods: {
      realTimeBus: async function() {
        var res = await http.get(api.realTimeBus)
        if (res.data.code === 0) {
          this.tableData = []
          var dataTotal = res.data.data
          var obj1 = {}
          obj1.name = '总计'
          obj1.total = dataTotal.total
          obj1.liveCount = dataTotal.liveCount
          obj1.nextHourLiveCount = dataTotal.nextHourLiveCount
          obj1.retio = '100%'
          this.tableData.push(obj1)
          var returnData = dataTotal.resultList
          for (const index in returnData) {
            var obj = {}
            obj.name = returnData[index].businessId === 1 ? '店员培训'
              : returnData[index].businessId === 2 ? '空中课堂'
                : returnData[index].businessId === 3 ? '互动公开课'
                  : returnData[index].businessId === 4 ? '线上公开课'
                    : '学术会议'
            obj.total = returnData[index].total
            obj.liveCount = returnData[index].liveCount
            obj.nextHourLiveCount = returnData[index].nextHourLiveCount
            obj.retio = returnData[index].retio
            this.tableData.push(obj)
          }
        }
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
</style>
