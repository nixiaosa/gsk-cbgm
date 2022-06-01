<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <date-picker :datePickerDate="datePickerDate" :downUrl="downUrl" @change="timeChange"></date-picker>
    <v-header :headerConfig="headerConfig" v-show="headerConfig.length!==0" class="margin10"></v-header>
    <VTable :tableConfig="tableConfig" :tableData="tableData" v-show="type1" @change="tabRes"></VTable>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import datePicker from './base/date-picker'
  import moment from 'moment'
  import { getDateArray } from './js/function'
  import VTable from './base/v-table'
  import VHeader from './base/v-header'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'statis',
    components: {
      datePicker,
      VTable,
      VHeader,
      HeaderContent
    },
    data() {
      return {
        type1: 'primary',
        datePickerDate: [
          // { name: '今天', days: [0, 0], type: '' },
          { name: '昨天', days: [-1, 0], type: '' },
          { name: '7天', days: [0, -6], type: '' },
          { name: '30天', days: [0, -29], type: '' }],
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
          prop: 'dateWeek'
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
          },
          {
            label: '操作',
            prop: 'action' // TODO 需要的操作功能 以json字符串
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
      getDateArray,
      timeChange: async function(array) {
        // var dateArr = this.getDateArray(array[0], array[1])
        const startDate = moment(new Date(array[0])).format('YYYY/MM/DD') // YYYY/MM/DD 获取data格式相比 YYYY-MM-DD 准确
        const endDate = moment(new Date(array[1])).format('YYYY/MM/DD')
        const params = {
          businessId: this.$route.params.busid,
          createTimeStart: new Date(startDate).getTime(),
          createTimeEnd: new Date(endDate).getTime()
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
          obj1.dateWeek = '总计'
          obj1.busName = busName1
          obj1.total = dataTotal.total
          obj1.liveCount = dataTotal.liveCount
          obj1.programCount = dataTotal.programCount
          obj1.retio = '100%'
          if (params.createTimeStart === params.createTimeEnd) {
            obj1.timeStr = moment(new Date(params.createTimeStart)).format('YYYYMMDD')
            obj1.action = ['查看详情']
            this.tableData.push(obj1)
            return false
          }
          this.tableData.push(obj1)
          var returnData = dataTotal.resultList
          for (const index in returnData) {
            var obj = {}
            obj.dateWeek = moment(returnData[index].createTime).format('YYYY-MM-DD')
            if (new Date(returnData[index].createTime).getDay() === 6) {
              obj.dateWeek += ' ' + '星期六'
            } else if (new Date(returnData[index].createTime).getDay() === 0) {
              obj.dateWeek += ' ' + '星期日'
            }
            obj.busName = busName1
            obj.total = returnData[index].total
            obj.liveCount = returnData[index].liveCount || 0
            obj.programCount = returnData[index].programCount || 0
            obj.retio = returnData[index].retio
            obj.action = ['查看详情']
            obj.timeStr = moment(new Date(returnData[index].createTime)).format('YYYYMMDD')
            this.tableData.push(obj)
          }
        }
      },
      // getCmsData: async function(params) {
      //   var res = await http.post(api.getCmsData, params)
      //   if (res.data.code === 0) {
      //     var returnData = res.data.data
      //     if (returnData.total !== 0) {
      //       this.tableData1[0].total = returnData.total
      //       this.tableData1[0].action = ['查看详情']
      //       console.log(new Date(params[0]))
      //       this.tableData1[0].timeArray = [moment(new Date(params.createTimeStart)).format('YYYYMMDD'), moment(new Date(params.createTimeEnd)).format('YYYYMMDD')]
      //     }
      //   }
      // },
      success(val) {
        this.$message({
          message: val,
          type: 'success'
        })
      },
      tabRes(row) {
        this.$router.push({ path: `/statistics/bushours/${this.$route.params.busid}/${row.timeStr}` })
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
