<template>
  <div class="bds">
     <header-content :title="headerTitle"></header-content>
     <el-button size="small" type="info" @click="download">百度统计基本配置操作说明下载</el-button>
     <div style="margin:50px 0;">
       <span>百度统计登录网址：https://tongji.baidu.com/web/welcome/login</span>
       <el-button size="small" type="info" style="margin-left: 30px;" @click="open">打开链接（新建标签页）</el-button>
     </div>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'bds',
     components: {
      HeaderContent
    },
    data() {
      return {
        headerTitle: '百度统计'
      }
    },
    methods: {
      open() {
        let url = 'https://tongji.baidu.com/web/welcome/login'
        window.open(url)
      },
      download() {
        let url = 'https://yibaifiles-1252497236.file.myqcloud.com/CBGM/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8%E6%93%8D%E4%BD%9C%E8%AF%B4%E6%98%8E.pdf'
        window.open(url)
      }
    }
  }
</script>
<style scoped>

</style>


