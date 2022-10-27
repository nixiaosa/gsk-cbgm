<template>
  <div class="list">
    <div class="user-total">
      <div>
        <span>用户数：{{usertime}}</span>
        <span style="margin-left: 20px">观看人次：{{usertotal}}</span>
        <span style="margin-left: 20px">观看总时长：{{videoData.totalViewTime}}分钟</span>
        <span style="margin-left: 20px">观看平均时长：{{videoData.averageViewTime}}分钟</span>
      </div>
      <div class="out-data">
        <a @click="download(1)">
          <el-button :loading="isLoading" v-show="version==='1'" type="primary">导出</el-button>
        </a>
        <a @click="download(2)">
          <el-button :loading="isLoading" v-show="version==='2'" type="primary">导出</el-button>
        </a>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
          <span v-if="scope.row.realname">{{ scope.row.realname }}</span>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="区县">
        <template slot-scope="scope">
          <span v-if="scope.row.area">{{ scope.row.area }}</span>
          <span v-else>{{ scope.row.county }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        v-if="serviceId===2||serviceId===3||serviceId===4||serviceId===5"
        label="医院名称">
        <template slot-scope="scope">
          <span v-if="scope.row.shopName">{{ scope.row.shopName }}</span>
          <span v-else>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="serviceId===1"
        label="药店名称">
        <template slot-scope="scope">
          <span>{{ scope.row.drugStore }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="serviceId!==1"
        label="从业情况">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="serviceId===1"
        label="职务">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="serviceId!==1"
        label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="最新观看时间">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.lastTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计观看时长(分)">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.viewTime | tomin}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--              v-if="ipLocation"-->
<!--              label="IP地址">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.ip}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
              v-if="ipLocation"
              label="IP归属地">
        <template slot-scope="scope">
          <span>{{ scope.row.location}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        isLoading: false,
        api: api,
        total: 1,
        currentPage: 0,
        videoData: '',
        usertotal: '暂无',
        usertime: '暂无',
        busId: this.$route.params.id,
        tableData:[],
        type: Number(this.$route.query.type),
        serviceId: Number(this.$route.query.service)
      }
    },
    props: {
      version: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters([
              'ipLocation'
      ])
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      tomin(value) {
        let result = parseInt(value / 60)
        if (value%60 > 0) result+=1
        return result
      },
      sex(str) {
        switch (str) {
          case 'man':
            return '男'
          case 'woman':
            return '女'
          default:
            return ''
        }
      }
    },
    created: function () {
    },
    mounted () {
      this.videoDataList(3, 1)
    },
    methods: {
      download(type) {
        this.isLoading = true
        // if (this.serviceId === 9) {
          var params = {
            businessId: this.serviceId,
            busId: this.busId,
            type: 3,
            identity: this.identity
          };
          http.post(api.adminWatchListExport, params).then(res => {
            let data = res.data;
            if (data.code === 0) {
              this.isLoading = false;
              window.location.href = data.data;
            } else {
              this.isLoading = false;
              this.$message.error(data.message);
            }
          });
          // window.href =
          // return
        // }
        // if (type === 1) {
        //   this.isLoading = false
        //   window.location.href = api.videoWatchOut + this.busId + '/' + 3
        // } else {
        //   this.isLoading = false
        //   if (this.serviceId === 5) {
        //     window.location.href = api.videoWatchOut3 + this.busId + '/' + 3
        //   } else {
        //     window.location.href = api.videoWatchOut2 + this.busId + '/' + 3
        //   }
        // }
      },
      videoDataList: async function(type,pageNum) {
        var params1 = {
          pageNum: pageNum,
          pageSize: 10,
          params: {
            businessId: this.serviceId,
            busId: this.busId,
            type: type
          }
        }
        let apiLink = api.adminWatchList
        // let apiLink = ''
        // if (this.serviceId !== 9) {
        //   apiLink = api.watchList
        //   if (this.version === '2') {
        //     if (this.serviceId === 5) {
        //       apiLink = api.watch3List
        //     } else {
        //       apiLink = api.watch2List
        //     }
        //   }
        // } else {
        //   apiLink = api.adminWatchList
        // }
        await http.post(apiLink, params1).then(response => {
          var data1 = response.data.data
          this.videoData = data1
          this.tableData = data1.attendList
          // this.total = data1.userCount
          this.total = data1.total;
          this.usertotal = data1.viewCount
          this.usertime = data1.userCount
        }).catch(response => {
          if (response.data.code !== 0) {
            this.$message.error(response.data.message)
          }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.videoDataList(3, val)
      },
      initialPage() {
        if (this.currentPage !== 1) {
          this.handleCurrentChange(1)
        }
      }
    },
    components: {}
  }
</script>
<style scoped>
  .user-total{
    height: 45px;
    line-height: 50px;
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }
  .list{
    position: relative;
  }
  .out-data{
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
