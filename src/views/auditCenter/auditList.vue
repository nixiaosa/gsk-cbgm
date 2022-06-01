<template>
  <div class="auditList">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="createTime"
          format="yyyy-MM-dd HH:mm"
          type="datetime"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="formInline.topicTitle" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="创建者">
        <el-input v-model="formInline.nickname" placeholder="请输入创建者姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
    >
      <el-table-column label="列表名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statesName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="340px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="update(scope.row.id)" v-if="scope.row.states >= 0 && scope.row.states < 3" type="info">编辑</el-button>
          <el-button size="mini" @click="auditDelete(scope.row.id)" v-if="scope.row.states === 0" type="danger">删除</el-button>
          <el-button size="mini" @click="auditCheck(scope.row.id)" v-if="scope.row.states > 0" type="info">查看</el-button>
          <el-button size="mini" @click="goStatistics(scope.row.id, scope.row.rank)" v-if="scope.row.states >= 2" type="info">统计信息</el-button>
          <el-button size="mini" @click="auditEnd(scope.row.id)" v-if="scope.row.states === 2" type="danger">结束审核 </el-button>
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
    name: "auditList",
    components: {
      HeaderContent
    },
    data() {
      return {
        headerTitle: '审核中心-->审核列表',
        opertions: ['创建审核信息'],
        currentPage: 1,
        total: 1,
        createTime: '',
        statusList: [
          { label: '全部' },
          { label: '未发布', status: 0 },
          { label: '未开始', status: 1 },
          { label: '进行中', status: 2 },
          { label: '已结束', status: 3 },
        ],
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
    activated() {
      this.getList()
    },
    created() {
      this.getList()
    },
    methods:{
      handleCurrentChange() {
        this.getList()
      },
      /*
      * 结束任务
      * */
      auditEnd(id) {
        http.get(api.auditTaskEnd + id).then(res => {
          if (res.data.code === 0) {
            this.successMessage('结束成功')
            this.getList()
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      /*
      * 删除审核任务
      * */
      auditDelete(id) {
        http.get(api.audittaskdelete + id).then(res => {
          if (res.data.code === 0) {
            this.successMessage('删除成功')
            this.getList()
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      /*
      * 查看统计信息
      * */
      goStatistics(id, rank) {
        this.$router.push({path: '/audit/audittj/' + id + '/' + rank})
      },
      getList() {
        let params = {
          pageSize: 10,
          pageNum: this.currentPage,
          params: {
            states: this.formInline.status,
            createTime: this.createTime === '' ? this.createTime = null : this.createTime,
            name: this.formInline.topicTitle,
            createUserName: this.formInline.nickname
          }
        }
        http.post(api.audittaskList, params).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.total = data.data.total
            this.dataList = data.data.data
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
      },
      headerClick() {
        http.get(api.audittaskDetails + 0).then(res => {
          this.$router.push({path : '/audit/createAudit/' + res.data.data.id})
        })
      },
      update(id) {
        this.$router.push({path : '/audit/createAudit/' + id})
      },
      auditCheck(id) {
        this.$router.push({path : '/audit/createAudit/' + id + '/' + false})
      },
      onSubmit() {
        this.currentPage = 1
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
