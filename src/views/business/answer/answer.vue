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
          <span style="margin-left: 10px">{{ scope.row.cjtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.kstime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.jstime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="问卷份数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.fs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="参与人数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.rs }}</span>
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
    layout="prev, pager, next"
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
        // {
        //   name: '住友',
        //   mc: '知识点',
        //   js: '医学直播',
        //   cj: '宋欣',
        //   cjtime: '2017-10-23',
        //   kstime: '2017-10-24',
        //   jstime: '2017-10-26',
        //   fs: '1',
        //   rs: '321'
        // }
      ]
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
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
