<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        v-for="(item, index) in tableConfig"
        :key="index"
        :label="item.label"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div>
            <span v-if="scope.row[item.prop]==null">{{ '——' }}</span>
            <span v-if="item.label==='序号'">{{ ((page-1)*10)+scope.$index+1 }}</span>
            <span v-if="item.type==='date'">{{ scope.row[item.prop] | formatDate }}</span>
            <span v-else-if="item.label!=='操作'">{{ scope.row[item.prop] }}</span>
            <el-button v-else @click="operation(scope.row, btn)" v-for="(btn,index1) in scope.row[item.prop]" :key="index1" type="info" size="small">{{btn}}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--
TODO  调用示例
<v-table :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></v-table>

TODO tableConfig 配置表单头
  *  格式 [{label: '日期',prop: 'date',type: 'data}]
  *  label 表头名
  *  prop 表头名对应tableData的字段
  *  type 用于定义解析方式 默认可不传
  *  如需要的操作功能 需要在tableData 手动添加 action字段 action: ["删除","查看"]

 TODO tableData 表格数据
  * 格式 tableData: [{name: 'V',id: 1}]

  TODO @change 操作功能按钮时触发

  TODO page  传输的页码  序号时需要
-->
<script>
  import { formatDate } from '@/common/data'
  export default {
    props: {
      page: {
        type: Number,
        default: 1
      },
      tableData: {
        type: Array,
        default: () => []
      },
      tableConfig: {
        type: Array,
        default: () => []
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    watch: {
      tableConfig(item) {
        this.tableConfig = item
      }
    },
    data() {
      return {
      }
    },
    created: function() {
    },
    methods: {
      operation(val, btnVal) {
        val.btnName = btnVal
        this.$emit('change', val)
        this.$emit('btnName', btnVal)
      }
    },
    components: {
    }
  }
</script>
<style scoped>
</style>
