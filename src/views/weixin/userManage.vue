<template>
  <div class="modelist" >
    <header-content title="用户管理"></header-content>
    <el-form :inline="true" label-position="left">
      <el-form-item label="昵称搜索" >
        <el-input
          style="width:200px;margin-bottom:15px;"
          placeholder="昵称"
          v-model="nickname">
        </el-input>
      </el-form-item>
      <el-form-item label="是否关注" >
        <el-select v-model="isFollow" placeholder="请选择" >
          <el-option  label="全部" value='-1'></el-option>
          <el-option  label="已关注" value='1'></el-option>
          <el-option  label="未关注" value='0'></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="searchBtn">搜索</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 95%;margin-top: -20px;" >
      <el-table-column
        label="头像">
        <template slot-scope="scope">
          <div style="text-align: center">
            <img :src="scope.row.photo" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标签">
        <template slot-scope="scope">
          <span>{{ scope.row.tag | filtTag(scope.row.tag) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否关注">
        <template slot-scope="scope">
          <span>{{ scope.row.isFollow == 0 ? '未关注' : '已关注'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    name: 'modelist',
    computed: {
      ...mapGetters([
        'userAuths', 'companyid'
      ])
    },
    data() {
      return {
        searchVal: '',
        tableData: [],
        total: 1,
        nickname:'',
        isFollow:'-1'
      }
    },
    filters: {
      filtTag(strArr) {
        strArr = JSON.parse(strArr)
        // console.log(strArr)
        return strArr.join(' , ')
      },
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {
      this.getPointList(1)
    },
    methods: {
      handleCurrentChange(val) {
        this.getPointList(val)
      },
      searchBtn() {
        this.getPointList(1)
      },
      getPointList: async function(page) {
        var params = {
          pageNum: page,
          pageSize: 10,
          params:{
            companyId:this.companyid
          }
        }
        if (this.nickname.trim() !=='' ) {
          params.params.nickname = this.nickname
        }
        if (this.isFollow >=0) {
          params.params.isFollow = this.isFollow
        }
        var res = await http.post(api.getWXUserList, params)
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      }
    },
    components: {
      HeaderContent
    }
  }
</script>
<style>
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
</style>
