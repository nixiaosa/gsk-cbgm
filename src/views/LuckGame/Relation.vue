<template>
  <div class="Relation">
    <div class="tbs"  v-if="gameType==='多人抽奖'">
      <ul>
        <li>序号</li>
        <li>抽奖游戏名称</li>
        <li>模式</li>
        <li>业务名称</li>
        <li>课堂名称</li>
        <li>观看时长</li>
        <li v-if="satisfactUserCount!==null && satisfactUserCount >= 0">满足条件用户数</li>
        <li>操作</li>
      </ul>
      <ul>
        <li>1</li>
        <li>{{ gameName }}</li>
        <li>{{ gameType }}</li>
        <li>{{ businessName }}</li>
        <li>{{ courseName }}</li>
        <li  id="list">{{ watchTimeDesc | tomin }}</li>
        <li v-if="satisfactUserCount!==null && satisfactUserCount >= 0">{{ satisfactUserCount }}</li>
        <li id="last">
          <a type="primary"  @click="infos" style="color:blue;">中奖人列表</a>
        </li>
      </ul>
    </div>
    <div class="tbs tbsl"  v-if="gameType==='单人抽奖'">
    <ul>
      <li>序号</li>
      <li>抽奖游戏名称</li>
      <li>模式</li>
      <li>业务名称</li>
      <li>课堂名称</li>
      <li v-if="satisfactUserCount!==null && satisfactUserCount >= 0">满足条件用户数</li>
      <li id="lastl">操作</li>
    </ul>
    <ul>
      <li>1</li>
      <li>{{ gameName }}</li>
      <li>{{ gameType }}</li>
      <li>{{ businessName }}</li>
      <li>{{ courseName }}</li>
      <li v-if="satisfactUserCount!==null && satisfactUserCount >= 0">{{ satisfactUserCount }}</li>
      <li id="last lastl">
        <a type="primary"  @click="infos" style="color:blue;">中奖人列表</a>
      </li>
    </ul>
  </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name:'Relation',
  data() {
    return {
      tableData: [],
      gameType: '',
      gameName: '',
      gameId: this.$route.params.id,
      businessName: '',
      courseName: '',
      watchTimeDesc: 0,
      satisfactUserCount: null,
      servers:[{
        name: '业务名称:',
        classname: '课程名称:',
        Associated: '已关联业务数:',
        curriculum: '已关联课程:'
      }],
       options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    }
  },
  filters:{
    tomin(value) {
     if (value === 0) {
       return '不限制观看时长'
     } else {
       return value + '分钟'
     }
    }
  },
  mounted() {
    this.GRelateBusin()
  },
  methods:{
    infos() {
      this.$router.push({ path: `/activity/Winners/${this.gameId}`  })
    },
    GRelateBusin: async function () {
      var res = await http.get(api.GRelateBusin + "/" + this.gameId)
      if (res.data.code === 0) {
         let resdata = res.data.data
         this.gameType = resdata.gameType
         this.businessName = resdata.businessName
         this.courseName = resdata.courseName
         this.gameName = resdata.lotteryGame.name
         if (res.data.data.watchTimeDesc) {
           this.watchTimeDesc = res.data.data.watchTimeDesc
         }
         if  (Number(resdata.satisfactUserCount)>= 0) {
            this.satisfactUserCount = res.data.data.satisfactUserCount
         }

      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style scoped>
.Relation{
  padding: 20px 0;
  overflow: hidden;
}
.Relation ul{
  overflow: hidden;
}
ul,li{
  list-style: none;
}
.Relation ul li{
  float: left;
  /* width: 400px; */
  height: 40px;
  line-height: 30px;
}
.wrapers{
  height: 70px;
  overflow: hidden;
}
.rightbtn{
  float: right;
}
.info-block .info-self{
  display:inline-block;
  width:200px;
  padding-top:15px;
  padding-bottom:15px;
  text-align: right;
  margin-right: 30px;
}
.left .info-block{
  float: left;
}
.cont .info-block{
  float: left;
}
.towblock{
 margin-left: 50px;
}
.cont{
  overflow: hidden;
}

.tbs{
  border:1px solid #ccc;
  height:80px;
  border-right: none;
}
.tbs ul{
  height: 40px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}
.tbs ul li{
  list-style: none;
  flex: 1;
}
.tbs ul:nth-child(1){
  border-bottom: 1px solid #CCC;
  background: #EEF1F6;
}
.tbs ul li{
  margin: 0;
  height: 40px;
  /* width: 12.5%; */
  /* line-height: 40px; */
  text-align: left;
  border-right: 1px solid #ccc;
  padding:0 10px;
  font-size: 14px;
}
/* .tbs ul li:nth-child(2) {
  width: 18%;
}
.tbsl ul li{
  width: 15%;
}
.tbs ul li:nth-child(1){
  width: 7%;
} */
</style>


