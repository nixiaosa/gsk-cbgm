<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-table
      :data="tableDatas"
      border
    >
      <el-table-column label="序号" width="100px">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="280px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业">
        <template slot-scope="scope">
          <span>{{ scope.row.profession }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门诊名称">
        <template slot-scope="scope">
          <span>{{ scope.row.outpatient }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | formatDates}}</span>
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
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  import { mapGetters } from "vuex";
  export default {
    name: "saleRelateList",
    components: {
      HeaderContent
    },
    computed: {},
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      formatDates(time) {
        var date = new Date(time)
        if(time){
          return formatDate(date,'yyyy-MM-dd hh:mm')
        } else {
          ""
        }
      },
    },
    data() {
      return {
        isDis: false,
        headerTitle: '关联列表',
        currentPage: 1,
        total: 1,
        ends: false,
        id: '2',
        articleId: '',
        videoId: '',
        endId: '',
        tableDatas: [],
        articleOptions: [],
        videoOptions: [],
        formInline: {
          type: null,
          start: null,
          end: null,
          title: null,
        },
        editForm: {
          id: null,
          type: '1',
          title: '',
          content: '',
          effectiveDate: null,
          sourceId: null,
          visibilityType: "HCP"
        }
      }
    },
    mounted() {
      this.getVerifyUsers(this.currentPage);
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      getVerifyUsers: async function(pageNum) {
        let params = {}
        params = {
            pageNum: pageNum,
            pageSize: 10,
            id: this.$route.query.id
        }
        const res = await http.post(api.saleVerifyUsers,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleCurrentChange(val) {
        this.getVerifyUsers(val)
        this.currentPage = val
      },
    }
  }
</script>

<style scoped>

</style>
