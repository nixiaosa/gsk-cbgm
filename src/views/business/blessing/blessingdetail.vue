<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div  class="content">
      <div class="detail-item">
        <span class="item-content">奖励类型：红包</span>
        <span class="item-content">充值时间：{{createTime | formatDate}}</span>
      </div>
      <div class="detail-item">
        <span class="item-content">发放人：{{nickname}}</span>
        <span class="item-content">手机：{{phone}}</span>
      </div>
      <div class="detail-item">
        <span class="item-content">总金额：{{totalmoney}}</span>
        <span class="item-content">总个数：{{totalnumber}}</span>
      </div>
      <div class="detail-item">
        <span class="item-content">发放方式：{{sendtype}}</span>
        <span class="item-content">领取条件：{{condition}}</span>
      </div>
      <div class="detail-item">
        <span class="item-content">领取金额：{{moneysend}}</span>
        <span class="item-content">领取个数：{{moneynum}}</span>
      </div>
      <div class="detail-item">
        <span class="item-content">退款条件：{{conditionback}}</span>
      </div>
      <el-button type="primary" class="down" @click="downData" :disabled="isDisabled">导出</el-button>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px">
        <span>是否导出数据？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downLoadData">是</el-button>
          <el-button @click="dialogVisible = false">否</el-button>
        </span>
    </el-dialog>
    <h5>领取用户明细</h5>
    <el-table :data="tableData" border style="width: 95%" @selection-change="handleSelectionChange">
      <el-table-column label="姓名" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院">
        <template slot-scope="scope">
         <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取金额" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.outMoney}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="观看时长">
        <template slot-scope="scope">
          <span>{{scope.row.watchVo | times}}</span>
          <span v-if="scope.row.watchVo!==null">{{scope.row.watchVo.viewTime | tomin}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :current-page="newpage" :total="totalNum">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent
  },
  data() {
    return {
      createTime: '',
      realname: '',
      nickname: '',
      phone: '',
      totalmoney: '',
      totalnumber: '',
      sendtype: '',
      condition: '',
      isDisabled: false,
      xlsUrl: '',
      moneysend: '',
      moneynum: '',
      dialogVisible: false,
      newpage: 1,
      conditionback: '',
      headerTitle: '百福袋结果详情',
      id: this.$route.params.id,
      opertions: ['返回'],
      totalNum: 10,
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    sex(str) {
      if (str === 'man') {
        return '男'
      }
      if (str === 'woman') {
        return '女'
      }
    },
    nameornick(nickname, name) {
      if (name) {
        return name
      } else if (nickname) {
        return nickname
      } else {
        return ''
      }
    },
    times(value) {
      if (value === null) {
        return 0
      }
    },
    tomin(value) {
      if (value === null) {
        return 0
      } else {
        var theTime = parseInt(value) // 秒
        var theTime1 = 0 // 分
        var theTime2 = 0 // 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60)
          theTime = parseInt(theTime % 60)
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60)
            theTime1 = parseInt(theTime1 % 60)
          }
        }
        var result = '' + parseInt(theTime) + '秒'
        if (theTime1 > 0) {
          result = '' + parseInt(theTime1) + '分' + result
        }
        if (theTime2 > 0) {
          result = '' + parseInt(theTime2) + '小时' + result
        }
        return result
      }
    }
  },
  mounted() {
    this.baifuDetail()
    this.result(this.newpage)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.result(val)
    },
    headerClick() {
      this.$router.push({
        path: '../blessing',
        query: {
          page: this.$route.query.page
        }
      })
    },
    baifuDetail: async function() {
      var res = await http.get(api.baifuDetail + this.$route.params.id)
      if (res.data.code === 0) {
        var data = res.data.data
        this.createTime = data.createTime
        this.nickname = data.userAttend.name
        if (data.userAttend.phone) {
          this.phone = data.userAttend.phone
        }
        this.totalmoney = data.money
        this.totalnumber = data.num
        this.sendtype = data.equal === 0 ? '随机分配' : '平均分配'
        this.condition = '观看时长>' + data.receiveWatchTime / 60 + '分钟'
        if (data.receiveWatchTime === 0) {
          this.condition = '不限制观看时长'
        }
        this.moneysend = data.outMoney
        this.moneynum = data.outNumber
        this.conditionback =
          data.refundCondition === '0'
            ? '不退款'
            : data.refundCondition + '天后'
        // var userAttend = res.data.data.userAttend
        // console.log(userAttend) // 这是要添加到数组中的对象
        // if (userAttend) {
        //   this.tableData.push(userAttend)
        // }
      }
    },
    result: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          id: this.$route.params.id
        }
      }
      var res = await http.post(api.result, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.totalNum = res.data.data.total
        if (this.tableData.length > 0) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
      }
    },
    downData() {
      this.dialogVisible = true
      this.getXls()
    },
    getXls: async function() {
      var params = {
        id: this.id
      }
      const res = await http.post(api.awardresult,params)
      if (res.data.code === 0) {
        this.xlsUrl = res.data.message
      } else {
        this.$message.error(res.data.message)
      }
    },
    downLoadData() {
      this.dialogVisible = false
      window.open(this.xlsUrl)
    }
  }
}
</script>
<style scoped>
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.detail-item {
  float: left;
  width: 510px;
  height: 40px;
}
.detail-item .item-content {
  display: inline-block;
  width: 250px;
}
.content{
  overflow: hidden;
  margin-bottom:20px;
  margin-top:20px;
  padding-bottom:10px;
  border-bottom:1px solid #eee;
}
.content .down {
  float: right;
}
</style>
