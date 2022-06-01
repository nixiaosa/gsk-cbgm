<template>
  <div id="lists">
    <header-content :opertions="title" @header-btn-click="headerClick" :title="headerTitle" v-if="userAuths.create_invite_regist"></header-content>
    <header-content :title="headerTitle" v-if="!userAuths.create_invite_regist"></header-content>
    <Headers :itemDatas="itemData" :options="options" :form="form" @search="search" />
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="任务名称" width="300">
        <template slot-scope="scope">
          <span class="centers">{{ scope.row.title | longToShort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务周期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDate }} - {{ scope.row.endTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放总积分" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.pointTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column width="230" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="230" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="174">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 2 ? 'info' : 'primary'">{{ scope.row.status | sureType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleClick(scope.row.id)">查看</el-button>
          <el-button type="info" size="small" v-if="userAuths.edit_invite_regist && scope.row.status === -1" @click="handleClicks(scope.row.id)">编辑</el-button>
          <el-button type="info" size="small" @click="receive(scope.row.id)" v-if="scope.row.status!== -1">领取详情</el-button>
          <el-button v-if="scope.row.status !== -1 && scope.row.status < 2" type="danger" size="small" @click="endReceive(scope.row.id)">结束任务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newPage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="ends"
    >
      <span style="color: red;">任务被强制结束后不能再次开启，确定要结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button :loading="isLoading" @click="endFinish" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import Headers from './base/header1'
export default {
  name: 'shareTask',
  components: {
    HeaderContent,
    Headers
  },
  computed: {
    ...mapGetters(['userAuths'])
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return ''
      }
      time = Number(time)
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatDates(time) {
      time = Number(time)
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    sureType(v) {
      switch (v) {
        case -1:
          return '未发布'
        case 0:
          return '未开始'
        case 1:
          return '进行中'
        case 2:
          return '已结束'
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
  data() {
    return {
      ends: false,
      isLoading: false,
      endId: '',
      title: ['创建任务'],
      headerTitle: '邀请注册任务列表',
      tableData: [],
      itemData: [
        {
          label: '任务名称',
          placeholder: '请输入任务名称'
        },
        {
          label: '任务状态',
          placeholder: '请选择'
        },
        {
          label: '任务周期'
        },
        {
          label: '创建者',
          placeholder: '请输入创建者姓名'
        },
        {
          value: '查询'
        }
      ],
      value3: [],
      multipleSelection: [],
      newPage: 1,
      total: 0,
      input2: '',
      input21: '',
      input22: '',
      input23: '',
      value8: '',
      form: {
        title: '',
        nickname: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      options: [
        {
          status: null,
          label: '全部'
        },
        {
          status: -1,
          label: '未发布'
        },
        {
          status: 0,
          label: '未开始'
        },
        {
          status: 1,
          label: '进行中'
        },
        {
          status: 2,
          label: '已结束'
        }
      ]
    }
  },
  created() {
    if (this.$route.query.page) {
      this.newPage = Number(this.$route.query.page)
    }
  },
  mounted() {
    this.gteInviteList(this.newPage)
  },
  methods: {
    close() {
      this.ends = false
      this.endId = ''
    },
    endFinish() {
      if (this.$route.meta.type === 'new') {
        this.isLoading = true
        this.$http.get(this.$api.company.taskFinishNew + this.endId).then(res => {
          this.isLoading = false
          let {code, message} = res.data
          if (code === 0) {
            this.gteInviteList(this.newPage)
            this.ends = false
            this.$message.success('结束成功')
          } else {
            this.$message.error(message)
          }
        }).catch(err => {
          this.ends = false
          this.isLoading = false
          this.$message.error(err.data.message)
        })
      } else {
        let params = {
          id: this.endId
        }
        this.$http.post(this.$api.company.taskFinish, params).then(() => {
          this.gteInviteList(this.newPage)
          this.ends = false
          this.$message('结束成功')
        }).catch(error => {
          this.ends = false
          this.$message.error(error)
        })
      }
    },
    endReceive(id) {
      this.ends = true
      this.endId = id
    },
    headerClick() {
      this.$router.push({
        path: this.$route.meta.type === 'new' ? '/taskCenter/create/new' : '/taskCenter/create'
      })
    },
    gteInviteList: async function(page) {
      let taskVersions = this.$route.meta.type
      let params = {
        pageNum: page,
        pageSize: 10,
        params: {
          event: taskVersions === 'new' ? 'enroll_new' : 'enroll'
        }
      }
      if (this.form.title !== '' || this.form.status !=='' || this.form.startTime
        !== '' || this.form.endTime !== '' || this.form.nickname !== '') {
        params = {
          pageNum: page,
          pageSize: 10,
          params: {
            event: taskVersions === 'new' ? 'enroll_new' : 'enroll',
            title: this.form.title,
            status: this.form.status,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            nickname: this.form.nickname
          }
        }
        if (this.form.startTime > this.form.endTime) {
          this.$message.error('开始时间不能大于结束时间')
          return false
        }
      }
      let apiUrl = taskVersions === 'new' ? this.$api.inviteSearchNew : this.$api.inviteSearch
      this.$http.post(apiUrl, params).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.tableData = taskVersions === 'new' ? data.list : data.data
          this.total = data.total
        }
      })
    },
    search() {
      this.gteInviteList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.newPage = val
      this.gteInviteList(val)
    },
    handleClick(id) {
      let page = this.newPage
      let pushUrl
      if (this.$route.meta.type === 'new') {
        pushUrl = '/taskCenter/inviteDetails/new'
      } else {
        pushUrl = '/taskCenter/inviteDetails'
      }
      this.$router.push({ path: pushUrl + '/' + page + '?id=' + id })

    },
    handleClicks(id) {
      let pushUrl
      if (this.$route.meta.type === 'new') {
        pushUrl = `/taskCenter/create/new/${id}`
      } else {
        pushUrl = `/taskCenter/create?id=${id}`
      }
      this.$router.push({ path: pushUrl })
    },
    receive(id) {
      let page = this.newPage
      let pushUrl
      if (this.$route.meta.type === 'new') {
        pushUrl = '/taskCenter/receive/new'
      } else {
        pushUrl = '/taskCenter/receive'
      }
      this.$router.push({ path: pushUrl + '/' + page +'?id=' + id })
    }
  }
}
</script>
<style lang="scss">
#lists {
  .bigBox {
    .el-form {
      padding: 0;
      height: 100px;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss" scoped>
#lists .bigBox {
  height: 100px;
}
.centers {
  display: block;
  width: 265px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.centers:hover {
  display: block;
  width: 300px;
  overflow: auto;
  white-space: nowrap;
  cursor: pointer;
}
</style>
