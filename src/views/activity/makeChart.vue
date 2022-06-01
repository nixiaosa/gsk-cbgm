<template>
  <div class="make">
    <header-content :title="headerTitle + title" :opertions="opertions" @header-btn-click="headerClick"></header-content>
     <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="formInline.operationName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <TableContent :page="newpage" :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></TableContent>
    <div class="pagina"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="20">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
export default {
  name: 'make',
  components: {
    HeaderContent,
    TableContent
  },
  data() {
    return {
      headerTitle: '（旧）投票活动管理 > 排行榜 > ',
      opertions: ['返回'],
      title: this.$route.query.title,
      newpage: 1,
      total: 1,
      formInline: {
        operationName: null
      },
      tableData: [],
      tableConfig: [
        { label: '编号',prop: 'operationNumber' },
        { label: '名称',prop: 'operationName' },
        { label: '得票数',prop: 'operationTotal' },
        { label: '操作', prop: 'action' }
      ]
    }
  },
  mounted() {
    this.makeChart(this.newpage)
  },
  created() {
    if (this.$route.query.pages) {
      let page = Number(this.$route.query.pages)
      this.newpage = page
    }
  },
  methods: {
    makeChart: async function (page) {
      this.formInline.voteId = this.$route.params.id
      let params = {}
      var paramsData = {
        pageNum: page,
        pageSize: 20,
        params: {
          voteId: this.$route.params.id
        }
      }
      var paramsData1 = {
        pageNum: page,
        pageSize: 20,
        params: this.formInline
      }
      if (this.formInline.operationName === null || this.formInline.operationName === '') {
        params = paramsData
      } else {
        params = paramsData1
      }
      const res = await http.post(api.makeChart,params)
      if (res.data.code === 0) {
       this.tableData = res.data.data.list
       this.tableData.forEach((element,index) => {
         element.index = ((this.newpage -1)*20) + index + 1
         element.action = ['详情']
       })
       this.total = res.data.data.total
      } else {
        this.$message(res.data.message)
      }
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.makeChart(val)
    },
    onSubmit() {
      this.makeChart(this.newpage)
    },
    headerClick() {
      this.$router.push({
        path: '/activity/vote',
        query: {
          page: this.$route.params.page
        }
      })
    },
    tabRes(row) {
      var id = row.id
      this.$router.push({
        path: '/activity/makeChartdetail/' + id + '/' + this.$route.params.page,
        query: {
          pages: this.newpage,
          voteId: this.$route.params.id,
          title: this.title
        }
      })
    }
  }
}
</script>
<style scoped>
.pagina{
  margin: 20px;
}
</style>


