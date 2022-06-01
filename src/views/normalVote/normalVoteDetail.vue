<!--
 * @Author: your name
 * @Date: 2020-08-31 13:06:55
 * @LastEditTime: 2020-10-14 11:04:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/caseVote/caseActivityDetail.vue
-->
<template>
  <div class="casedetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <CaseDetail v-if="activeName === 'first'" :id="id"></CaseDetail>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import CaseDetail from './base/caseDetail'
  import Participants from './base/participants'
  import statiStical from './base/statisticalAnalysis'
  import Detail from './base/casedetails'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    // name: "caseActivityDetail",
    name: "normalVoteDetail",
    components: {
      HeaderContent,
      CaseDetail,
      Participants,
      statiStical,
      Detail
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
        headerTitle: '投票管理-->详情',
        opertions: ['返回'],
        activeName: 'first',
        id: this.$route.params.id,
        page: this.$route.query.page
      }
    },
    activated() {
      this.id = this.$route.params.id
    },
    mounted() {
      // this.caseActivityDetail()
    },
    methods: {
      headerClick() {
        this.$router.push({
          // path: '/activity/caseCollection',
          path: '/activity/normalVote',
          query: {
            page: this.$route.query.page
          }
        })
      },
      handleClick(tab, event) {
      },

    }
  }
</script>

<style scoped>

</style>
