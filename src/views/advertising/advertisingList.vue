<template>
  <div class="modelist">
    <!--<div class="search" style="width: 160px;float: left;">-->
    <!--<el-input-->
    <!--placeholder="搜索"-->
    <!--icon="search"-->
    <!--v-model="searchVal"-->
    <!--:on-icon-click="handleIconClick">-->
    <!--</el-input>-->
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="userAuths.ad_add"></header-content>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.pic" v-if="scope.row.pic" class="background" alt="">
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="info" @click="handleClick(scope.row.id)" size="small" v-if="userAuths.ad_edit">详情&编辑</el-button>
          <el-button type="danger" @click="adId=scope.row.id,dialogVisible=true" size="small" v-if="userAuths.ad_delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sourceDelect()">确 定</el-button>
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
  computed: {
    ...mapGetters(['userAuths'])
  },
  components: {
    HeaderContent
  },
  data() {
    return {
      headerTitle: '广告管理',
      opertions: ['新建广告'],
      searchVal: '',
      tableData: [],
      multipleSelection: [],
      total: 1,
      newpage: 1,
      dialogVisible: false,
      adId: ''
    }
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
    this.getNewsList(1)
  },
  methods: {
    handleIconClick() {},
    handleCurrentChange(val) {
      this.getNewsList(val)
    },
    getNewsList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      var res = await http.post(api.sourceList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data
      }
    },
    sourceDelect: async function() {
      var params = {
        id: this.adId
      }
      var res = await http.post(api.sourceDelect, params)
      if (res.data.code === 0) {
        this.success('删除成功')
        this.dialogVisible = false
        this.getNewsList(1)
        this.newpage = 1
      }
    },
    headerClick() {
      this.$router.push({ path: 'advertisingEdit' })
    },
    handleClick(id) {
      this.$router.push({ path: 'advertisingEdit' + '?id=' + id })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    }
  }
}
</script>
<style scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 160px;
  height: 120px;
}
</style>
