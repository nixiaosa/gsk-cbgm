<template>
  <div class="stock">
    <ul>
      <li v-show="isCard === 1">
        <span>商品库存</span>
        <el-input v-model="num1" @change="handleChange"  label="描述文字" :disabled="isdisabled" style="width:80px;height:50px;"></el-input>
      </li>
      <li v-show="isCard ===0 ">
        <div>
          <span>现有库存</span>
          <el-input v-model="num2" label="描述文字" :disabled="isdisabled" style="width:80px;height:50px;"></el-input>
        </div>
        <div v-show="Istype">
          <span>增减库存</span>
          <el-input-number v-model="num" @change="handleChange" label="描述文字" :min="num2 === 0 ? 0 : -(num2)"></el-input-number>
          <el-button type="success" @click="success">确定</el-button>
        </div>
      </li>
    </ul>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <div v-if="isCard === 1">
        <el-form-item v-show="Istype" label="卡号">
          <el-input v-model="formInline.user" placeholder="卡号"></el-input>
        </el-form-item>
        <el-form-item v-show="Istype" label="密码">
          <el-input v-model="formInline.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" v-if="Istype">添加</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="tableData"
      breder
      v-if="isCard === 1"
    >
      <el-table-column label="卡号">
        <template slot-scope="scope">
          <span>{{ scope.row.cardId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡密">
        <template slot-scope="scope">
          <span>{{ scope.row.cardPassword }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="有效日期">
        <template slot-scope="scope">
          <span>{{ scope.row }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getstatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="start(scope.row.id)" v-if="scope.row.status === 3" v-show="Istype">启用</el-button>
          <el-button type="danger" size="small" @click="stop(scope.row.id)" v-if="scope.row.status === 0" v-show="Istype">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
       <div style="margin:20px"></div>
    <el-pagination
      background
      v-if="isCard === 1"
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
    <el-button type="success" class="btns" @click="step4" v-if="Istype" style="margin:20px 0;">上一步</el-button>
    <el-button type="success" class="btn1" @click="shelf" v-if="Istype" style="margin:20px 0 20px 50px;">上架</el-button>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: "stock",
  data() {
    return {
      steps: 'album',
      currentPage: 1,
      num1: 0,
      total: 1,
      num2: 0,
      num: 0,
      isCard: null,
      nums: null,
      Istype: true,
      isdisabled: true,
      disabled: false,
      tableData: []
    }
  },
  created() {
    if (this.$route.query) {
      this.$route.query.type -= 0
    if (this.$route.query.type === 0) {
        this.Istype = false
      }
    }

  },
  props:{
    formInline: {
      type: Object
    },
    commodityId: null
  },
  filters: {
      getstatus(v) {
        switch (v) {
          case 0:
            return '正常'
          case 1:
            return '已使用'
          case 2:
            return  '已失效'
          case 3:
            return  '停用'
        }
      }
    },
  mounted() {
    this.commoditydetail()
    if (this.$route.query.type === 0) {
      this.disabled = true
    }
  },
  methods: {
    step4() {
      this.$emit("steps",this.steps)
    },
    onSubmit() {
      this.stokcardAdd()
    },
    save4(){
    },
    shelf: async function() {
      let id = null
       if (this.$route.query.id) {
        id = this.$route.query.id
      } else {
        id = this.commodityId
      }
      var params = {
        status: 1,
        id: id
      }
      if (this.isCard === 0) {
        params = {
          status: 1,
          id: id
        }
      }
      http.post(api.commodityupdate, params).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.$router.push({
            path: '/mall/commodity'
          })
        }
      })
       .catch(err => {
         this.$message.error(err.data.message)
       })
    },
    start: async function (id) {
      var params = {
        id: id,
        status: 0
      }
     var res = await http.post(api.stockupdate, params)
      if (res.data.code === 0) {
        this.stockList(this.currentPage)
      }
    },
    stop: async function (id) {
      var params = {
        id: id,
        status: 3
      }
      var res =  await http.post(api.stockupdate, params)
      if (res.data.code === 0) {
        this.stockList(this.currentPage)
      }
    },
    handleChange(val) {
      this.num = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
       this.stockList(val)
    },
    stockList: async function () {
      let id = null
       if (this.$route.query.id) {
        id = this.$route.query.id
      } else {
        id = this.commodityId
      }
      var params ={
        pageNum: this.currentPage,
        pageSize: 10,
        params: {
          goodsId: id
        }
      }
      var res = await http.post(api.stockList,params)
      if (res.data.code === 0) {
        if (res.data.data &&  res.data.data.integralStockDetail) {
          this.tableData = res.data.data.integralStockDetail.list
          this.total = res.data.data.integralStockDetail.total
          this.num1 = res.data.data.integralStock.stockNum
        }
      } else {
        this.$message.error(res.data.messsage)
      }
    },
    success: async function() {
      let goodsId = null
       if (this.$route.query.id) {
        goodsId = this.$route.query.id
      } else {
        goodsId = this.commodityId
      }
      var params = {
        stockNum: this.num,
      }
      var res = await http.post(api.stockAdd + goodsId, params)
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.stocksList()
        } else {
          this.$message.error(res.data.message)
        }
    },
    stocksList: async function() {
      let id = null
       if (this.$route.query.id) {
        id = this.$route.query.id
      } else {
        id = this.commodityId
      }
      var params ={
        goodsId: id
      }
      var res = await http.post(api.stocksList,params)
      if (res.data.code === 0) {
        if (res.data.data) {
          this.num2 = res.data.data.stockNum
        }
      } else {
        this.$message.error(res.data.messsage)
      }
    },
     commoditydetail: async function () { // 查看详情
     let id = null
       if (this.$route.query.id) {
        id = this.$route.query.id
      } else {
        id = this.commodityId
      }
      var params = {
        id: id
      }
      var res = await http.post(api.commoditydetail,params)
      if (res.data.code === 0) {
        this.isCard = Number(res.data.data.isCard)
         if (this.isCard === 1) {
          this.stockList(this.currentPage)
        } else if (this.isCard === 0){
          this.stocksList(this.currentPage)
        }
      } else {
        this.$message.error(res.data.message)
      }
    },
    stokcardAdd: async function() {
      if (this.formInline.user === '' || this.formInline.user === null) {
        this.$message.error("请输入卡号")
        return false
      }
       if (this.formInline.user.length > 50) {
        this.$message.error("卡号最多输入50字符")
        return
      }
      if (this.formInline.password === '' || this.formInline.password === null) {
        this.$message.error("请输入密码")
        return false
      }
       if (this.formInline.password.length > 50) {
        this.$message.error("密码最多输入50字符")
        return false
      }
      var params = {
        cardId: this.formInline.user,
        cardPassword: this.formInline.password,
      }
      let goodsId = null
      if (this.$route.query.id) {
        goodsId = this.$route.query.id
      } else {
        goodsId = this.commodityId
      }
      var res = await http.post(api.stokcardAdd + '/' + goodsId,params)
      if (res.data.code === 0) {
        this.stockList(this.currentPage)
        this.formInline.user = ''
        this.formInline.password = ''
      } else {
        this.$message.error(res.data.messsage)
      }
    }
  }
}
</script>
<style scoped>
.stock ul,li{
  list-style: none;
  margin: 20PX 0;
  padding: 0;
}
</style>


