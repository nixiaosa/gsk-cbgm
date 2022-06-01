<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="['返回']" @change="headerChange"></header-content>
    <div class="activeName">{{title}}</div>
    <el-button type="primary" v-if="isInfo" class="btn">活动信息</el-button>
    <el-button v-if="!isInfo" @click="changeTab" class="btn">活动信息</el-button>
    <el-button v-if="isInfo" @click="changeTab" class="btns">排行榜</el-button>
    <el-button type="primary" v-if="!isInfo" class="btns">排行榜</el-button>
    <router-view></router-view>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'modelist',
    components: {
      HeaderContent
    },
    data() {
      return {
        activeId: this.$route.params.id,
        title: '',
        businessId: '',
        headerTitle: '活动列表-活动详情'
      }
    },
    computed: {
      isInfo: {
        get: function() {
          return window.location.href.indexOf('information') !== -1
        },
        set: function() {
        }
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {
      this.activeDetail()
    },
    methods: {
      headerChange(item) {
        // header 触发
        console.log(item)
        if (item === '返回') {
          this.$router.back()
        }
      },
      activeDetail: async function() {
        var res = await http.get(api.activeDetail + this.$route.params.id, {})
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          var data = res.data.data
          this.title = data.title
          this.businessId = Number(data.businessId)
        }
      },
      changeTab() {
        var href = window.location.href
        let urls
        if (href.indexOf('information') !== -1) {
          urls = this.$route.matched[1].path + '/rank/'
          this.isInfo = false
        } else {
          urls = this.$route.matched[1].path + '/information/'
          this.isInfo = true
        }
        this.$router.push({ path: urls + `${this.$route.params.businessId}/${this.$route.params.id}` })
      }
    }
  }
</script>
<style scoped>
.activeName{
  margin-top:20px;
  margin-bottom:20px;
}
.nav-title{
  display: inline-block;
  width:100px;
  font-size:16px;
  color: #333;
  padding:10px;
  background: #fff;
  text-align: center;
  border:1px solid #eee;
}
.active-nav{
  background: #199ED8;
  color: #fff;
}
.btn{
  margin-bottom:10px;
}
.btns{
  margin-bottom:10px;
  margin-left: 20px;
}
</style>
