<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <day-picker :downUrl="downUrl" @change="timeChange"></day-picker>
    <v-header :headerConfig="headerConfig" v-show="headerConfig.length!==0" class="margin10"></v-header>
    <VTable :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></VTable>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import dayPicker from './base/day-picker'
  import moment from 'moment'
  import VTable from './base/v-table'
  import VHeader from './base/v-header'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'statis',
    components: {
      dayPicker,
      VTable,
      VHeader,
      HeaderContent
    },
    data() {
      return {
        downUrl: '',
        headerConfig: [],
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
          label: '时间',
          prop: 'hourTime'
        }, {
          label: '业务名称',
          prop: 'busName'
        },
          {
            label: '内容总量 (场)',
            prop: 'total'
          }, {
            label: '直播量 (场)',
            prop: 'liveCount'
          }, {
            label: '点播量 (场)',
            prop: 'programCount'
          },
          {
            label: '占比 (%)',
            prop: 'retio'
          }
        ],
        headerTitle: '内容统计 -- 详情',
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
    },
    methods: {
      timeChange: async function(time) {
        const startDate = moment(new Date(time)).format('YYYY/MM/DD') // YYYY/MM/DD 获取data格式相比 YYYY-MM-DD 准确
        const params = {
          businessId: this.$route.params.busid,
          createTimeStart: new Date(startDate).getTime(),
          createTimeEnd: new Date(startDate).getTime()
        }
        this.getOneBus(params)
      },
      getOneBus: async function(params) {
        var res = await http.post(api.getOneBus, params)
        var busName1 = this.$route.params.busid === '1' ? '店员培训'
          : this.$route.params.busid === '2' ? '空中课堂'
            : this.$route.params.busid === '3' ? '互动公开课'
              : this.$route.params.busid === '4' ? '线上公开课'
                : '学术会议'
        if (res.data.code === 0) {
          this.tableData = []
          var dataTotal = res.data.data
          var headerArray = []
          headerArray.push({ title: '业务名称', body: busName1 })
          headerArray.push({ title: '内容总量 （场）', body: dataTotal.total })
          headerArray.push({ title: '直播量 （场）', body: dataTotal.liveCount })
          headerArray.push({ title: '点播量 （场）', body: dataTotal.programCount })
          this.headerConfig = headerArray
          var obj1 = {}
          obj1.hourTime = '总计'
          obj1.busName = busName1
          obj1.total = dataTotal.total
          obj1.liveCount = dataTotal.liveCount
          obj1.programCount = dataTotal.programCount
          obj1.retio = '100%'
          this.tableData.push(obj1)
          var returnData = dataTotal.resultList
          for (const index in returnData) {
            var obj = {}
            obj.hourTime = this.getHours(index)
            obj.busName = busName1
            obj.total = returnData[index].total
            obj.liveCount = returnData[index].liveCount || 0
            obj.programCount = returnData[index].programCount || 0
            obj.retio = returnData[index].retio
            obj.timeStr = moment(new Date(returnData[index].createTime)).format('YYYYMMDD')
            this.tableData.push(obj)
          }
        }
      },
      getHours(num) {
        if (num < 10) {
          return '0' + num + ':00 ~ ' + '0' + num + ':59'
        } else if (num >= 10) {
          return num + ':00 ~ ' + num + ':59'
        }
      },
      success(val) {
        this.$message({
          message: val,
          type: 'success'
        })
      },
      tabRes(row) {
        this.$router.push({ path: `bushours/${row.businessId}/${row.timeStr}` })
      }
    }
  }
</script>
<style scoped>
  .statis-area .margin10 {
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
