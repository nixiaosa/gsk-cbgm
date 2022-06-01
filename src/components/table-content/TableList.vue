<template>
  <div class="tab-list-box">
    <el-table
        :data="data"
        style="width: 100%">
      <el-table-column
          v-for="(item, index) in tableConfig[name]"
          :key="index"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.type !== 'action'">
        <template slot-scope="scope">
          <div>
            <span v-if="item.type==='date'">{{ scope.row[item.prop] | formatDate }}</span>
            <span v-else-if="item.type==='daterange'">{{
                scope.row[item.prop[0]] | formatDate
              }} 至 {{ scope.row[item.prop[1]] | formatDate }}</span>
            <span v-else-if="item.type==='status'">{{ scope.row[item.prop] | statusRule(item.statusRule) }}</span>
            <span v-else-if="item.type==='sex'">{{ scope.row[item.prop] | sexRule }}</span>
            <!--              列表按钮-->
            <div v-else-if="item.type==='action'">
              <div class="btnList" v-for="(btn,btnIndex) in item.props" :key="btnIndex">
                <!--btn.prop  比如data.json中操作按钮的prop为END 如果此按钮需要按状态显示 就要在数据源判断条件后添加END：true-->
                <el-button v-if="scope.row[btn.prop] || !btn.hidden" @click="operation(scope.row, btn)" :type="btn.type"
                           size="small">{{ btn.value }}
                </el-button>
              </div>
            </div>
            <span v-else-if="item.type==='finishType'">{{ scope.row[item.prop] | finishType }}</span>
            <span v-else>
                            <span v-if="item.part">
                                {{ scope.row[item.prop][item.part] }}
                            </span>
                            <span v-else>
                                {{ scope.row[item.prop] }}
                            </span>
                        </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<!--
TODO prop 为取值项 如果存在二级 请配置 part
-->
<script>
import {formatDate} from '@/common/data'
import tabConfiData from './table-column-data/data.json'

export default {
  name: 'TableList',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    }
  },
  filters: {
    finishType(val){
      switch (val) {
        case 0:
          return '已完成'
        case 1:
          return '未完成'
        default:
          return ''
      }
    },
    sexRule(sex) {
      switch (sex) {
        case 'man':
          return '男'
        case 'woman':
          return '女'
        default:
          return ''
      }
    },
    statusRule(val, rule) {
      if (rule === '0') {
        switch (val) {
          case 0:
            return "未发布"
          case 1:
            return '未开始'
          case 2:
            return '未开始'
          case 3:
            return '进行中'
          case 4:
            return '已结束'
          default:
            return '未知状态'
        }
      } else if (rule === '1') {
        switch (val) {
          case -1:
            return '未发布'
          case 0:
            return "未开始"
          case 1:
            return '已开始'
          case 2:
            return '已结束'
          default:
            return '未知状态'
        }
      }
    },
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    return {
      tableData: [],
      tableConfig: tabConfiData
    }
  },
  methods: {
    open(data) {
      this.$confirm('此操作将不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$emit('change', data)
      })
    },
    operation(item, btnInfo) {
      let data = {
        ...item,
        btnName: btnInfo
      }
      if (btnInfo.prop === 'END') {
        this.open(data)
      } else {
        this.$emit('change', data)
      }
    }
  }
}
</script>
<style>
.tab-list-box .el-table__fixed-right::before, .tab-list-box .el-table__fixed::before {
  height: 0;
}
</style>
<style scoped>
.btnList {
  float: left;
  margin-right: 10px;
  margin-bottom: 4px;
}
</style>
