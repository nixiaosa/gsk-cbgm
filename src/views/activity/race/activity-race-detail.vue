<!--
 * @Author: your name
 * @Date: 2020-12-10 13:56:17
 * @LastEditTime: 2020-12-16 11:55:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/activity/race/activity-race-detail.vue
-->
<template>
  <div class="casedetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="每日竞赛统计" name="first">
        <DayStatistics v-if="activeName === 'first'" :id="id" :page="page"></DayStatistics>
      </el-tab-pane>
      <el-tab-pane label="总排名统计" name="second">
        <TotalStatistics v-if="activeName === 'second'" :id="id" :page="page"></TotalStatistics>
      </el-tab-pane>
      <el-tab-pane label="团队排名统计" name="third">
        <TeamStatistics v-if="activeName === 'third'" :id="id" :page="page"></TeamStatistics>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import DayStatistics from './base/dayStatistics'
  import TotalStatistics from './base/totalStatistics'
  import TeamStatistics from './base/teamStatistics'
  import { formatDate } from '@/common/data'
  export default {
    name: "raceActivityDetail",
    components: {
      HeaderContent,
      DayStatistics,
      TeamStatistics,
      TotalStatistics
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
        headerTitle: '线上竞赛管理--》线上竞赛详情',
        opertions: ['返回'],
        activeName: 'first',
        id: this.$route.params.id,
        page: this.$route.query.page,
        // showDetail: false
      }
    },
    mounted() {
      // this.caseActivityDetail()
    },
    methods: {
      headerClick() {
        this.$router.push({
          path: '/activity/raceManage',
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
