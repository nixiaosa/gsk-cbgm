<template>
  <div class="orders">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="xinxi-item">
      <span class="item-title">订单号:</span>
      <span>{{getData.orderId}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">下单人姓名:</span>
      <span>{{getData.userName}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">下单人手机号:</span>
      <span>{{getData.phoneNo}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">收货人姓名:</span>
      <span>{{getData.addressUser}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">收货人手机号:</span>
      <span>{{getData.addressPhone}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">兑换商品:</span>
      <span>{{getData.goodsSkuName}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">商品品类:</span>
      <span>{{getData.categoryName}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">兑换数量:</span>
      <span>{{getData.buyNum}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">消费积分:</span>
      <span>{{getData.expenseIntegral}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">兑换时间:</span>
      <span>{{ getData.createTime | formatDate }}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">收货地址:</span>
      <span>{{getData.addressName}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">
        状态:
      </span>
      <span>
        <span v-if="getData.status === 0">待审核</span>
        <span v-if="getData.status === 1">审核通过</span>
        <span v-if="getData.status === 2">审核未通过</span>
      </span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">审核人:</span>
      <span>{{getData.auditBy}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">备注:</span>
      <span>{{getData.auditMark}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">快递公司:</span>
      <span>{{getData.expressCompany}}</span>
    </div>
    <div class="xinxi-item">
      <span class="item-title">运单号码:</span>
      <span>{{getData.deliveryNumber}}</span>
    </div>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
export default {
  name: "orders",
  components:{
     HeaderContent
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  created() {
    this.getInfo()
  },
  data() {
    return {
      getData: {
        orderId: '',
        userName: '',
        phoneNo: '',
        goodsSkuName: '',
        categoryName: '',
        buyNum: '',
        expenseIntegral: '',
        createTime: '',
        addressName: '',
        status: 0,
        auditBy: '',
        auditMark: ''
      },
      id: this.$route.query.id,
      headerTitle: '订单详情',
      opertions: ['返回'],
    }
  },
  methods:{
    getInfo() {
      http.post(api.Orderdetail,{ id: this.id }).then(res => {
        let data = res.data.data
        this.getData = data
      })
    },
    headerClick() {
      this.$router.push({
        path: 'order',
        query: {
          page: this.$route.query.page
        }
      })
    }
  }
}
</script>
<style scoped>
.orders .xinxi-item{
  margin-left:20px;
  margin-top:20px;
}
.orders .xinxi-item .item-title{
  display:inline-block;
  margin-right:20px;
}
.orders .xinxi-item:nth-child(1) {
  display: block;
  font-weight: bold;
}
</style>


