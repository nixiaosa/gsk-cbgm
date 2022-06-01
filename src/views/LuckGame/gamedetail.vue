<template>
  <div class="active-time">
    <div class="infos">
      <div class="infos-time">{{ Activities.time }}</div>
      <div class="infos-block">
        <span class="infos-self">{{ Activities.startTime }}</span>
        <span class="infors-content">{{ details.periodBegin | formatDate}}</span>
      </div>
      <div class="infos-block">
        <span class="infos-self">{{ Activities.endTime }}</span>
        <span class="infors-content">{{ details.periodEnd | formatDate}}</span>
      </div>
      <div class="infos-block">
        <span class="infos-self">{{ Activities.state }}</span>
        <span class="infors-content">{{ details.states | getState }}</span>
      </div>
    </div>
    <div class="infos infosl" v-if="details.ruleIntroduce !== ''">
      <div class="infos-time">{{ Activities.introduce }}</div>
      <div class="infos-block">
        <div class="infos-content intro-content ql-editor  infosl" v-html=" details.ruleIntroduce"></div>
      </div>
    </div>
    <div style="margin:20px;"></div>
    <div class="Prize">
      <div style="margin:20px 0;">奖品信息</div>
      <el-table
      :data="tableData"
      border>
      <el-table-column
        label="示例图"
        width="180">
        <template slot-scope="scope">
          <span><img :src="scope.row.pic" alt="" width="130" height="130"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="奖品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
export default {
  name:"gamedetail",
  data() {
    return {
      id: this.$route.params.id,
      index: '',
      tableData: [],
      Activities:{
        time: '活动时间',
        startTime: '开始时间:',
        endTime: '结束时间:',
        state: '活动状态:',
        introduce: '活动介绍:',
        times: '活动时间:',
        explain: '奖品说明:',
      },
      details:{
       periodBegin: '',
       periodEnd: '',
       states: '',
       ruleIntroduce: ''
      }
    }
  },
  filters:{
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    },
     getState(state) {
      if (state === 0) {
        return '未发布'
      } else if (state === 1) {
        return '未开始'
      } else if (state === 2) {
        return '进行中'
      } else if (state === 3) {
        return '已结束'
      }
    }
  },
  mounted() {
    this.gamedetail()
  },
  methods:{
    gamedetail: async function() {
      var res = await http.get(api.luckyGamedetail + '/' + this.id)
      if (res.data.code === 0) {
        this.details.periodBegin = res.data.data.periodBegin
        this.details.periodEnd = res.data.data.periodEnd
        this.details.states = res.data.data.states
        this.details.ruleIntroduce = res.data.data.ruleIntroduce
        this.tableData = res.data.data.lGPrizeList
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style scoped>
.infos{
  padding: 20px 0;
  border-bottom:1px solid #eee;
}
.infosl{
  min-height: 200px;
}
.infos-block .infos-self{
  display:inline-block;
  width:100px;
  padding-top:15px;
  padding-bottom:15px;
  text-align: right;
  margin-right: 30px;
}
.infos-block .infos-content{
  display:inline-block;
  padding-top:15px;
  padding-bottom:15px;
  text-align: left;
}
</style>


