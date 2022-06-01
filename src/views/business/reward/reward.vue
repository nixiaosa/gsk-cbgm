<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="打赏人">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打赏金额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ -scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收赏人">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.nickname1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打赏时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
export default {
  name: 'modelist',
  components: {
    HeaderContent
  },
  data() {
    return {
      headerTitle: '打赏管理',
      searchVal: '',
      multipleSelection: [],
      tableData: [],
      total: 1,
      input2: '',
      newpage: 1
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    nameornick(nickname, name) {
      if (name) {
        return name
      } else if (nickname) {
        return nickname
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.rewardlist(1)
  },
  methods: {
    searchClick() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.rewardlist(val)
    },
    handleIconClick() {
      this.rewardlist(1)
    },
    rewardlist: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      /* if (this.input2) {
        params = {
          pageNum: page,
          pageSize: 10,
          name: this.input2
        }
      } */
      var res = await http.post(api.rewardlist, params)
      if (res.data.code === 0) {
        if (res.data.data.list.length !== 0) {
          var array = res.data.data.list
          var array1 = []
          for (var i = 0; i < array.length; i++) {
            var obj = {}
            if (array[i].from.realname) {
              obj.realname = array[i].from.realname
            } else {
              obj.realname = ''
            }
            if (array[i].from.nickname) {
              obj.nickname = array[i].from.nickname
            } else {
              obj.nickname = ''
            }
            if (array[i].to.realname) {
              obj.realname1 = array[i].to.realname
            } else {
              obj.realname1 = ''
            }
            if (array[i].to.nickname) {
              obj.nickname1 = array[i].to.nickname
            } else {
              obj.nickname1 = ''
            }
            obj.price = array[i].to.price
            obj.createtime = array[i].from.createtime
            array1.push(obj)
          }
          this.tableData = array1
          this.total = res.data.data.total
          this.newpage = page
        }
      }
    }
  }
}
</script>
<style>
</style>
