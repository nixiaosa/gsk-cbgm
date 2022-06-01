<template>
  <div class="order">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInlines" class="demo-form-inline">
      <el-form-item label="订单号:">
        <el-input v-model="formInlines.orderId" placeholder="请输入订单号"></el-input>
      </el-form-item>
     <el-form-item label="商品品类:">
      <el-select v-model="formInlines.categoryName" placeholder="请选择商品品类">
         <el-option  v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.categoryName"></el-option>
      </el-select>
     </el-form-item>
      <el-form-item label="下单人姓名:">
        <el-input v-model="formInlines.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="下单人手机号:">
        <el-input v-model="formInlines.phoneNo" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="兑换商品:">
        <el-input v-model="formInlines.goodsSkuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="订单状态:">
        <el-select v-model="formInlines.status" placeholder="请选择商品品类">
          <el-option  v-for="item in options2" :key="item.status" :label="item.name" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
     <el-form-item label="兑换时间:" class="">
        <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInlines.startTime" @change="startTimes">
       </el-date-picker>
       <span style="color: #fff">-</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInlines.endTime" @change="endTimes">
      </el-date-picker>
    </el-form-item>
      <el-button type="primary" @click="onSubmit" class="query">查询</el-button>
    </el-form>
    <div style="margin: 20px;"></div>
    <el-table
      :data="tableDatd"
      border
    >
      <el-table-column label="订单号">
        <template slot-scope="scope">
          <span> {{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单人姓名">
        <template slot-scope="scope">
          <span> {{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单人手机号">
        <template slot-scope="scope">
          <span> {{ scope.row.phoneNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人姓名">
        <template slot-scope="scope">
          <span> {{ scope.row.addressUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人手机号">
        <template slot-scope="scope">
          <span> {{ scope.row.addressPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换商品">
        <template slot-scope="scope">
          <span> {{ scope.row.goodsSkuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品品类">
        <template slot-scope="scope">
          <span> {{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换数量">
        <template slot-scope="scope">
          <span> {{ scope.row.buyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费积分">
        <template slot-scope="scope">
          <span> {{ scope.row.expenseIntegral }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待审核</span>
          <span v-if="scope.row.status === 1">审核通过</span>
          <span v-if="scope.row.status === 2">审核未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人">
        <template slot-scope="scope">
          <span> {{ scope.row.auditBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="320"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="goInfo(scope.row.id)">查看详情</el-button>
          <el-button type="primary" :disabled="scope.row.status !== 0" size="small" @click="goGood(scope.row.id)">通过</el-button>
          <el-button type="danger" :disabled="scope.row.status !== 0" size="small" @click="goRefuse(scope.row.id)">拒绝</el-button>
          <el-button v-if="scope.row.status===1" type="primary" :disabled="scope.row.delivered !== 0" size="small" @click="deliverGoods(scope.row)">
            {{scope.row.delivered === 0 ? '发货' : '已发'}}
          </el-button>
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
    <!-- 发货对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <p>收货人姓名：{{dialogData.userName}}</p>
      <p>商品类型：{{dialogData.categoryName}}</p>
      <p>兑换商品：{{dialogData.goodsSkuName}}</p>
      <p>手机号：{{dialogData.phoneNo}}</p>
      <p>收货地址：{{dialogData.addressName}}</p>
      <el-form label-width="80px" :model="formLabelAlign">
        <el-form-item label="快递公司">
          <el-input style="width: 200px" v-model="formLabelAlign.expressCompany"></el-input>
        </el-form-item>
        <el-form-item label="运单号码">
          <el-input style="width: 200px" v-model="formLabelAlign.deliveryNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shipments(dialogData.orderId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { mapGetters } from 'vuex'
import { formatDate } from '@/common/data'
export default {
  name: 'order',
  components:{
    HeaderContent
  },
  computed: {
    ...mapGetters(['name'])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    return {
      formLabelAlign: {
        expressCompany: '',
        deliveryNumber: ''
      },
      dialogData: '',
      dialogVisible: false,
      currentPage: 1,
      total: 0,
      headerTitle: '订单管理',
      opertions: ['导出'],
      tableDatd: [],
     formInlines: {
       goodsSkuName: null,
       phoneNo: null,
       userName: null,
       orderId: null,
       categoryName: null,
       startTime: null,
       endTime: null,
       status: null
      },
      options: [],
      options2: [
        {
          status: null,
          name: '全部'
        },
        {
          status: 0,
          name: '待审核'
        },
        {
          status: 1,
          name: '审核通过'
        },
        {
          status: 2,
          name: '审核未通过'
        }
      ]
    }
  },
  mounted() {
    this.getOrderList(this.currentPage)
    this.categoryList()
  },
  created() {
     if (this.$route.query.page) {
      let page = Number(this.$route.query.page)
      this.currentPage = page
    }
  },
  methods:{
    handleClose() {
    },
    goInfo(id) {
      this.$router.push({path: '/mall/orderdetail' + '?id=' + id + '&page=' + this.currentPage })
    },
    deliverGoods(item) {
      this.dialogVisible = true
      this.dialogData = item
    },
    shipments(id) {
      this.dialogVisible = false
      let params ={
        orderId: id,
        expressCompany: this.formLabelAlign.expressCompany,
        deliveryNumber: this.formLabelAlign.deliveryNumber
      }
      http.post(api.deliverGoods, params).then(res => {
        if (res.data.code === 0) {
          this.getOrderList(this.currentPage)
          this.$message.success('发货成功')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    categoryList: async function() { // 获取列表
      var params1 = {
        pageNum: 1,
        pageSize: 1000,
        params: {
          isDeleted: 0
        }
      }
      var res = await http.post(api.categoryList,params1)
      if (res.data.code === 0) {
        res.data.data.list.unshift({
          categoryName: "全部"
        })
        this.options = res.data.data.list
      } else {
        this.$message.error(res.data.message)
      }
    },
    goGood(id) {
      let params = {
        id: id,
        auditBy: this.name,
        status: 1
      }
      http.post(api.orderAudit,params).then(res => {
        let data = res.data
        if (data.code === 0) {
          this.getOrderList(this.currentPage)
          this.$message.success('审核成功')
        } else {
          this.$message.error(data.message)
        }
      })
    },
    goRefuse(id) {
      this.$prompt('审核未通过原因：', '提示', {
        confirmButtonText: '提交',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let params = {
          auditBy: this.name,
          id: id,
          status: 2,
          auditMark: value
        }
        http.post(api.orderAudit,params).then(res => {
          let data = res.data
          if (data.code === 0) {
            this.getOrderList(this.currentPage)
            this.$message.success('审核成功')
          } else {
            this.$message.error(data.message)
          }
        })
      });
    },
    getOrderList() {
      this.formInlines.orderId === '' ? this.formInlines.orderId = null : this.formInlines.orderId
      this.formInlines.phoneNo === '' ? this.formInlines.phoneNo = null : this.formInlines.phoneNo
      this.formInlines.userName === '' ? this.formInlines.userName = null : this.formInlines.userName
      this.formInlines.startTime === '' ? this.formInlines.startTime = null : this.formInlines.startTime
      this.formInlines.endTime === '' ? this.formInlines.endTime = null : this.formInlines.endTime
      this.formInlines.goodsSkuName === '' ? this.formInlines.goodsSkuName = null : this.formInlines.goodsSkuName
       if (this.formInlines.categoryName === '全部') {
        this.formInlines.categoryName = null
      }
      this.formInlines.categoryName === '' ? this.formInlines.categoryName = null : this.formInlines.categoryName
      if (this.formInlines.startTime > this.formInlines.endTime) {
          this.$message.error("结束时间不能小于开始束时间")
          return false
        }
      let params = {
        pageNum: this.currentPage,
        pageSize: 10,
        params: this.formInlines
      }
       this.options.forEach(element => {
        if (element.categoryName == this.formInlines.categoryName) {
          params.params.goodsCategoryId = element.id
        }
      })
      http.post(api.OrderList,params).then(res => {
        let data = res.data.data
        this.total = data.total
        this.tableDatd = data.list
      })
    },
    endTimes() {
      if (this.formInlines.endTime.getFullYear) {
        let Year = this.formInlines.endTime.getFullYear()
        let Month = this.formInlines.endTime.getMonth() + 1
        let getDate = this.formInlines.endTime.getDate()
        this.formInlines.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime()
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getOrderList(val)
    },
    startTimes() {
      this.formInlines.startTime = Date.parse(this.formInlines.startTime)
    },
    headerClick() {
      let params = {
        params: {
          isExport: 1
        }
      }
      http.post(api.OrderList,params).then(res => {
        let data = res.data.data
        if (res.data.code === 0) {
          this.$message.success('导出成功')
          window.location.href = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    onSubmit() {
      this.getOrderList(1)
    }
  }
}
</script>
<style>
.order .demo-form-inline{
  overflow: hidden;
  position: relative;
}
.exchange{
  position: absolute;
  top: 50px;
  left: 0;
}
</style>

<style scoped>
.order .query{
  /*position: absolute;*/
  /*right: 0;*/
}
</style>


