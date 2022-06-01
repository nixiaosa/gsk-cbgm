<template>
  <div class="management">
    <header-content :title="headerTitle"></header-content>
    <el-table
    :data="tableData"
    border
    >
    <el-table-column label="姓名">
      <template slot-scope="scope">
        <span>{{ scope.row.userName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="性别">
      <template slot-scope="scope">
        <span>{{ scope.row.sex }}</span>
      </template>
    </el-table-column>
    <el-table-column label="手机号码">
      <template slot-scope="scope">
        <span>{{ scope.row.phone }}</span>
      </template>
    </el-table-column>
    <el-table-column label="角色">
      <template slot-scope="scope">
        <span>{{ scope.row.roleName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="身份">
      <template slot-scope="scope">
        <span>{{ scope.row.frontName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="资金余额">
      <template slot-scope="scope">
        <span>{{ scope.row.amount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template slot-scope="scope">
        <span>{{ scope.row.createtime | formatDate}}</span>
      </template>
    </el-table-column>
    <el-table-column label="资金明细数据">
      <template slot-scope="scope">
        <el-button type="info" @click="godetail(scope.row.userId,scope.row.userName,scope.row.amount)" size="small">查看</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div style="margin: 20px;"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
export default {
  name: 'management',
  components:{
    HeaderContent
  },
  data() {
    return {
      tableData: [],
      newpage: 1,
      total: 1,
      headerTitle: '资金管理'
    }
  },
  filters:{
    formatDate(time) {
      if (!time) {
        return ''
      }
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page)
      this.newpage = page
    } else {
      this.newpage = this.newpage
    }
  },
  methods: {
    godetail(id,userName,amount) {
      let page = this.newpage
      if (userName) {
        this.$router.push({
          path: 'funds/' + id + '/' + page + '?amount=' + amount + '&userName=' + userName
        })
      } else {
        this.$router.push({
          path: 'funds/' + id + '/' + page + '?amount=' + amount
        })
      }
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.capitalList(this.newpage)
    },
    capitalList: async function (page) {
      var params1 = {
        pageNum: page,
        pageSize: 10,
        params: {
          businessId: 2
        }
      }
      const res = await http.post(api.capitalList,params1)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    }
  },
  mounted() {
    this.capitalList(this.newpage)
  },
}
</script>
<style scoped>

</style>


