<template>
  <div id="modulelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <h2 class="luckname">{{ name }}</h2>
    <el-button class="btn" v-if="isInfo" type="primary">游戏详情</el-button>
    <el-button class="btns" v-if="!isInfo" @click="changeTab">游戏详情</el-button>
    <el-button class="btns" v-if="isInfo" @click="changeTab">关联业务</el-button>
    <el-button class="btn" v-if="!isInfo" type="primary">关联业务</el-button>
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'modulelist',
  components:{
    HeaderContent
  },
  data () {
    return {
      id: this.$route.params.id,
      name: '',
      opertions: ['返回'],
      headerTitle: '抽奖活动管理--》游戏详情',
    }
  },
  computed:{
    isInfo:{
      get:function() {
        return window.location.href.indexOf('gamedetail') !== -1
      },
      set:function() {
      }
    }
  },
  mounted() {
    console.log(this.id)
    this.gamedetail()
  },
  methods:{
    headerClick() {
      this.$router.push({
        path: '/activity/luck',
        query:{
          page: this.$route.params.page
        }
      })
    },
     gamedetail: async function() {
      var res = await http.get(api.luckyGamedetail + '/' + this.id)
      if (res.data.code === 0) {
       this.name = res.data.data.name
      } else {
        this.$message.error(res.data.message)
      }
    },
    changeTab() {
      var href = window.location.href
      if (href.indexOf('gamedetail') !== -1) {
        let urls = `/activity/luckdetail/Relation/`
        this.isInfo = false
        this.$router.push({path: urls + this.$route.params.id + '/' + this.$route.params.page })
      } else {
        this.isInfo = true
        let urls = `/activity/luckdetail/gamedetail/`
        this.$router.push({path: urls  + this.$route.params.id + '/' + this.$route.params.page })
      }
    }
  }
}
</script>
<style scoped>
.luckname{
  margin-top:20px;
  margin-bottom: 20px;
}
.btn{
  margin-bottom: 10px;
}
.btns{
    margin-bottom: 10px;
}
</style>


