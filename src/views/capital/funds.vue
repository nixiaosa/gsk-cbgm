<template>
  <div class="funds">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="piont-flex">
      <div class="point-title">
        <span>姓名：{{ name }}</span>
        <span style="margin-left: 50px;">资金余额：{{ amount }}</span>
      </div>
    </div>
    <TableContent :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></TableContent>
    <div style="margin: 20px;"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="20">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
export default {
  name: 'funds',
  components:{
    HeaderContent,
    TableContent
  },
  data() {
    return {
      newpage: 1,
      total: 1,
      id: this.$route.params.id,
      amount: this.$route.query.amount,
      headerTitle: '资金明细',
      opertions: ['返回'],
      tableData: [],
      tableConfig: [
        {
          label: '类型',prop: 'typeName'
        },
        { label: '金额',prop: 'price' },
        { label: '时间',prop: 'createtime' }
      ]
    }
  },
  mounted() {
    this.capitaldetail(this.newpage)
  },
   computed: {
    name() {
      var str = decodeURIComponent(this.$route.query.userName)
      if (str !== 'undefined') {
        return str
      } else {
        return ''
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.newpage = val
      this.capitaldetail(val)
    },
    headerClick() {
      this.$router.push({
        path: '/capital/management',
        query: {
          page: this.$route.params.page
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
    capitaldetail: async function (page) {
      var params = {
        pageNum: page,
        pageSize: 20,
        params: {
          userId: this.id
        }
      }
      const res = await http.post(api.capitaldetail,params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.tableData.forEach(element => {
          element.createtime = this.formatDate(element.createtime)
          element.price = this.getorsend(element.price)
        })
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    },
    tabRes() {
    }
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


