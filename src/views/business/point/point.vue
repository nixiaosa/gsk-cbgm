<template>
  <div class="modelist">
    <!--<el-input-->
      <!--style="width:200px;margin-bottom:15px;"-->
      <!--placeholder="搜索"-->
      <!--icon="search"-->
      <!--v-model="searchVal"-->
      <!--:on-icon-click="searchClick">-->
    <!--</el-input>-->
    <header-content :title="headerTitle"></header-content>
    <div class="btn">
      <el-button type="info" @click="openDialog">导出医币明细</el-button>
      <el-button type="info" v-if="isExists" @click="openData">导出医币历史明细(截止2019年4月2日前)</el-button>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px">
        <span>是否导出数据？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downLoadData">是</el-button>
          <el-button @click="dialogVisible = false">否</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisibles"
        width="400px">
        <span>是否导出数据？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downLoadDatas">是</el-button>
          <el-button @click="dialogVisibles = false">否</el-button>
        </span>
    </el-dialog>
    <div style="margin: 50px;"></div>
    <TableContent :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></TableContent>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="10"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent,
    TableContent
  },
  computed: {
    ...mapGetters([
      'userAuths',
      'companyid'
    ])
  },
  created() {
    if (this.$route.query.page) {
      this.page = Number(this.$route.query.page)
    }
  },
  data() {
    return {
      searchVal: '',
      tableData: [],
      tableConfig: [
        {
          label: '姓名',prop: 'nickname'
        },
        { label: '手机号',prop: 'phone' },
        { label: '角色',prop: 'roleName' },
        { label: '身份',prop: 'frontName' },
        { label: '医币',prop: 'point' },
        { label: '创建时间',prop: 'createtime' },
        { label: '医币明细数据',prop: 'point' },
        { label: '操作', prop: 'action' }
      ],
      multipleSelection: [],
      dialogVisible: false,
      dialogVisibles: false,
      xlsUrl: '',
      xlsUrls: '',
      isExists: null,
      headerTitle: '医币管理',
      total: 1,
      page: 1
    }
  },
  mounted() {
    this.getPointList(1)
    this.isCompanyExists()
  },
  methods: {
    searchClick() {
    },
    handleCurrentChange(val) {
      this.page = val
      this.getPointList(this.page)
    },
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    nameornick(nickname) {
      if (nickname) {
        return nickname
      } else {
        return ''
      }
    },
    frontName(name) {
      if (name) {
        return name
      } else {
        return ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    openDialog() {
      this.dialogVisible = true
      this.getXls()
    },
    getXls: async function() {
      const res = await http.get(api.exportDetailList + 2)
      if (res.data.code === 0) {
        this.xlsUrl = res.data.data
      }
    },
    downLoadData() {
      this.dialogVisible = false
      window.open(this.xlsUrl)
    },
    isCompanyExists: async function() { // 是否存在历史数据
      let companyId = this.companyid
      const res = await http.get(api.isCompanyExists + companyId)
      if (res.data.code === 0) {
         this.isExists = res.data.data.isExists
      }
    },
    openData() {
      this.dialogVisibles = true
      this.getsXls()
    },
    getsXls: async function() {
      const res = await http.get(api.exporthistoricalList + 2)
      if (res.data.code === 0) {
        this.xlsUrls = res.data.data
      }
    },
    downLoadDatas() {
      this.dialogVisibles = false
      window.open(this.xlsUrls)
    },
    getPointList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        businessId: 2
      }
      var res = await http.post(api.getPointList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.tableData.forEach(element => {
          element.action = ['查看']
          element.createtime = this.formatDate(element.createtime)
          element.nickname = this.nameornick(element.nickname)
          element.frontName  = this.frontName(element.frontName)
        })
        this.total = res.data.data.total
      }
    },
    tabRes(row) {
      let page = this.page
      let id = row.userId
      let nick = row.nickname
      let real = row.realname
      let point = row.point
      if (real) {
        this.$router.push({ path: 'point/' + id + '/' + page + '?point=' + point + '&nick=' + real })
      } else if (nick) {
        this.$router.push({ path: 'point/' + id + '/' + page + '?point=' + point + '&nick=' + nick })
      } else {
        this.$router.push({ path: 'point/' + id + '/' + page + '?point=' + point })
      }
    },
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
.btn{
  position: absolute;
  right: 40px;
  top: 150px;
}
</style>
