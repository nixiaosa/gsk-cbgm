<!--
 * @Author: your name
 * @Date: 2020-08-31 13:06:55
 * @LastEditTime: 2021-09-23 10:25:22
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/caseVote/caseActivityDetail.vue
-->
<template>
  <div class="casedetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <styleSetDetail v-if="activeName === 'first'" :id="id"></styleSetDetail>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import styleSetDetail from './base/styleSetDetail'
  import Participants from './base/participants'
  import statiStical from './base/statisticalAnalysis'
  import Detail from './base/casedetails'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    // name: "caseActivityDetail",
    name: "styleSet",
    components: {
      HeaderContent,
      styleSetDetail,
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
        headerTitle: '投票管理-->外观设置',
        opertions: ['返回'],
        activeName: 'first',
        // id: this.$route.params.id,
        id: String(this.$route.query.voteId),
        page: this.$route.query.page
      }
    },
    activated() {
      // this.id = this.$route.params.id
      this.id = String(this.$route.query.voteId)
    },
    mounted() {
      // this.caseActivityDetail()
    },
    methods: {
      headerClick() {
        this.$router.push({
          // path: '/activity/caseCollection',
          path: '/activity/normalVoteV3',
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
