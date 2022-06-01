<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-input style="width:200px;margin-bottom:15px;" placeholder="搜索" icon="search" v-model="input2" :on-icon-click="handleIconClick">
    </el-input>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="手机号" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.fromPhone}}</span>
        </template>
      </el-table-column>

      <el-table-column label="评论人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.fromNickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论内容">
        <template slot-scope="scope">
          <span :title="scope.row.content">{{ scope.row.content | longToShort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="被评论人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.toNickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示/屏蔽" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isdelete | isping }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isdelete===0 && userAuths.comment_delete" @click="deletecomment(scope.row.id,scope.row.isdelete)" type="danger" size="small">屏蔽</el-button>
          <el-button v-if="scope.row.isdelete===1 && userAuths.comment_delete" @click="deletecomment(scope.row.id,scope.row.isdelete)" type="info" size="small">显示</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="total, prev, pager, next" :current-page="newpage" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
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
      headerTitle: '评论管理',
      input2: '',
      newpage: 1,
      multipleSelection: [],
      tableData: [],
      total: 1
    }
  },
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
    },
    isping(num) {
      if (num === 0) {
        return '显示'
      } else {
        return '屏蔽'
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
    this.commentList(1)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.commentList(val)
    },
    deletecomment: async function(id, isdel) {
      var isdelete = isdel === 0 ? 1 : 0
      var params = {
        id: id,
        isdelete: isdelete
      }
      var res = await http.post(api.commentEdit, params)
      if (res.data.code === 0) {
        this.commentList(this.newpage)
      }
    },
    handleIconClick() {
      this.commentList(1)
    },
    commentList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10
      }
      if (this.input2) {
        params = {
          pageNum: page,
          pageSize: 10,
          content: this.input2
        }
      }
      var res = await http.post(api.commentList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
        this.newpage = page
      }
    }
  }
}
</script>
<style>
</style>
