<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-table :data="tableData" border style="margin-bottom: 20px;">
      <el-table-column label="支出方">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入方">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.zc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.je }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.fs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.zt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      >
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="1">
    </el-pagination>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent
  },
  data() {
    return {
      searchVal: '',
      headerTitle: '订单管理',
      tableData: [
        // {
        //   name: '住友',
        //   zc: '住友',
        //   sr: '医百科技',
        //   je: '4000',
        //   time: '2017-10-18',
        //   fs: '银行转账',
        //   zt: '交易完成',
        //   yy: ''
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
  },
  mounted() {},
  methods: {
    searchClick() {},
    handleCurrentChange(val) {}
  }
}
</script>
<style>
</style>
