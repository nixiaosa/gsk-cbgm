<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <date-picker :datePickerDate="datePickerDate" :downUrl="downUrl" @change="timeChange"></date-picker>
    <VTable :tableConfig="tableConfig" :tableData="tableData"></VTable>
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
        datePickerDate: [
          // { name: '今天', days: [0, 0], type: '' },
          { name: '昨天', days: [-1, 0], type: '' },
          { name: '7天', days: [0, -6], type: '' },
          { name: '30天', days: [0, -29], type: '' }],
        downUrl: '',
        headerTitle: '网站浏览量',
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
          label: '浏览次数 (PV)',
          prop: 'pv'
        }, {
          label: '独立访客 (UV)',
          prop: 'uv'
        }, {
          label: 'IP数',
          prop: 'iv'
        }, {
          label: '访问次数',
          prop: 'vv'
        }
        //  {
        //   label: '操作',
        //   prop: '["删除","查看"]' // TODO 需要的操作功能 以json字符串
        // }
        ],
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
        var dateArr = this.getDateArray(array[0], array[1])
        const params = {
          api: 'ctr_page',
          map: {
            start_date: array[0],
            end_date: array[1]
          }
        }
        var res1 = await http.post(api.getStatisticData, params)
        if (res1.data.code === 0) {
          this.tableData = []
          var returnData = res1.data.data
          var arrNum = dateArr.length
          for (let index = 0; index < arrNum; index++) {
            var str = moment(new Date(dateArr[index].date)).format('YYYYMMDD')
            if (returnData[str]) { // returnData['20181016']
              dateArr[index].iv = returnData[str].iv ? returnData[str].iv : '-'
              dateArr[index].pv = returnData[str].pv ? returnData[str].pv : '-'
              dateArr[index].uv = returnData[str].uv ? returnData[str].uv : '-'
              dateArr[index].vv = returnData[str].vv ? returnData[str].vv : '-'
            } else {
              dateArr[index].iv = 0
              dateArr[index].pv = 0
              dateArr[index].uv = 0
              dateArr[index].vv = 0
            }
          }
          this.tableData = dateArr
        }
      },
      success(val) {
        this.$message({
          message: val,
          type: 'success'
        })
      },
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
