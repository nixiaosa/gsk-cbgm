<template>
    <div id="list">
      <header-content :title="headerTitle" :opertions="opertions"></header-content>
      <ul class="wraper">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
      <div id="right">
        <el-button type="info">导出领取结果</el-button>
      </div>
    </div>
</template>
<script>
    import HeaderContent from '@/components/header-content'
    export default {
      components: {
       HeaderContent
      },
      name: "receive",
      data() {
        return {
          opertions: ['返回'],
          headerTitle: '任务中心->分享任务列表->领取详情'
        }
      }
  }
</script>

<style scoped>
  ul,li{
    list-style: none;
    margin:0;
    padding:0;
  }
  #list  .wraper{
    width:100%;
    height: 200px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  #list .wraper li{
    width: 23%;
    background: #ccc;
    margin: 10px 10px 0 0;
    text-align: center;
  }
  #right{
    position: absolute;
    top: 307px;
    right: 135px;
  }
</style>
