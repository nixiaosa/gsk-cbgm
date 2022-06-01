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
          <span v-if="item.label!=='操作'">{{ scope.row[item.prop] }}</span>
          <el-button v-else @click="operation(scope.row, btn)" v-for="(btn,index1) in scope.row[item.prop]" :key="index1" type="info" size="small">{{btn}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--
TODO  调用示例
<v-table :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></v-table>

TODO tableConfig 配置表单头
  *  格式 [{label: '日期',prop: 'date'}]
  *  label 表头名
  *  prop 表头名对应tableData的字段
  *  如需要的操作功能 需要在tableData 手动添加 action字段 action: ["删除","查看"]

 TODO tableData 表格数据
  * 格式 tableData: [{name: 'V',id: 1}]

  TODO @change 操作功能按钮时触发
-->
<script>
  export default {
    props: {
      tableData: {
        type: Array,
        default: () => {}
      },
      tableConfig: {
        type: Array,
        default: () => {}
      }
    },
    watch: {
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
      }
    },
    components: {
    }
  }
</script>
<style scoped>
</style>
