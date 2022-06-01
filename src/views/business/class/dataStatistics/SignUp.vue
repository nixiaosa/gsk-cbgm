<template>
  <div>
    <el-button style="float: right" type="primary" :loading="exportLoading" @click="exportList">导出</el-button>
    <table-list name="SignUp" :data="dataList"/>
    <pagination :total="total" @change="pageChange"/>
  </div>
</template>

<script>
    import TableList from "@/components/table-content/TableList";
    import Pagination from "@/components/pagination/Pagination";
    export default {
      components: {Pagination, TableList},
      data() {
        return {
          dataList: [],
          exportLoading: false,
          page: {
            pageSize: 10,
            pageNum: 1
          },
          total: 0,
        }
      },
      mounted() {
        this.getSignUp()
      },
      methods: {
        exportList() {
          // 导出列表
          this.exportLoading = true
          let params = {
            params: {
              busId: this.$route.params.id
            }
          }
          this.$http.post(this.$api.signUp.export, params).then(res => {
            let {code, data, message} = res.data
            this.exportLoading = false
            if (code === 0) {
              window.location.href = data
            } else {
              this.$message.error(message)
            }
          })
        },
        pageChange(item) {
          // 分页器触发
          this.page = item
          this.getSignUp()
        },
        getSignUp() {
          // 获取报名列表
          let params= {
            ...this.page,
            params: {
              busId: this.$route.params.id
            }
          }
          this.$http.post(this.$api.signUp.list, params).then(res => {
            let {code, data, message} = res.data
            if (code === 0) {
              console.log(data);
              this.dataList = data.list
              this.total = data.total
            } else {
              this.$message.error(message)
            }
          })
        },
      }
    }
</script>
