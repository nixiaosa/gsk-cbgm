<template>
  <div class="votedetail">
    <header-content :title="headerTitle + getData.topicTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="xinxi-item">
      <span class="xinxi-title">活动标题:</span>
      <span>{{ getData.topicTitle }}</span>
    </div>
    <div class="xinxi-item">
      <span class="xinxi-title">活动时间</span>
      <span>{{ getData.startTime | formatDate}}</span> -
      <span>{{ getData.endTime | formatDate}}</span>
    </div>
    <div class="xinxi-item itemImg">
      <span class="xinxi-title">活动封面:</span>
      <img :src="getData.topicCoverPage"  alt="" class="Isimg">
    </div>
    <div class="xinxi-item cove">
      <span class="xinxi-title">活动规则:</span>
      <div class="area intro-content ql-editor"  v-html="getData.topicVoteRule"></div>
    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
import { formatDate } from '@/common/data'
export default {
  name: 'votedetail',
  components:{
    HeaderContent
  },
  data() {
    return {
      headerTitle: '（旧）投票活动管理 > 活动详情 > ',
      opertions: ['返回'],
      id: this.$route.params.id,
      getData: {
        topicTitle: '',
        topicCoverPage: '',
        topicVoteRule: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  filters:{
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  mounted() {
    this.votedetail()
  },
  methods: {
    votedetail: async function () {
      var params = {
        id: this.id
      }
      const res = await http.post(api.votedetail,params)
      if (res.data.code === 0) {
        this.getData = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    },
    headerClick() {
      this.$router.push({
        path: '/activity/vote',
        query: {
          page: this.$route.query.page
        }
      })
    }
  }
}
</script>
<style scoped>
.votedetail .xinxi-item {
  margin-left: 20px;
  margin-top: 20px;
}
.votedetail .xinxi-item .xinxi-title{
  display: inline-block;
  margin-right: 20px;
}
.cove{
  position: relative;
}
.cove .area {
  width: auto;
  min-height: 150px;
  max-height: auto;
  padding-top: 30px;
}
.itemImg{
  height: 220px;
  position: relative;
}
.Isimg{
  width:200px;height:200px;
  position: absolute;
  top: 0;
  left: 88px;
}
</style>


