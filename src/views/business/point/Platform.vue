<template>
  <div class="Platform">
    <header-content :title="headerTitle"></header-content>
    <!-- <div style="margin: 20px;"></div> -->
    <el-table
     :data="tableData"
      border
    >
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
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
      <el-table-column label="积分余额">
        <template slot-scope="scope">
          <span>{{ scope.row.point }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
       <el-table-column label="积分明细">
        <template slot-scope="scope">
          <el-button type="info" @click="godetail(scope.row.userId,scope.row.nickname,scope.row.point)" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
export default {
  name: 'Platform',
  components:{
    HeaderContent,
    TableContent
  },
  data () {
    return {
      tableData: [],
      headerTitle: '平台积分管理',
      page: 1,
      total: 1
    }
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page)
      this.page = page
    } else {
      this.page = this.page
    }
  },
  mounted() {
    this.platformPointList(this.page)
  },
  methods: {
    godetail(id,nick,point) {
       let page = this.page
      if (nick) {
        this.$router.push({
          path: 'Platformdetail/' + id + '/' + page + '?point=' + point + '&nick=' + nick
        })
      } else {
        this.$router.push({ path: 'Platformdetail/' + id + '/' + page + '?point=' + point })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.platformPointList(val)
    },
    platformPointList: async function (page) {
      var params1 = {
        pageNum: this.page,
        pageSize: 10,
        params: {
          businessId: 2
        }
      }
      const res = await http.post(api.platformPointList,params1)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style scoped>

</style>


