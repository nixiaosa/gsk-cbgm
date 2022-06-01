<template>
    <div class="active-rank">
        <div class="page-label">
          <span style="margin-left:20px;">排行榜->>投票详情</span>
          <el-button type="primary" class="right-btn" @click="goBack()">返回上一页</el-button>
        </div>
        <div class="source-info">
          <img class="phoho" v-if="!photo" src="http://yibaiserver-1252497236.pictj.myqcloud.com/WXCDN/morenF.png" alt="">
          <img class="phoho" v-if="photo" :src="photo" alt="">
          <div class="personal">
            <div>
              <span class="name" style="margin-right:15px;font-size:20px;">{{name}}</span>
              <span style="margin-right:15px;">{{title}}</span>
              <span>{{office}}</span>
            </div>
            <div>{{hospital}}</div>
          </div>
        </div>
        <div class="total-votes">
          票数：{{tickets}}票
        </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              <span>{{ ((currentPage-1)*10)+scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="手机号">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="投票时间">
            <template slot-scope="scope">
              <span>{{ scope.row.votingTime | formatDate }}</span>
            </template>
          </el-table-column>
        </el-table>
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
    import { formatDate } from '@/common/data'
    export default {
      data() {
        return {
          tableData: [],
          listTotal: 0,
          currentPage: 1,
          name: '',
          title: '',
          hospital: '',
          office: '',
          tickets: 0,
          photo: ''
        }
      },
      filters: {
        formatDate(time) {
          var date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
      },
      created: function() {
      },
      mounted() {
        this.ticketsDetail(1, 10)
        this.sourceInfo()
      },
      methods: {
        goBack() {
          this.$router.go(-1)
        },
        handleCurrentChange(val) {
          this.ticketsDetail(val, 10)
        },
        sourceInfo: async function() {
          const params = {
            voteId: this.$route.params.id,
            sourceId: this.$route.params.sourceId,
            sourceType: this.$route.params.type
          }
          var res = await http.post(api.sourceInfo, params)
          if (res.data.code === 0) {
            var data = res.data.data
            this.photo = data.photo
            this.title = data.title
            this.hospital = data.hospital
            this.name = data.name
            this.office = data.office
            if (!data.tickets) {
              this.tickets = 0
            } else {
              this.tickets = data.tickets
            }
          }
        },
        ticketsDetail: async function(pageNum, pageSize) {
          const params = {
            pageNum: pageNum,
            pageSize: pageSize,
            activeId: this.$route.params.id,
            sourceId: this.$route.params.sourceId,
            sourceType: this.$route.params.type
          }
          var res = await http.post(api.ticketsDetail, params)
          if (res.data.code !== 0) {
            this.$message.error(res.data.message)
          } else {
            this.tableData = res.data.data.list
            this.listTotal = res.data.data.total
          }
        }
      }
    }
</script>
<style scoped>
.active-rank {
  border:1px solid #eee;
}
.page-label{
  width:100%;
  height:60px;
  line-height: 60px;
  border-bottom: 1px solid #eee;
}
.right-btn{
  float:right;
  margin-top: 15px;
  margin-right: 20px;
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
  width: 200px;
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
.source-info{
  width: 400px;
  height: 100px;
  display: flex;
}
.source-info .phoho{
  width:70px;
  height:70px;
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
}
.source-info .personal{
  margin-top:20px;
  line-height: 30px;
}
.total-votes{
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
</style>
