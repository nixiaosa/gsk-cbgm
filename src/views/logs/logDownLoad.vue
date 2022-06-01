<template>
  <div class="auditList">
    <header-content :title="headerTitle"></header-content>
    <div style="margin-bottom:20px">
    <el-date-picker
      v-model="searchForm.time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
      @change="seachCompany"
    >
    </el-date-picker>
    <el-button type="primary" @click="search" style="margin-left:20px">申请导出</el-button>
  </div>
    <el-table
      :data="dataList"
      border
    >
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志数据包">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="downLoad(scope.row.url)">下载</el-button>
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
    name: "logdownload",
    components: {
      HeaderContent
    },
    data() {
      return {
        headerTitle: '日志下载',
        currentPage: 1,
        total: 1,
        createTime: '',
        dataList: [],
        start: '',
        end: '',
        searchForm: {
          time: []
        },
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
      downLoad(url){
       window.open(url);
      },
      search: async function() {
        var params = {
          start: this.start,
          end: this.end,
        }
        var res = await http.post(api.logDown, params)
        if (res.data.code === 0) {
          this.getList(1)
        }else{
          this.errorMessage(res.data.message)
        }
      },
      seachCompany() {
        this.start = this.searchForm.time[0]
        this.end = this.searchForm.time[1]
      },
      handleCurrentChange() {
        this.getList()
      },
      getList() {
        let params = {
          pageSize: 10,
          pageNum: this.currentPage
        }
        http.post(api.logDownList, params).then(res => {
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
