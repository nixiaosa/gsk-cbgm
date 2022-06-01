<template>
  <div class="modelist">
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="省份">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column
        label="城市">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column
        label="地区">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column
        label="介绍">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="100">
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
      tableData: []
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
