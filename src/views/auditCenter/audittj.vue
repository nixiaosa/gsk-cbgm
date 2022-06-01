<template>
  <div class="audittj">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div style="margin:20px 0;"></div>
    <ul class="myTab">
      <li v-for="(item,index) in items" v-if="index < rank" :key="index" :class="{'active':isActive==index}" class="normal" @click="changeTab(index)">{{ item }}</li>
      <li class="downData">
        <el-button type="info" size="medium" @click="downData">导出结果</el-button>
      </li>
    </ul>
    <TableContent :tableConfig="tableConfig" :tableData="tableData" :page="page" @change="tabRes"></TableContent>
    <div style="margin: 20px;"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import TableContent from '@/components/table-content'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: "audittj",
    components: {
      HeaderContent,
      TableContent
    },
    data() {
      return {
        rankNum: 1,
        headerTitle: '审核中心-->审核列表-->统计信息',
        opertions: ['返回'],
        rank: this.$route.params.rank - 0,
        num: 0,
        page: 1,
        total: 1,
        IsInfo: false,
        IsInfosl: false,
        isActive: 0,
        tableData: [],
        items: ['一级审核','二级审核','三级审核'],
        tableConfig: [
          { label: '序号' },
          { label: '审核人姓名',prop: 'approveUserName' },
          { label: '审核区域',prop: 'provinceName' },
          { label: '病例提交者',prop: 'commitUserName' },
          { label: '审核内容',prop: 'approveContent' },
          { label: '审核时间',prop: 'approveTime' },
        ]
      }
    },
    created() {
      this.getList(1)
    },
    methods: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      getList() {
        let params = {
          pageSize: 10,
          pageNum: this.page,
          params: {
            auditTaskId: this.$route.params.id,
            rank: this.rankNum
          }
        }
        http.post(api.auditTaskTtatistics, params).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            this.tableData = data.data
            this.tableData.forEach(element => {
              element.approveTime = this.formatDate(element.approveTime)
            })
            this.total = data.total
          } else {
            this.errorMessage(res.data.message)
          }
        })
        // auditTaskTtatistics
      },
      headerClick() {
        this.$router.back()
      },
      changeTab(index) {
        this.isActive = index
        this.rankNum = index + 1
        let x = { label: '审核区域',prop: 'provinceName' }
        let y = { label: '审核区域总数',prop: 'provinceNum' }
        if (index + 1 > 1) {
          this.tableConfig[2] = y
        } else {
          this.tableConfig[2] = x
        }
        this.getList()
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
      tabRes() {},
      handleCurrentChange(val) {
        this.page = val
        this.getList()
      },
      downData() {
        http.get(api.auditExport + this.$route.params.id).then(res => {
          if (res.data.code === 0) {
            window.open(res.data.data)
          } else {
            this.errorMessage(res.data.message)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.audittj ul,li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.myTab{
  overflow: hidden;
  position: relative;
}
.normal {
  width: 142px;
  line-height: 50px;
  margin-right: 5px;
  margin-bottom: 10px;
  background: #ffffff;
  text-align: center;
  border: 1px solid #eeeeee;
  float: left;
  color:  black;
  cursor: pointer;
}
.active{
  background: $c-theme;
  color: #ffffff;
}
.downData{
  position: absolute;
  top: 14px;
  right: 0;
}
</style>
