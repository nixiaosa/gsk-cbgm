<template>
  <div class="Platformdetail">
    <header-content :title="headerTitle"></header-content>
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
      <div class="point">共计消费:{{ pointSum }}</div>
      <div style="margin: 30px 0;float: left;"></div>
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
        <span>{{ scope.row.point |  getorsend }}</span>
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
          v-if="scope.row.type==='shop' || scope.row.type==='look'"
          size="small"
          type="info"
          @click="handleEdit(scope.row.id,scope.row.type)">详情</el-button>
          <span v-else>/</span>
        </template>
      </el-table-column>
    </el-table>
    <pointDetail :dialogTitle="dialogTitle" :pointDetailData="pointDetailData" :dialogPointDetailVisible="dialogPointDetailVisible" @closeDialogPointDetail="closeDialogPointDetail"></pointDetail>
    <div style="margin: 20px;"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="20">
    </el-pagination>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import pointDetail from './pointDetail'
export default {
  name: 'Records',
   components:{
      HeaderContent,
      pointDetail
  },
  data() {
    return {
      selectYear: null,
      selectMonth: null,
      headerTitle: '平台积分消费记录',
      pointDetailData: {}, // 积分详情数据
      dialogTitle: '', // 弹窗类型
      dialogPointDetailVisible: false, // 积分详情弹窗
      isdisbled: false,
      pointSum: 0,
      queryType: 1,
      newpage: 1,
      total: 1,
      monthList: [],
      YearList: [],
      tableData: []
    }
  },
  filters:{
    typechange(str) {
      switch (str) {
        case 'enroll':
          return '邀请'
        case 'look':
          return '浏览'
        case 'refund':
          return '积分退回'
        case 'shop':
          return '积分消费'
        case 'subtract_admin':
          return '管理员扣减'
        case 'add_admin':
          return '管理员添加'
        case 'admin':
          return '平台发放积分'
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
  methods: {
    handleEdit(id,title) {
      this.godetail(id)
      this.dialogTitle = title
      this.dialogPointDetailVisible = true
    },
    closeDialogPointDetail() {
      this.dialogPointDetailVisible = false
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
    selectChange(val) {
      this.UserBudgetList(this.newpage)
      this.getpointSum()
    },
    selectChange2() {
      this.UserBudgetList(this.newpage)
      this.getpointSum()
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
    UserBudgetList: async function (page) { // 获取用户收支积分明细列表
       if (this.selectYear !== null) {
        this.isdisbled = false
      } else if (this.selectYear == null) {
        this.isdisbled = true
      }
      var params1 = {
        pageNum: page,
        pageSize: 20,
        params: {
          year: this.selectYear,
          month: this.selectMonth,
          queryType: this.queryType,
          userId: this.$route.params.id
        }
      }
      if (params1.params.year !== null && params1.params.year !== '' && params1.params.year !== undefined) {
        let reg = new RegExp('年', 'g')
        params1.params.year = this.selectYear.replace(reg,'') - 0
      }
      if (params1.params.month !== null && params1.params.month !== '' && params1.params.month !== undefined) {
        let reg = new RegExp('月', 'g')
        params1.params.month = this.selectMonth.replace(reg,'') - 0
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
      } else if (this.selectYear == null) {
        this.isdisbled = true
      }
      var params = {
        year: this.selectYear,
        month: this.selectMonth,
        queryType: this.queryType,
        userId: this.$route.params.id
      }
      if (params.year !== null && params.year !== '' && params.year !== undefined) {
        let reg = new RegExp('年', 'g')
        params.year = this.selectYear.replace(reg,'') - 0
      }
      if (params.month !== null && params.month !== '' && params.month !== undefined) {
         let reg = new RegExp('月', 'g')
          params.month = this.selectMonth.replace(reg,'') - 0
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


