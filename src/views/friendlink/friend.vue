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
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="userAuths.banner_add"></header-content>
    <el-table :data="tableData" border>
      <el-table-column label="链接名称" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="70">
        <template slot-scope="scope">
          <span>{{scope.row.showOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id,scope.row.name,scope.row.url,scope.row.showOrder)" type="info" size="small" v-if="userAuths.banner_edit">编辑</el-button>
          <el-button @click="linkId=scope.row.id,dialogVisible=true" type="danger" size="small" v-if="userAuths.friend_link_delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
    <el-dialog title="添加友情链接" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="链接名称：">
          <el-input class="input400" v-model="form.name" auto-complete="off" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="链接地址：">
          <el-input class="input400" v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="form.showOrder" style="width:80px" min="0" type="number"></el-input>
        </el-form-item>
      </el-form>
      <img :src="imgData" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFriend()">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteFriend()">确 定</el-button>
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
      opertions: ['添加友情链接'],
      headerTitle: '友情链接管理',
      dialogFormVisible: false,
      form: {
        name: '',
        url: '',
        showOrder: 0
      },
      id: '',
      tableData: [],
      total: 1,
      num1: 1,
      dialogVisible: false,
      linkId: '',
      imgData: '',
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
    this.friendList(1)
    this.getApi()
  },
  methods: {
    getApi() {
      this.$http.get('https://1304134397659579.cn-beijing.fc.aliyuncs.com/2016-08-15/proxy/astl-Puppeteer-52F80B10933A/HtmlToPng/https%3A%2F%2Fshahai.test.100doc.com.cn%2F%23%2F').then(res => {
        this.imgData = res.data
      })
    },
    handleIconClick() {},
    headerClick() {
      this.id = ''
      this.form = {
        name: '',
        url: '',
        showOrder: 0
      }
      this.dialogFormVisible = true
    },
    handleCurrentChange(val) {
      this.bannerList(val)
    },
    handleClick(id, name, url, showOrder) {
      this.id = id
      this.form = {
        name: name,
        url: url,
        showOrder: showOrder
      }
      this.dialogFormVisible = true
    },
    changeOrder() {},
    createFriend: async function() {
      if (!this.form.name) {
        this.$message.error('链接名称不能为空')
        return false
      }
      if (!this.form.url) {
        this.$message.error('链接地址不能为空')
        return false
      }
      var apiurl = api.updateFriend
      var params = {
        name: this.form.name,
        url: this.form.url,
        showOrder: this.form.showOrder,
        id: this.id
      }
      if (!this.id) {
        apiurl = api.createFriend
        params = {
          name: this.form.name,
          url: this.form.url,
          showOrder: this.form.showOrder
        }
      }
      var res = await http.post(apiurl, params)
      if (res.data.code === 0) {
        if (!this.id) {
          this.success('添加成功')
        } else {
          this.success('修改成功')
        }
        this.dialogFormVisible = false
        this.friendList(1)
      }
    },
    friendList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      var res = await http.post(api.friendList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.data
        this.total = res.data.data.total
      }
    },
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    },
    deleteFriend: async function(id) {
      var params = {
        id: this.linkId
      }
      var res = await http.post(api.deleteFriend, params)
      if (res.data.code === 0) {
        this.success('删除成功')
        this.dialogVisible = false
        this.linkId = ''
        this.friendList(1)
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
.input400 {
  width: 400px;
}
</style>
