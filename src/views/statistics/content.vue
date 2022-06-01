<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <date-picker :datePickerDate="datePickerDate" :downUrl="downUrl" @change="timeChange"></date-picker>
    <el-button-group>
      <el-button class="date-picker-btn" :type="type1" @click="changeBtn(1)">内容统计</el-button>
      <el-button class="date-picker-btn" :type="type2" @click="changeBtn(2)">文章统计</el-button>
    </el-button-group>
    <VTable :tableConfig="tableConfig" :tableData="tableData" @change="tabRes" v-show="type1"></VTable>
    <VTable :tableConfig="tableConfig1" :tableData="tableData1" @change="tabRes1" v-show="!type1"></VTable>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import datePicker from './base/date-picker'
  import moment from 'moment'
  import { getDateArray } from './js/function'
  import VTable from './base/v-table'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'statis',
    components: {
      datePicker,
      VTable,
      HeaderContent
    },
    data() {
      return {
        type1: 'primary',
        type2: '',
        headerTitle: '内容统计',
        datePickerDate: [
          // { name: '今天', days: [0, 0], type: '' },
          { name: '昨天', days: [-1, 0], type: '' },
          { name: '7天', days: [0, -6], type: '' },
          { name: '30天', days: [0, -29], type: '' }],
        downUrl: '',
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
        /*
        * TODO 表格数据
        * */
        tableData: [],
        tableConfig1: [{
          label: '业务名称',
          prop: 'name'
        }, {
          label: '文章总量（条）',
          prop: 'total'
        },
          {
            label: '操作',
            prop: 'action' // TODO 需要的操作功能 以json字符串
          }
        ],
        tableData1: [{ name: 'CMS', total: 0 }]
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
          createTimeStart: new Date(startDate).getTime(),
          createTimeEnd: new Date(endDate).getTime()
        }
        this.getAllBus(params)
        this.getCmsData(params)
      },
      getAllBus: async function(params) {
        var res = await http.post(api.getAllBus, params)
        if (res.data.code === 0) {
          this.tableData = []
          var dataTotal = res.data.data
          var obj1 = {}
          obj1.name = '总计'
          obj1.total = dataTotal.total
          obj1.liveCount = dataTotal.liveCount
          obj1.programCount = dataTotal.programCount
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
            obj.businessId = returnData[index].businessId
            obj.total = returnData[index].total
            obj.liveCount = returnData[index].liveCount
            obj.programCount = returnData[index].programCount
            obj.retio = returnData[index].retio
            obj.action = ['查看详情']
            obj.timeArray = [moment(new Date(params.createTimeStart)).format('YYYYMMDD'), moment(new Date(params.createTimeEnd)).format('YYYYMMDD')]
            console.log(obj.timeArray)
            this.tableData.push(obj)
          }
        }
      },
      getCmsData: async function(params) {
        var res = await http.post(api.getCmsData, params)
        if (res.data.code === 0) {
          var returnData = res.data.data
          if (returnData.total !== 0) {
            this.tableData1[0].total = returnData.total
            this.tableData1[0].action = ['查看详情']
            this.tableData1[0].timeArray = [moment(new Date(params.createTimeStart)).format('YYYYMMDD'), moment(new Date(params.createTimeEnd)).format('YYYYMMDD')]
          } else if (returnData.total === 0) {
            this.tableData1 = [{ name: 'CMS', total: 0 }]
          }
        }
      },
      changeBtn(num) {
        if (num === 1) {
          this.type1 = 'primary'
          this.type2 = ''
        } else {
          this.type1 = ''
          this.type2 = 'primary'
        }
      },
      success(val) {
        this.$message({
          message: val,
          type: 'success'
        })
      },
      tabRes(row) {
        this.$router.push({ path: `busdays/${row.businessId}/${row.timeArray[0]}/${row.timeArray[1]}` })
      },
      tabRes1(row) {
        this.$router.push({ path: `cmsdays/${row.timeArray[0]}/${row.timeArray[1]}` })
      }
    }
  }
</script>
<style scoped>
  .date-picker-btn{
    width: 100px;
  }
  .el-date-editor--daterange.el-input {
    width: 280px;
  }
</style>
