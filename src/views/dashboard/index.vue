<template>
  <div class="modelist">
    <h2 style="margin-top:0px;">{{plattitle}},欢迎回来</h2>
    <div style="border:none">
      <el-button @click="btntype1='1',btntype2='0',btntype3='0',btntype4='0',typename='产品'" :class="{ hoverbtn: btntype1==='1' }">按产品</el-button>
    </div>
    <div style="width:100%;height:10px;"></div>
    <div style="margin-top:10px;margin-bottom:10px">
      <span>{{service===1?'全部培训数' :'全部课程数'}}: {{totalnum}}</span>
      <!-- <span style="margin-left:20px">占比: 100%</span> -->
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 95%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        :label="typename" v-show="btntype1==='1'">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="service===1"
        label="培训数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="service===2"
        label="课程数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="占比">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.per }}%</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <!-- <el-cascader
      :options="options"
      v-model="selectedOptions3"
    ></el-cascader> -->
  </div>
</template>
<script>
import http from '@/utils/tenant'
import area from '@/api/area'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import config from '../../common/config'
export default {
  name: 'modelist',
  components: {},
  data() {
    return {
      totalnum: 0,
      btntype1: '1',
      btntype2: '0',
      btntype3: '0',
      btntype4: '0',
      tableData: [],
      multipleSelection: [],
      typename: '产品',
      options: area,
      selectedOptions3: ['北京', '北京市', '东城区']
    }
  },
  computed: {
    ...mapGetters([
      'plattitle',
      'service'
    ])
  },
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    sureType(v, h) {
      if (h) {
        return '回放'
      }
      if (v === 1) {
        return '直播'
      }
      if (v === 2) {
        return '视频'
      }
    },
    longToShort(str) {
      if (str.length > 20) {
        return str.substring(0, 20) + '...'
      } else {
        return str
      }
    }
  },
  mounted() {
    // this.getTrainList(0)
    this.getBusinessId()
  },
  methods: {
    //    获取业务类型
    getBusinessId: async function() {
      // var res = await http.post(api.getBusinessId)
      let res = {
        data: config.COMPANY_BUSINESS
      }
      if (res.data.code === 0) {
        var businessId = parseInt(res.data.data[0].businessId)
        localStorage.setItem('businessId', businessId)
      } else {
        this.errorTost(res.data.message)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // getTrainList: async function(num) {
    //   var params = {
    //   }
    //   var apilist = [api.getTrainType, api.getTrainprovince, api.getTrainCity, api.getTrainTag]
    //   var res = await http.get(apilist[num], params)
    //   if (res.data.code === 0) {
    //     this.tableData = res.data.data.data
    //     this.totalnum = res.data.data.total
    //   }
    // }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.hoverbtn{
  background: $c-theme;
  border-color: $c-theme;
  color:#fff !important;
}
.hoverbtn:hover{
  background-color: $c-theme !important;
  border-color: $c-theme !important;
  opacity: 0.8 !important;
  color: #fff !important;
}
.background {
  margin-left:auto;
  margin-right:auto;
  display: block;
  width: 100px;
  height: 80px;
}
</style>
