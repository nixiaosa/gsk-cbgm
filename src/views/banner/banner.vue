<template>
  <div class="modelist">
    <!--<div class="search" style="width: 160px;float: left">-->
    <!--<el-input-->
    <!--placeholder="搜索"-->
    <!--icon="search"-->
    <!--v-model="searchVal"-->
    <!--:on-icon-click="handleIconClick">-->
    <!--</el-input>-->
    <!--</div>-->
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick()" v-if="userAuths.banner_add"></header-content>
    <el-table :data="tableData" border>
      <el-table-column label="Banner">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picture" class="background" alt="">
        </template>
      </el-table-column>
      <el-table-column label="目标地址">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="排序">
        <template slot-scope="scope">
          <el-input v-model="scope.row.showOrder" min="0" type="number" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="headerClick(scope.row.id)" type="info" size="small" v-if="userAuths.banner_edit">编辑</el-button>
          <el-button @click="bannerId=scope.row.id,dialogVisible=true" type="danger" size="small" v-if="userAuths.banner_delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteBanner()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import HeaderContent from '@/components/header-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent
  },
  computed: {
    ...mapGetters(['userAuths'])
  },
  data() {
    return {
      searchVal: '',
      headerTitle: '轮播图管理',
      opertions: ['添加Banner'],
      tableData: [],
      total: 1,
      num1: 1,
      dialogVisible: false,
      bannerId: ''
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
    this.bannerList(1)
  },
  methods: {
    handleIconClick() {},
    handleCurrentChange(val) {
      this.bannerList(val)
    },
    headerClick(id) {
      if (id) {
        this.$router.push({ path: 'banneredit' + '?id=' + id })
      } else {
        this.$router.push({ path: 'banneredit' })
      }
    },
    changeOrder() {},
    bannerList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      var res = await http.post(api.bannerList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.total = res.data.data.total
      }
    },
    deleteBanner: async function() {
      var params = {
        id: this.bannerId
      }
      var res = await http.post(api.deleteBanner, params)
      if (res.data.code === 0) {
        this.$message.success('删除成功')
        this.dialogVisible = false
        this.bannerId = ''
        this.bannerList(1)
      }
    }
  }
}
</script>
<style>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}
</style>
