<template>
  <div>
    <header-content :title="headerTitle"/>
    <questionnaire-aliases/>
    <search-form :loading="searchLoading" @change="searchChange" name="QuestionnaireManage"/>
    <table-list :data="listData" name="QuestionnaireManage" @change="tableListChange"/>
    <el-pagination
        style="margin-top: 20px"
        background
        :current-page="pageNum"
        @current-change="pageNumChange"
        layout="total, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
import http from '@/utils/tenant'
import SearchForm from '@/components/search/SearchForm'
import HeaderContent from '@/components/header-content'
import TableList from '@/components/table-content/TableList'
import QuestionnaireAliases from "@/views/activity/questionnaire/questionnaireManageVersion/QuestionnaireAliases";
import api from "@/api/tenantInfoSave";

export default {
  name: 'questionnaireManage',
  components: {
    QuestionnaireAliases,
    HeaderContent,
    TableList,
    SearchForm
  },
  data() {
    return {
      listData: [],
      pageNum: parseInt(this.$route.query.page) || 1,
      total: 0,
      searchLoading: false,
      headerTitle: '调研问卷管理',
      xlsUrls: '',
    }
  },
  mounted() {
    this.getQuestionnaireList()
  },
  methods: {
    tableListChange(item) {
      // 列表按钮触发
      if (item.btnName.prop === 'END') {
        this.questionnaireFinish(item.id)
      } else if(item.btnName.prop === "STOP" || item.btnName.prop === "START") {
        this.questionnaireStop(item.id, item.btnName.prop)
      } else if (item.btnName.prop === 'CHECK') {
        this.$router.push({path: `questionnaireDetails/${item.id}`})
      } else if(item.btnName.prop === "EXPORT") {
        this.photoExport(item.id)
      } else if(item.btnName.prop === "EXPORTDATA") {
        this.$router.push({
          path: `questionnaireDetails/${item.id}`,
          query: {
            active: "exportList"
          }
        })
      } else if (item.btnName.prop === "APPLYMANAGE"){
        this.$router.push({
          path: "questionnaireManage/applylist/" + item.id,
          query: {
            isAutoAudit: item.autoAudit
          }
        });
      }
    },
    // 停/启用
    async questionnaireStop(id, prop) {
      var res = await http.get(api.questionnaireStop + id)
      let {code, message} = res.data
      if (code === 0) {
        if (prop === "STOP") {
          this.$message.success('停用成功')
        } else if(prop === "START") {
          this.$message.success('启用成功')
        }
        this.getQuestionnaireList()
      } else {
        this.$message.error(message)
      }
    },
    // 导出证件照
    async photoExport(id) {
      var res = await http.post(api.questionnaireExportIdPhotoList + id)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.xlsUrls = res.data.data
        window.open(this.xlsUrls)
      } else {
         this.$message.error(res.data.message)
      }
    },
    questionnaireFinish(id) {
      // 结束问卷
      http.post(this.$api.questionnaireFinish + id).then(res => {
        let {code, message} = res.data
        if (code === 0) {
          this.$message.success('结束成功')
          this.getQuestionnaireList()
        } else {
          this.$message.error(message)
        }
      })
    },
    pageNumChange(num) {
      // 切换分页器时触发
      this.pageNum = num
      this.getQuestionnaireList()
      // 页面切换后 回到当前分页
      this.$router.push({
        query: {
          page: num
        }
      })
    },
    searchChange(item) {
      // 搜索触发
      this.pageNum = 1
      this.getQuestionnaireList(item)
      this.searchLoading = true
    },
    getQuestionnaireList(search) {
      // 获取调研问卷管理列表
      let params = {
        ...search,
        questionName: search ? search.title : null,
        creater: search ? search.creater : null,
        pageSize: 10,
        pageNum: this.pageNum ? this.pageNum : 1
      }
      http.post(this.$api.questionnaireList, params).then(res => {
        this.searchLoading = false
        let {code, data, message} = res.data
        if (code === 0) {
          let list = data.list
          list.map(item => {
            if (item.status > 0 && item.status < 4) {
              item.END = true
            }
            if (item.isCredentials) {
              item.EXPORT = true
            }
            if (item.stop) {
              item.START = true
            } else {
              item.STOP = true
            }
          })
          this.listData = data.list
          this.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
