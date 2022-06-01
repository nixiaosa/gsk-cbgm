<template>
  <div class="active-info">
    <header-content :title="headerTitle"></header-content>
    <div class="user-content">
      <div class="info-block">
        <span class="info-self">聚合类型：</span>
        <span class="info-content"><input type='radio' checked>学术大会</span>
      </div>
      <div class="info-block">
        <span class="info-self">标题：</span>
        <span class="info-content">{{creatorName}}</span>
      </div>
      <div class="info-block2">
        <div class="info-self">封面图：</div>
        <div class="info-content">
          <img class="active-img" :src="coverMap" alt="">
        </div>
      </div>
      <div class="info-block">
        <span class="info-self">添加嘉宾：</span>
        <span class="info-content" v-for="item in guestName" style="margin-right: 15px">{{item.name}}</span>
      </div>
      <div class="info-block block3">
        <span class="info-self selfs">大会日程：</span>
        <span class="info-content contents">
        <img  v-for='(item,index) in schedule' :key="index + '1'" :src="item.url" alt="" width="300" height="200">
        <img  v-for='(item, index) in mobileschedule' :key="index + '2'" :src="item.url" alt="" width="300" height="200">
      </span>
      </div>
      <div class="info-block">
        <span class="info-self">举办地址：</span>
        <span class="info-content">{{hostAddress}}</span>
      </div>
      <div class="info-block">
        <span class="info-self">大会资料：</span>
        <span class="info-content" @click="open(item.url)" style="cursor:pointer" v-for="item in urls">
        {{item.name}}
      </span>
      </div>
      <div class="info-block blocks">
        <span class="info-self">介绍：</span>
        <div class="info-content infos  intro-content ql-editor infos-editorl" v-html="description"></div >
      </div>
      <div class="info-block2">
        <div class="info-self">关联会场：</div>
        <div class="info-content">
          <el-table
            :data="tableData"
            border
            style="width: 800px">
            <el-table-column
              label="来源"
              align="center"
              width="100">
              <template slot-scope="scope">
                <span class="info-content">学术会议</span>
              </template>
            </el-table-column>
            <el-table-column
              label="内容名称"
              align="center"
            >
              <template slot-scope="scope">
                <span class="info-content">{{scope.row.name}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="back">
        <el-button type="primary" class="right-btn" @click="goBack()">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  export default {
    data() {
      return {
        id: this.$route.params.id,
        headerTitle: '查看详情',
        beginTime: 0,
        coverMap: '',
        createTime: 0,
        creatorName: '',
        description: '',
        endTime: 0,
        isDeleted: 0,
        isStop: 0,
        personCount: 0,
        phone: '',
        specialistScoreMax: 0,
        state: 0,
        title: '',
        voteScoreMin: 0,
        guestName:'',
        hostAddress:'',
        schedule:'',
        mobileschedule:'',
        urls:'',
        tableData:[]
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      getState(num) {
        if (num === 0) {
          return '未开始'
        } else if (num === 1) {
          return '进行中'
        } else if (num === 2) {
          return '已结束'
        }
      }
    },
    created: function() {
    },
    mounted() {
      this.activeDetail()
    },
    methods: {
      activeDetail: async function() {
        var res = await http.get(api.meetingBusId + this.id)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          var data = res.data.data
          this.beginTime = data.beginTime
          this.coverMap = data.cover
          this.createTime = data.createTime
          this.creatorName = data.name
          this.description = data.description
          this.endTime = data.endTime
          this.isDeleted = data.isDeleted
          this.isStop = data.isStop
          this.specialistScoreMax = data.specialistScoreMax
          this.state = data.state
          this.title = data.title
          this.voteScoreMin = data.voteScoreMin
          this.guestName = data.guestList
          this.hostAddress = data.dataSource.contractors.hostAddress
          this.schedule = data.dataSource.schedule.pc
          this.mobileschedule = data.dataSource.schedule.mobile
          this.urls = data.dataSource.dataList
          this.tableData = data.videoList
        }
      },
      goBack() {
        this.$router.back(-1);
      },
      open(url) {
        window.open(url)
      },
    },
   components: {
     HeaderContent
   }
  }
</script>
<style>
.infos-editorl img{
  max-width: 100%;
}
</style>

<style scoped>
  .user-content{
    padding: 20px 30px;
    border:1px solid #eee;
  }
  .info-block .info-self{
    display:inline-block;
    width:100px;
    padding-top:15px;
    padding-bottom:15px;
    text-align: right;
    margin-right: 30px;
  }
  .info-block .info-content{
    display:inline-block;
    padding-top:15px;
    padding-bottom:15px;
    text-align: left;
  }
  .info-block2{
    display: flex;
  }
  .block3{
    display: flex;
  }
  .block3 .info-content{
    padding-top:10px;
    padding-bottom:15px;
    width:930px;
    flex-direction: column;
  }
  .info-block2 .info-self{
    width:100px;
    padding-top:15px;
    padding-bottom:15px;
    text-align: right;
    margin-right: 30px;
  }
  .info-block2 .info-content{
    display: flex;
    flex: 1;
    padding-top:10px;
    padding-bottom:15px;
    text-align: left;
    line-height: 30px;
  }
  .contents img{
    margin:0 8px 8px 0;
  }
 .blocks{
    min-height: 180px;
    display: flex;
    margin:20px 0;
  }
  .info-block .infos{
    width:800px;
    min-height: 150px;
    font-size:14px;
    background: #f7f7f7;
    border:1px solid #e5e5e5;
    padding: 5px;
    padding-top:20px;
    margin-top: 13px;
  }
  .info-block2 .info-content .active-img{
    width:300px;
    height:200px;
  }
  .back{
    width:1040px;
    text-align: center;
  }
</style>
