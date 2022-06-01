<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="piont-flex">
      <div class="point-title">
        <span>姓名： {{name}}</span>
        <span style="margin-left:30px;">医币： {{point}}</span>
      </div>
      <div>
      </div>
    </div>
    <div class="piont-flex borderbox">
      <div class="point-title">
      <el-button v-if="IsInfo"  @click="changeTab(0)">医币明细数据</el-button>
      <el-button type="info"   v-if="!IsInfo" @click="changeTab(0)">医币明细数据</el-button>
      <el-button v-if="isExists && !IsInfo" @click="changeTab(1)">医币历史明细数据(截止2019年4月2日前)</el-button>
      <el-button type="info"   v-if="isExists && IsInfo"  @click="changeTab(1)">医币历史明细数据(截止2019年4月2日前)</el-button>
      </div>
    </div>
    <TableContent :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></TableContent>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="currpage"
      :page-size="20"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent,
    TableContent
  },
  data() {
    return {
      tableData: [],
      tableConfig: [
        { label: '行为',prop: 'type' },
        { label: '医币',prop: 'point' },
        { label: '时间',prop: 'createtime' }
      ],
      point: this.$route.query.point,
      isExists: null, // 是否显示历史数据按钮
      total: 0,
      num: null,
      page: this.$route.params.page,
      headerTitle: '医币详情',
      opertions: ['返回'],
      currpage: 1,
      IsInfo: false
    }
  },
  computed: {
    name() {
      var str = decodeURIComponent(this.$route.query.nick)
      if (str !== 'undefined') {
        return str
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.pointSelfList(1)
    if (this.$route.params.id) {
        this.isUserisExists()
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currpage = val
      if (this.num === 1) {
        this.historicalList(val)
      } else {
        this.pointSelfList(val)
      }
    },
    headerClick() {
      this.$router.push({
        path: '/function/point',
        query:{
          page: this.page
        }
      })
    },
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    getorsend(num) {
      if (num > 0) {
        return '-' + num
      } else {
        return '+' + (0 - num)
      }
    },
    typechange(str) {
      switch (str) {
        case 'login':
        return '登录'
        case 'enroll':
        return '邀请注册'
        case 'look':
        return '浏览'
        case 'comment':
        return '评论'
        case 'admin':
        return '平台发放积分'
        case 'add_admin':
        return '管理员批量添加'
        case 'subtract_admin':
        return '管理员批量扣减'
        case 'shop':
        return '积分消费'
        case 'refund':
        return '积分退回'
      }
    },
    changeTab(data) {
      this.num = data
      if (this.num === 1) {
        this.IsInfo = true
        this.historicalList(this.currpage)
      } else if (this.num === 0) {
        this.IsInfo = false
        this.pointSelfList(this.currpage)
      }
    },
    pointSelfList: async function(page) { // 医币明细数据列表
      var params = {
        pageNum: page,
        pageSize: 20,
        params: {
          userId: this.$route.params.id,
        }
      }
      var res = await http.post(api.pointSelfList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.tableData.forEach(element => {
          element.createtime = this.formatDate(element.createtime)
          element.point = this.getorsend(element.point)
          element.type = this.typechange(element.type)
        })
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    },
    isUserisExists: async function() { // 是否存在历史数据
      let userId = this.$route.params.id
      const res = await http.get(api.isUserisExists + userId)
      if (res.data.code === 0) {
         this.isExists = res.data.data.isExists
      }
    },
    tabRes(){
    },
    historicalList: async function(page) { // 医币历史明细数据列表
      var params = {
        pageNum: page,
        pageSize: 20,
        params: {
          userId: this.$route.params.id,
        }
      }
      const res = await http.post(api.historicalList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.tableData.forEach(element => {
          element.createtime = this.formatDate(element.createtime)
          element.point = this.getorsend(element.point)
          element.type = this.typechange(element.type)
        })
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style soped>
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.piont-flex{
  display: flex;
  justify-content: space-between;
  height:36px;
  margin-bottom: 15px;
}
.piont-flex .point-title{
  height: 36px;
  line-height: 36px;
}
.borderbox{
  padding-top:8px;
}
.sendpoint{
  color: green;
}
.getpoint{
  color: red;
}

</style>
