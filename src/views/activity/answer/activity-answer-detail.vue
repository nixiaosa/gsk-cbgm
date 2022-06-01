<template>
  <div class="casedetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="活动详情" name="first">
        <AnswerDetail :id="id"></AnswerDetail>
      </el-tab-pane>
      <el-tab-pane label="参与用户列表" name="second">
        <Participants :id="id" :page="page"></Participants>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import AnswerDetail from './base/answerDetail'
  import Participants from './base/participants'
  import { formatDate } from '@/common/data'
  export default {
    name: "caseActivityDetail",
    components: {
      HeaderContent,
      AnswerDetail,
      Participants
    },
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      }
    },
    created() {
      if (this.$route.query) {
        if (this.$route.query.name) {
          this.activeName = this.$route.query.name
        }
      }
    },
    data() {
      return {
        headerTitle: '线上答题管理--》线上答题详情',
        opertions: ['返回'],
        activeName: 'first',
        id: this.$route.params.id,
        page: this.$route.query.page
      }
    },
    mounted() {
      // this.caseActivityDetail()
    },
    methods: {
      headerClick() {
        this.$router.push({
          path: '/activity/answerManage',
          query: {
            page: this.$route.query.page
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
