<template>
  <div id="vTable">
    <el-form>
      <v-header :headerConfig="headerConfig"></v-header>

      <el-form-item class="vSelect" label="选择业务：">
        <el-select v-model="value" placeholder="请选择" @change="getOption">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <div style="height: 80px"></div>
      <v-table :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></v-table>
    </el-form>
  </div>
</template>
<script>
  import VTable from './base/v-table'
  import VHeader from './base/v-header'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        /*
        * TODO 配置表格
        * TODO title 表头名
        * TODO body 表内容
        * */
        headerConfig: [{
          title: '业务名称',
          body: '空中课堂'
        }, {
          title: '内容总量（场）',
          body: '200'
        }, {
          title: '正在直播（场）',
          body: '3398'
        }, {
          title: '下一小时直播总量（场）',
          body: '3398'
        }, {
          title: '占比（%）',
          body: '10'
        }],
        /*
        * TODO 配置表格
        * TODO label 表头名
        * TODO prop 表头名对应tableData的字段
        * */
        tableConfig: [{
          label: '日期',
          prop: 'date'
        }, {
          label: '姓名',
          prop: 'name'
        }, {
          label: '地址',
          prop: 'address'
        }, {
          label: '操作',
          prop: 'action' // TODO 需要的操作功能 以json字符串
        }
        ],
        /*
        * TODO 表格数据
        * */
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          id: 1,
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          id: 2,
          action: ["删除","查看"]
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          id: 3
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          id: 4,
          action: ["删除","查看"]
        }],
        tableData2: [{
          date: '2016-05-02',
          name: '陈威',
          phone: '17600079797',
          address: '上海市普陀区金沙江路 1518 弄',
          id: 5,
          action: ["删除","查看"]
        }, {
          date: '2016-05-04',
          name: '陈威',
          phone: '17600079797',
          address: '上海市普陀区金沙江路 1517 弄',
          id: 2,
          action: ["删除","查看"]
        }, {
          date: '2016-05-01',
          phone: '17600079797',
          name: '陈威',
          address: '上海市普陀区金沙江路 1519 弄',
          id: 3,
          action: '["删除","查看"]'
        }, {
          date: '2016-05-03',
          name: '陈威',
          address: '上海市普陀区金沙江路 1516 弄',
          phone: '17600079797',
          id: 4,
          action: ["删除","查看"]
        }]
      }
    },
    created: function() {
    },
    methods: {
      getOption(val) {
        if (val === '选项2') {
          var add = {
            label: '手机号',
            prop: 'phone'
          }
          this.tableConfig.push(add)
          this.tableData = this.tableData2
        }
        console.log(val)
      },
      tabRes(res) {
        console.log(res)
      }
    },
    components: {
      VTable,
      VHeader
    }
  }
</script>
<style scoped>
  #vTable{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
  }
  .vSelect {
    margin: 10px;
  }
</style>
