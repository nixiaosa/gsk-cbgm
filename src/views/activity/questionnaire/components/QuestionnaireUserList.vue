<!--
 * @Author: your name
 * @Date: 2021-01-11 21:53:44
 * @LastEditTime: 2021-02-01 15:41:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/activity/questionnaire/components/QuestionnaireUserList.vue
-->
<template>
    <div>
      <search-form name="QuestionnaireUserList" @change="searchChange"/>
      <table-list name="QuestionnaireUserList" :data="data.list"/>
      <el-pagination
        style="margin-top: 20px"
        background
        :current-page="pageNum"
        @current-change="pageNumChange"
        layout="total, prev, pager, next"
        :total="data.total">
      </el-pagination>
    </div>
</template>

<script>
  import SearchForm from '@/components/search/SearchForm'
  import TableList from '@/components/table-content/TableList'
  export default {
    name: 'QuestionnaireUserList',
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      SearchForm,
      TableList
    },
    data() {
      return {
        phone: '',
        pageNum: 1,
        dataList: [],
        total: 100
      }
    },
    methods: {
      searchChange(item) {
        // 搜索触发
        if (item.prop === 'SEARCH') {
          let params = {
            num: 1,
            phone: item.phone
          }
          this.pageNum = 1
          this.phone = item.phone
          this.$emit('change', params)
        }

      },
      pageNumChange(num) {
        // 切换分页触发
        this.pageNum = num
        let params = {
          num: this.pageNum,
          phone: this.phone
        }
        this.$emit('change', params)
      }
    }
  }
</script>

<style scoped>
.totalUser {
}
</style>
