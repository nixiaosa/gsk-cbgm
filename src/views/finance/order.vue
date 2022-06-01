<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="订单号">
        <el-input v-model="formInline.orderNo" placeholder="请输入订单号"></el-input>
      </el-form-item>
      <el-form-item label="买家姓名">
        <el-input v-model="formInline.buyerName" placeholder="请输入买家姓名"></el-input>
      </el-form-item>
      <el-form-item label="买家手机号">
        <el-input v-model="formInline.buyerPhone" placeholder="买家手机号"></el-input>
      </el-form-item>
      <el-form-item label="产品名称">
        <el-input v-model="formInline.itemUnitName" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="业务名称">
        <el-select v-model="formInline.type" placeholder="请选择业务名称">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <!-- <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInline.startTime" @change="startTimes" >
        </el-date-picker>
        <span style="color: #ffffff">-</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInline.endTime" @change="endTimes">
        </el-date-picker> -->
        <el-date-picker
          style="width: 250px"
          @change="pickerChange"
          v-model="searchTime"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="getOrdersExcel">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style="margin-bottom: 20px;">
      <el-table-column label="订单号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买产品">
        <template slot-scope="scope">
          <span>{{ scope.row.itemUnitName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type | businessNameGet }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付金额（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.actualPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买方姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.buyerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买方手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.buyerPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态">
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus | payStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款状态">
        <template slot-scope="scope">
          <span>{{ scope.row.refund | refundStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.payStatus === 1 && (scope.row.refund === 0 || scope.row.refund === 3)">
            <el-button
              type="info"
              size="small"
              @click="refund(scope.row)"
            >退款</el-button>
          </div>
          <div v-else class="refunded">
            —
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>

    <el-dialog
      title="退款"
      :visible.sync="schedule"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      size="tiny"
    >
      <div class="price">确定退款，退款金额<span>{{ this.actualPrice}}</span>元</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="schedule = false">取 消</el-button>
        <el-button type="primary" @click="closeDia">提交</el-button>
      </div>
    </el-dialog>
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
      schedule: false,
      actualPrice: '',
      currentPage: 1,
      total: 1,
      searchVal: '',
      headerTitle: '订单管理',
      formInline: {
        orderNo: null,
        buyerName: null,
        buyerPhone: null,
        startTime: null,
        endTime: null,
        itemUnitName: null,
        type: null
      },
      start: null,
      end: null,
      tableData: [],
      statusList: [
        { label: '全部' },
        { label: '文章', type: 17},
        { label: '店员培训', type: 8 },
        { label: '空中课堂', type: 9 },
        { label: '互动公开课', type: 10 },
        { label: '线上公开课', type: 11 },
        { label: '学术会议', type: 12 },
        { label: '互动课堂', type: 16 },
      ],
      searchTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              let end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    businessNameGet(id) {
      switch (id) {
        case 8:
          return '店员培训'
        case 9:
          return '空中课堂'
        case 10:
          return '互动公开课'
        case 11:
          return '线上公开课'
        case 12:
          return '学术会议'
        case 16:
          return '互动课堂'
        case 17:
          return '文章'
        default:
          return ''
      }
    },
    payStatus(val){
      switch (val) {
        case 0:
          return '待付款'
        case 1:
          return '已支付'
        case 2:
          return '已关闭'
        case 3:
          return '已过期'
        default:
          return ''
      }
    },
    refundStatus(val){
      switch (val) {
        case 0:
          return '未退款'
        case 1:
          return '退款中'
        case 2:
          return '已退款'
        case 3:
          return '退款失败'
        default:
          return ''
      }
    }
  },
  mounted() {
    this.payOrderList(1)
  },
  methods: {
    getOrdersExcel: async function() {
      let params = {
          orderNo: this.$praseStrNull(this.formInline.orderNo),
          buyerName: this.$praseStrNull(this.formInline.buyerName),
          buyerPhone: this.$praseStrNull(this.formInline.buyerPhone),
          itemUnitName: this.$praseStrNull(this.formInline.itemUnitName),
          type: this.$praseStrNull(this.formInline.type),
          startTime: this.$praseStrNull(this.formInline.startTime),
          endTime: this.$praseStrNull(this.formInline.endTime)
        }
        const res = await http.post(api.getOrdersExcel,params)
        if (res.data.code === 0) {
          window.open(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
    },
    refund(row){
      this.schedule = true;
      this.actualPrice = row.actualPrice
      this.orderNo = row.orderNo
    },
    closeDia: async function() {
      let params = {
        orderNo: this.orderNo
      }
      const res = await http.post(api.payOrderRefund,params)
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.payOrderList(1)
        } else {
          this.$message.error(res.data.message)
        }
      this.schedule = false;
    },
    search() {
      this.payOrderList(1)
    },
    payOrderList: async function(page) {
        // 时间查询解析
        if (this.searchTime && this.searchTime.length > 0) {
          let start = this.searchTime[0].toLocaleDateString();
          let end = this.searchTime[1].toLocaleDateString();
          this.formInline.startTime = new Date(start).getTime();
          this.formInline.endTime = new Date(end).getTime();
        } else {
          this.formInline.startTime = null;
          this.formInline.endTime = null;
        }
        let params = {
          orderNo: this.$praseStrNull(this.formInline.orderNo),
          buyerName: this.$praseStrNull(this.formInline.buyerName),
          buyerPhone: this.$praseStrNull(this.formInline.buyerPhone),
          itemUnitName: this.$praseStrNull(this.formInline.itemUnitName),
          type: this.$praseStrNull(this.formInline.type),
          startTime: this.$praseStrNull(this.formInline.startTime),
          endTime: this.$praseStrNull(this.formInline.endTime),
          pageNum: page,
          pageSize: 10
        }
        const res = await http.post(api.payOrderList,params)
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.currentPage = page
        } else {
          this.$message.error(res.data.message)
        }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.payOrderList(val)
    },
    startTimes() {
      this.formInline.startTime = Date.parse(this.formInline.startTime)
    },
    endTimes() {
      if (this.formInline.endTime.getFullYear) {
        let Year = this.formInline.endTime.getFullYear()
        let Month = this.formInline.endTime.getMonth() + 1
        let getDate = this.formInline.endTime.getDate()
        this.formInline.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime()
      }
    },
    pickerChange(v) {
      // 选择时间范围
      if (!v || v === "") {
        this.searchTime = [];
      }
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.price{
  font-size: 14px;
}
.price span{
  margin: 0 10px;
  font-weight: bold
}
.refunded{
  padding-left: 20px;
  color: $c-theme
}
</style>
