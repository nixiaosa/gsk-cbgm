<template>
  <div class="Platformdetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="piont-flex">
      <div class="point-title">
        <span>姓名：{{ name }}</span>
      </div>
    </div>
     <div class="piont-flex">
      <div class="point-title">
        <span>平台全部积分： {{ point }}</span>
        <el-button type="info" size="small" @click="pointList">查看消费记录</el-button>
      </div>
    </div>
    <div style="overflow: hidden">
     <div class="block">
        <span>年:&nbsp;&nbsp;</span>
        <el-select v-model="selectYear" @change="selectChange">
          <el-option
            v-for="item in YearList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="block">
        <span>月:&nbsp;&nbsp;</span>
        <el-select v-model="selectMonth" @change="selectChange2" :disabled="isdisbled">
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="point">积分收入:{{ pointSum }}</div>
    </div>
    <div style="margin-top: 20px">
     <el-table
      :data="tableData"
      >
      <el-table-column
        label="序号"
        width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ ((newpage - 1)*20) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="行为"
        width="180">
        <template slot-scope="scope">
        <span>{{ scope.row.type | typechange }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="积分"
        width="180">
        <template slot-scope="scope">
        <span>{{ scope.row.point | getorsend }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="180">
        <template slot-scope="scope">
        <span>{{ scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type === 'shop' || scope.row.type === 'look' || scope.row.type === 'lookcms' ||  scope.row.type === 'question' ||  scope.row.type === 'competition' ||  scope.row.type === 'qa_question'"
            size="small"
            type="primary"
            @click="handleEdit(scope.row.id,scope.row.type)">详情</el-button>
           <span v-else>/</span>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <pointDetail :dialogTitle="dialogTitle" :pointDetailData="pointDetailData" :dialogPointDetailVisible="dialogPointDetailVisible" @closeDialogPointDetail="closeDialogPointDetail"></pointDetail>
    <div style="margin: 20px;"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="20">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import pointDetail from './pointDetail'
import HeaderContent from '@/components/header-content'
export default {
  name: 'Platformdetail',
  components:{
    pointDetail,
    HeaderContent
  },
  data() {
    return {
      selectYear: null,
      selectMonth: null,
      newpage: 1,
      point: this.$route.query.point,
      page: this.$route.params.page,
      pointDetailData: {}, // 积分详情数据
      dialogTitle: '', // 弹窗类型
      dialogPointDetailVisible: false, // 积分详情弹窗
      pointSum: 0,
      headerTitle: '平台积分明细',
      isdisbled: false,
      queryType: 0,
      opertions: ['返回'],
      total: 1,
      monthList: [],
      YearList: [],
      tableData: []
    }
  },
  filters:{
    typechange(str) {
        switch (str) {
          case 'login':
            return '登录'
          case 'enroll':
            return '邀请注册(旧)'
          case 'enroll_new':
            return '邀请注册(新)'
          case 'look':
            return '视频浏览'
          case 'lookcms':
            return '文章浏览'
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
          case 'question':
            return '线上答题'
          case 'competition':
            return '线上答题竞赛'
          case 'qa_question':
            return '调研问卷'
        }
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
    }
  },
  mounted() {
    this.setYearhData()
    this.setMonthData()
    this.UserBudgetList(this.newpage)
    this.getpointSum()
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
  methods: {
    handleEdit(id,title) {
      // let id = '598467932481126404' //浏览
      // let id = '605466903716036608' // 积分
      this.godetail(id)
      this.dialogTitle = title
      this.dialogPointDetailVisible = true
    },
    closeDialogPointDetail() {
      this.dialogPointDetailVisible = false
    },
    headerClick() {
      this.$router.push({
        path: '/function/Platform',
        query:{
          page: this.page
        }
      })
    },
    godetail: async function(id) {
      const res = await http.get(api.Userpointdetail + id)
      if (res.data.code === 0) {
        this.pointDetailData = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.UserBudgetList(val)
    },
    selectChange() {
      this.UserBudgetList(1)
      this.getpointSum()
    },
    selectChange2() {
      this.UserBudgetList(1)
      this.getpointSum()
    },
    UserBudgetList: async function (page) { // 获取用户收支积分明细列表
      if (this.selectYear !== null) {
        this.isdisbled = false
      } else if (this.selectYear === null) {
        this.isdisbled = true
      }
      var params1 = {
        pageNum: page,
        pageSize: 20,
        params: {
          year: this.selectYear ,
          month: this.selectMonth,
          queryType: this.queryType,
          userId: this.$route.params.id
        }
      }
      if (this.selectMonth !== null && this.selectMonth !== '' && this.selectMonth !== undefined) {
        let reg = new RegExp('月', 'g')
        params1.params.month = this.selectMonth.replace(reg,'') - 0
      }
      if (this.selectYear !== null && this.selectYear !== '' && this.selectYear !== undefined) {
        let reg = new RegExp('年', 'g')
        params1.params.year = this.selectYear.replace(reg,'') - 0
      }
      if (this.selectMonth !== null && this.selectYear === null) {
        this.$message.warning('请选择要查询的年份')
        return false
      }
      const res = await http.post(api.UserBudgetList,params1)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    },
    getpointSum: async function() { // 获取用户收支积分合计
      if (this.selectYear !== null) {
        this.isdisbled = false
      } else if (this.selectYear === null) {
        this.isdisbled = true
      }
      var params = {
        year: this.selectYear,
        month: this.selectMonth,
        queryType: this.queryType,
        userId: this.$route.params.id
      }
      if (this.selectMonth !== null && this.selectMonth !== '' && this.selectMonth !== undefined) {
         let reg = new RegExp('月', 'g')
          params.month = this.selectMonth.replace(reg,'') - 0
      }
       if (this.selectYear !== null && this.selectYear !== '' && this.selectYear !== undefined) {
         let reg = new RegExp('年', 'g')
        params.year = this.selectYear.replace(reg,'') - 0
      }
       if (this.selectMonth !== null && this.selectYear === null) {
        this.$message.warning('请选择要查询的年份')
        return false
      }
      const res = await http.post(api.pointSum,params)
      if (res.data.code === 0) {
        if (res.data.data !== 0) {
           this.pointSum =  Math.abs(res.data.data)
        } else {
          this.pointSum = 0
        }
      }
    },
    /*
      * 设置月份数据
      * */
      setMonthData() {
        for (let i = 0; i < 12; i++) {
          let month = {
            value: i + 1 + '',
            label: i + 1 + '月'
          }
          this.monthList.push(month)
        }
        this.monthList.unshift({ label: '全部',value: null })
      },
      setYearhData() {
        for (let i = 0; i < 15;i ++) {
          let Year = {
            value: i + 2016 + '',
            label: i + 2016 + '年'
          }
          this.YearList.push(Year)
        }
        this.YearList.unshift({ label: '全部',value: null })
      },
      pointList() {
        let id = this.$route.params.id
        this.$router.push({
          path: '/function/Records/' + id,
          query: {
            page: this.newpage
          }
        })
      },
  }
}
</script>
<style scoped>
.piont-flex{
  display: flex;
  justify-content: space-between;
  height:36px;
  margin-bottom: 15px;
}
.Platformdetail{
  overflow: hidden;
}
.piont-flex .point-title{
  height: 36px;
  line-height: 36px;
}
.block {
 float: left;
 margin: 0 20px 0 0;
}
.point {
  position: absolute;
  right: 90px;
}
</style>


