<template>
    <div class="caseDetail">
      <header-content @header-btn-click="headerChanage" :opertions="headerPorp" :title="headerTitle"></header-content>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="已签约" name="1"></el-tab-pane>
        <el-tab-pane label="未签约" name="0"></el-tab-pane>

        <el-tabs v-model="auditActiveName" @tab-click="tabChange" v-if="contractType == 1 && activeName == 1">
          <el-tab-pane :label="`未审核` + `（` + notAudit + `）` " name="0"></el-tab-pane>
          <el-tab-pane :label="`已审核` + `（` + hasAudit + `）` " name="1"></el-tab-pane>
          <el-tab-pane :label="`已驳回` + `（` + hasReject+ `）` " name="2"></el-tab-pane>
        </el-tabs>


        <div>
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="手机号">
              <el-input v-model="search.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item style="">
              <el-button type="primary" @click="caseActivityDetail(1)">查询</el-button>
              <el-button :loading="isLoading" :disabled="tableDatas.data ? false : true" type="primary" @click="exportContract">导出</el-button>
              <span style="margin-left:10px" v-if="contractType == 1 && activeName == 1">
                 <el-button type="primary" @click="contractDownload()" v-if="auditActiveName == 1">下载合约</el-button>
              </span>
              <span style="margin-left:10px" v-if="contractType == 0 && activeName == 1">
                 <el-button type="primary" @click="contractDownload()">下载合约</el-button>
              </span>
            </el-form-item>
          </el-form>
        </div>
        <contract-detail-tab-list :table-datas="tableDatas" />
      </el-tabs>
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
  import HeaderContent from '@/components/header-content'
  import ContractDetailTabList from './ContractDetailTabList'
  import { formatDate } from '@/common/data'
  export default {
    name: "caseDetail",
    components: {
      HeaderContent,
      ContractDetailTabList
    },
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
    },
    data() {
      return {
        contractType: this.$route.query.contractType,
        auditStatus: "",
        notAudit: "",
        hasAudit: "",
        hasReject: "",
        currentPage: 1,
        activeName: '1',
        auditActiveName: '0',
        isLoading: false,
        tableDatas: {},
        total: 0,
        search: {
          phone: null
        },
        headerPorp: ['返回'],
        headerTitle: '签约详情'
      }
    },
    mounted() {
      this.caseActivityDetail()
    },
    methods: {
      contractDownload(){
        let params = {
          contractId: this.$route.params.id
        }
        http.post(api.contractDownload, params).then(res => {
          let {code, data, message} = res.data
          if (code === 0) {
            window.location.href = data
            this.$message.success('下载成功')
          } else {
            this.$message.error(message)
          }
        })
      },
      tabChange() {
        this.currentPage = 1
        this.caseActivityDetail()
      },
      exportContract() {
        this.isLoading = true
        // 导出
        let params = {
          contractId: this.$route.params.id,
          status: this.activeName
        }
        if( this.contractType == 1 && this.activeName == 1){ // 手签增加 auditStatus字段
          params.auditStatus = this.auditActiveName
        }
        http.post(api.exportContract, params).then(res => {
          let {code, data, message} = res.data
          this.isLoading = false
          if (code === 0) {
            window.location.href = data
            this.$message.success('导出成功')
          } else {
            this.$message.error(message)
          }
        })
      },
      handleCurrentChange(num) {
        // 切换分页
        this.currentPage = num
        this.caseActivityDetail()
      },
      handleClick() {
        // 切换tab
        this.currentPage = 1
        this.caseActivityDetail()
      },
      headerChanage() {
        this.$router.back()
      },
      caseActivityDetail: async function() {
        let params = {
          templateId: this.$route.params.templateId,
          contractId: this.$route.params.id,
          pageSize: 10,
          pageNum: this.currentPage,
          status: this.activeName,
          phone: this.search.phone === '' ? null : this.search.phone,
        }
        if( this.contractType == 1 && this.activeName == 1){ // 手签增加 auditStatus字段
          params.auditStatus = this.auditActiveName
        }
        const res = await http.post(api.contractDetail, params)
        if (res.data.code === 0) {
          if (res.data.data) {
            this.tableDatas = res.data.data.result
            this.total = res.data.data.total
            this.notAudit = res.data.data.result.auditWait
            this.hasAudit = res.data.data.result.auditSuccess
            this.hasReject = res.data.data.result.auditFailed
          } else {
            this.tableDatas = {}
            this.total = 0
          }
         } else {
           this.$message.error(res.data.message)
        }
      }
    }
  }
</script>

<style scoped>
.caseDetail .wrap {
  margin-left: 20px;
  margin-top: 20px;
}
.caseDetail .wrap .titles {
  display: inline-block;
  width: 130px;
  margin-right: 20px;
}
.caseDetail .area {
  width: 800px;
  min-height: 150px;
  padding-top: 30px;
}
.forbiddenBox {
  padding-bottom: 20px;
  padding-top: 10px;
}
.forbiddenBox span {
  font-size: 14px;
}
::v-deep .el-form-item__label {
  width: 82px;
}
.forbidden-info {
  font-size: 14px;
  padding-left: 20px;
  color: #666;
}
</style>
