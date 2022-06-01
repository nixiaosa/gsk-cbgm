<template>
    <div class="active-rank">
        <div class="active-item" v-for="(item, index) in activeList">
            <div class="rank">{{item.rank}}</div>
            <img class="photo" v-if="!item.photo" src="http://yibaiserver-1252497236.pictj.myqcloud.com/WXCDN/morenF.png" alt="">
            <img class="photo" v-if="item.photo" :src="item.photo" alt="">
            <div class="self-info">
                <div class="name">{{item.name}}</div>
                <div class="name">
                    <span style="margin-right:20px;">{{item.title}}</span>
                    <span>{{item.office}}</span>
                </div>
                <div class="name">{{item.hospital}}</div>
            </div>
            <div class="tickets-info">
                <div class="tickets">
                    <span style="margin-right:20px;">投票：</span>
                    <span>{{item.tickets}}票（{{item.midScore}}分）</span>
                </div>
                <div class="tickets">
                    <span style="margin-right:20px;">专家评分：</span>
                    <span>{{item.specialistScore}}分</span>
                </div>
                <div class="tickets" v-if="state===2">
                    <span style="margin-right:20px;">总分数：</span>
                    <span>{{item.totalScore}}分</span>
                </div>
            </div>
            <div class="detail">
                <el-button type="primary" @click="goUrl(item.businessId,item.sourceType, item.sourceId,item.voteId)" >查看投票详情</el-button>
            </div>
        </div>
        <div class="paging-area" style="margin-top:20px;margin-bottom:20px;">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :page-size="10"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange"
                :total="listTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import http from '@/utils/tenant'
    import api from '@/api/tenantInfoSave'
    export default {
      data() {
        return {
          state: 0,
          activeList: [],
          listTotal: 0,
          currentPage: 1,
          businessId: ''
        }
      },
      filters: {
        specialistScore(num) {
          if (num === 0) {
            return '暂无评分'
          } else {
            return num + '分'
          }
        }
      },
      created: function() {
      },
      mounted() {
        this.activeRank(1, 10)
      },
      methods: {
        handleCurrentChange(val) {
          this.activeRank(val, 10)
        },
        activeRank: async function(pageNum, pageSize) {
          const params = {
            activeId: this.$route.params.id,
            pageNum: pageNum,
            pageSize: pageSize
          }
          var res = await http.post(api.activeRank, params)
          if (res.data.code !== 0) {
            this.$message.error(res.data.message)
          } else {
            var active = res.data.data.active
            this.state = active.state
            var rank = res.data.data.rank
            this.activeList = rank.list
            this.listTotal = rank.total
          }
        },
        goUrl(businessId,type, sourceId,id) {
          var urls = this.$route.matched[0].path + '/activity/rank/'
          this.$router.push({ path: `${urls}${businessId}/${type}/${sourceId}/${id}` })
        },
        deteleActive: async function() {
          var res = await http.get(api.deteleActive + this.$route.params.id, {})
          if (res.data.code !== 0) {
            this.$message.error(res.data.message)
          } else {
            this.$message.success('创建成功')
            this.$router.back(-1)
          }
        }
      }
    }
</script>
<style scoped>
.active-rank {
  border:1px solid #eee;
}
.active-item{
  height: 160px;
  display:flex;
  border-bottom: 1px solid #eee;
}
.active-item .rank{
  width:100px;
  font-size:24px;
  line-height: 160px;
  text-align: center;
}
.active-item .photo{
  width:150px;
  height:150px;
  margin:5px;
}
.active-item .self-info{
  flex:1;
  margin-top:15px;
}
.active-item .self-info .name{
  height: 40px;
  line-height: 40px;
}
.active-item .tickets-info{
  min-width: 200px;
  max-width: 256px;
  margin-top:15px;
}
.active-item .tickets-info .tickets{
  height: 40px;
  line-height: 40px;
  color:red;
}

.active-item .detail{
  width:160px;
  line-height: 160px;
  text-align: center;
}
</style>
