<template>
  <div class="modelist">
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="性别">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电子邮箱">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="机构">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.jigou }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="省份">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sf }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="城市">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.cs }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="区县">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.qx }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.js }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.creationTime }}</span>
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      layout="prev, pager, next"
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
      tableData: [
        {
          name: '陈威',
          sex: '男',
          phone: '17600079797',
          email: '17600079797@163.com',
          jigou: '',
          sf: '山东省',
          cs: '济宁市',
          qx: '金乡县',
          js: '医生',
          creationTime: '2017-10-12'
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
