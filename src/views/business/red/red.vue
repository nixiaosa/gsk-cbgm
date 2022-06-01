<template>
  <div class="modelist">
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="租户名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发放人">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ff }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.cjtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="总金额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.je }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="个数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="领取金额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.lq }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="领取个数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.gs }}</span>
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="1">
    </el-pagination>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
export default {
  name: 'modelist',
  components: {},
  data() {
    return {
      tableData: [
        {
          name: '住友',
          ff: '管理员',
          cjtime: '2017-10-23',
          je: '1000元',
          gs: '400个',
          lq: '230'
        }
      ]
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {},
  methods: {
    handleCurrentChange(val) {
    }
  }
}
</script>
<style>
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
</style>
