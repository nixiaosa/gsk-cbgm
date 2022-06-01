<template>
    <div class="analysis">
      <div class="wrap message">
        <span class="message">参与用户总份数:</span>
        <span>{{total}}</span>
      </div>
      <div class="wrap box">
        <span class="titls box">下载统计表格查看更多信息:</span>
        <el-button @click="getExl" :loading="isLoding" type="info">下载数据文件</el-button>
<!--        <a @click="getExl" class="download-link">下载数据文件</a>-->
      </div>
      <div style="margin: 20px"></div>
    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: "statisticalAnalysis",
    props: {
      id: {
        type: String
      }
    },
    watch: {
      id() {
        this.getCaseFillCount()
      }
    },
    data() {
      return {
        isLoding: false,
        page: 1,
        tableData: [],
        tableConfig: [],
        total: '',
        list: [
        ],
      }
    },
    mounted() {
      this.getCaseFillCount()
    },
    methods: {
      getExl() {
        this.isLoding = true
        this.audittjDown()
      },
      audittjDown: async function() {
        const res = await http.get(api.audittjDown + this.$route.params.id)
        if (res.data.code === 0) {
          this.isLoding = false
          // window.open(res.data.data)
          window.location.href = res.data.data
        } else {
          this.isLoding = false
          this.$message.error(res.data.message)
        }
      },
      audittjform: async function() {
        const res = await http.get(api.audittjform + this.$route.params.id)
        if (res.data.code === 0) {
          this.tableConfig = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      async getCaseFillCount() {
        await http.get(api.caseFillCount + this.$route.params.id).then(res => {
          this.total = res.data.data
        })
      },
      tabRes() {}
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
  .message {
    padding: 10px 20px;
    width: 100%;
    background: rgb(238, 241, 246);
    margin-bottom: 20px;
  }
  .message span, .message p {
    color: $c-theme;
  }
  .box {
    display: flex;
    align-items: center;
  }
  /*.analysis .wrap {*/
  /*  margin-top: 20px;*/
  /*  margin-left: 20px;*/
  /*  position: relative;*/
  /*}*/
  .analysis .wrap .titls {
    margin-right: 20px;
  }
  .analysis .wrap:nth-of-type(2) .titls{
    width: 200px;
  }
  .tabs{
    border:1px solid #ccc;
    border-bottom: none;
  }
  ul,li{
    list-style: none;
  }
  .tabs ul li{
    float: left;
    height: 40px;
    line-height: 40px;
  }

  .tabs ul{
    height: 40px;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: flex-start;
  }
  .hang{
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid #ccc;
  }
  .lie{
    flex: 1;
    padding:0 10px;
    border-right: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  .tabs ul li{
    list-style: none;
    flex: 1;
  }
  .tabs ul:nth-child(1){
    border-bottom: 1px solid #ccc;
    background: #EEF1F6;
  }
  .tabs ul li{
    margin: 0;
    height: 40px;
    text-align: left;
    border-right: 1px solid #ccc;
    padding:0 10px;
    font-size: 14px;
  }
  .download-link{
    display: inline-block;
    width: 80px;
    height: 36px;
    line-height: 36px;
    padding: 0 12px;
    font-size: 12px;
    color: #ffffff;
    background: #20a0ff;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
