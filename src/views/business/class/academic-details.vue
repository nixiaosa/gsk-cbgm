<template>
  <div class="modelist">
    <div class="user-container-header">
      <div>查看详情</div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  export default {
    name: 'modelist',
    components: {},
    data() {
      return {
        activeId: this.$route.params.id,
        title: ''
      }
    },
    // computed: {
    //   isInfo: {
    //     get: function() {
    //       return window.location.href.indexOf('information') !== -1
    //     },
    //     set: function() {
    //     }
    //   }
    // },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    // mounted() {
    //   this.activeDetail()
    // },
    // methods: {
    //   activeDetail: async function() {
    //     var res = await http.get(api.activeDetail + this.$route.params.id, {})
    //     if (res.data.code !== 0) {
    //       this.$message.error(res.data.message)
    //     } else {
    //       var data = res.data.data
    //       this.title = data.title
    //     }
    //   },
    // }
  }
</script>
<style scoped>
  /*.modelist {*/
    /*box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    /*-webkit-box-sizing: border-box;*/
    /*padding: 20px;*/
  /*}*/
  .user-container-header {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    border-bottom:1px solid #eee;
    margin-bottom:20px;
  }
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
</style>
