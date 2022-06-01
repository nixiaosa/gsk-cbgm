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
        label="名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.mc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="介绍">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.js }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.cj }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ks }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.jstime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="观看人数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.rs }}</span>
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      layout="prev, pager, next"
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
          mc: '培训',
          js: '机构培训',
          cj: '王凯',
          time: '2017.10.22',
          ks: '2017.10.23',
          jstime: '2017.10.26',
          rs: '109'
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
