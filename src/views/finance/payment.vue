<template>
  <div class="modelist">
    <!--<el-input-->
    <!--style="width:200px;margin-bottom:15px;"-->
    <!--placeholder="搜索"-->
    <!--icon="search"-->
    <!--v-model="searchVal"-->
    <!--:on-icon-click="searchClick">-->
    <!--</el-input>-->
    <header-content :title="headerTitle"></header-content>
    <el-table :data="tableData" border style="margin-bottom: 20px;">
      <el-table-column label="支出方">
        <template slot-scope="scope">
          <span>{{ scope.row.send }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入方">
        <template slot-scope="scope">
          <span>{{ scope.row.get }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原因">
        <template slot-scope="scope">
          <span>{{ scope.row.why }}</span>
        </template>
      </el-table-column>
      >
    </el-table>
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="10">
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
      headerTitle: '支付管理',
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
    searchClick() {},
    handleCurrentChange(val) {}
  }
}
</script>
<style>
</style>
