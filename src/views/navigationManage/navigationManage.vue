<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="userAuths.navigation_add"></header-content>
    <el-table :data="tableData" border>
      <el-table-column label="二级栏目名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联一级栏目">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.alias || scope.row.businessId | businessNameGet}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="排序">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.showOrder" min="0" type="number" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.name,scope.row.showOrder,scope.row.id, scope.row.businessId)" type="info" size="small" v-if="userAuths.navigation_edit">编辑</el-button>
          <el-button @click="navSwitch(scope.row)" :type="scope.row.isdelete === 0 ? 'danger' : 'success'" size="small">{{ scope.row.isdelete === 0 ? '停用' : '启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加二级栏目" :visible.sync="dialogFormAddOne">
      <el-form :model="form">
        <el-form-item label="二级栏目名称:">
          <el-input style="width:200px;" :maxlength="6" v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联一级栏目:">
          <el-select v-model="value" placeholder="请选择">
            <div v-for="item in existBusiness" :key="item.businessId">
              <el-option v-if="item.businessId !== 6 && item.businessId !== 7" :label="item.alias || item.name" :value="item.businessId">
              </el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input type="number" style="width:80px;" v-model="form.showOrder" min="0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddOne = false">取 消</el-button>
        <el-button type="primary" @click="createMenu()" v-show="!isId">保 存</el-button>
        <el-button type="primary" @click="updateMenu()" v-show="isId">保 存</el-button>
      </div>
    </el-dialog>
    <div style="margin: 20px"></div>
    <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :current-page.sync="currentPage">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { mapGetters } from 'vuex'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent
  },
  data() {
    return {
      value: '',
      searchVal: '',
      tableData: [],
      total: 1,
      currentPage: 1,
      num1: 1,
      dialogFormAddOne: false,
      form: {
        name: '',
        showOrder: ''
      },
      existBusiness: [],
      id: '',
      isId: false,
      menuId: '',
      opertions: ['添加二级栏目'],
      headerTitle: '导航管理'
    }
  },
  computed: {
    ...mapGetters(['userAuths', 'companyid'])
  },
  filters: {
    businessNameGet(id) {
      switch (id) {
        case 1:
          return '店员培训'
        case 2:
          return '空中课堂'
        case 3:
          return '互动公开课'
        case 4:
          return '线上公开课'
        case 5:
          return '学术会议'
        case 8:
          return '病例征集'
        case 9:
          return '互动课堂'
        default:
          return ''
      }
    },
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
  },
  mounted() {
    this.getNavList(1)
    this.getStairList()
  },
  methods: {
    getStairList() {
      // 获取一级导航
      this.$http.get(this.$api.businessList.list).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          this.existBusiness = data
        } else {
          this.$message.error(message)
        }
      })
    },
    navSwitch:  async function(val) {
      let isdelete = val.isdelete
      let id = val.id
      var params = {
        isdelete: isdelete === 0 ? 1 : 0,
        id: id
      }
      var res = await http.post(api.updateNav, params)
      if (res.data.code === 0) {
        this.getNavList(this.currentPage)
      }
    },
    handleCurrentChange(val) {
      this.getNavList(val)
    },
    handleClick(name, order, id, businessId) {
      this.value = businessId
      this.isId = true
      this.form = {
        name: '',
        showOrder: ''
      }
      this.form.name = name
      this.form.showOrder = order
      this.id = id
      this.dialogFormAddOne = true
    },
    updateMenu: async function() {
      if (!this.form.name) {
        this.errorTost('请添加二级栏目名称')
        return false
      }
      if (this.form.showOrder < 0) {
        this.errorTost('排序序号不能小于0')
        return false
      }
      if (this.value === '') {
        this.errorTost('请选择关联一级栏目')
      }
      var params = {
        id: this.id,
        name: this.form.name,
        showOrder: this.form.showOrder,
        businessId: this.value
      }
      var res = await http.post(api.updateNav, params)
      if (res.data.code === 0) {
        this.form = {
          name: '',
          showOrder: ''
        }
        this.isId = false
        this.dialogFormAddOne = false
        this.currentPage = 1
        this.getNavList(1)
      }
    },
    headerClick() {
      this.value = ''
      this.isId = false
      this.form = {
        name: '',
        showOrder: ''
      }
      this.dialogFormAddOne = true
    },
    createMenu: async function() {
      if (!this.form.name) {
        this.errorTost('请添加二级栏目名称')
        return false
      }
      if (!this.form.name.trim()) {
        this.errorTost('二级栏目名称不能为空')
        return false
      }
      if (this.form.name.trim().indexOf(' ') !== -1) {
        this.errorTost('二级栏目名称不能有空格')
        return false
      }
      if (this.form.showOrder < 0) {
        this.errorTost('排序序号不能小于0')
        return false
      }
      if (this.value === '') {
        this.errorTost('请选择关联一级栏目')
        return false
      }
      var params = {
        name: this.form.name,
        showOrder: this.form.showOrder,
        businessId: this.value
      }
      var res = await http.post(api.createNav, params)
      if (res.data.code === 0) {
        this.form = {
          name: '',
          showOrder: ''
        }
        this.isId = false
        this.dialogFormAddOne = false
        this.currentPage = 1
        this.getNavList(1)
      }
    },
    getNavList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      var res = await http.post(this.$api.navigation.list, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      }
    },
    errorTost(val) { // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
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
  width: 100px;
  height: 80px;
}
.el-form-item__content {
  width: 150px !important;
}
</style>
