<template>
  <div class="auditList">
    <header-content :title="headerTitle"></header-content>
    <el-table
      :data="dataList"
      border
    >
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.dateTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容">
        <template slot-scope="scope">
          <span>{{ scope.row.event }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作IP">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: "loadList",
    components: {
      HeaderContent
    },
    data() {
      return {
        headerTitle: '操作日志',
        currentPage: 1,
        total: 1,
        createTime: '',
        dataList: [],
        formInline:{
          status: null,
          topicTitle: null,
          nickname: null
        }
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    // activated() {
    //   this.getList()
    // },
    created() {
      this.getList()
    },
    methods:{
      handleCurrentChange() {
        this.getList()
      },
      getList() {
        let params = {
          pageSize: 10,
          pageNum: this.currentPage
        }
        http.post(api.logList, params).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.total = data.data.total
            this.dataList = data.data.list
          } else {
            this.errorMessage(data.message)
          }
        })
      },
      /*
      * 成功消息提示
      * */
      successMessage(val) {
        this.$message({
          showClose: true,
          message: val,
          type: 'success'
        })
      },
      /*
      * 错误消息提示
      * */
      errorMessage(val) {
        this.$message({
          showClose: true,
          message: val,
          type: 'error'
        })
      }
    }
  }
</script>

<style scoped>

</style>
