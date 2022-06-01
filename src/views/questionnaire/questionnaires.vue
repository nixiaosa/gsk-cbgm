<template>
  <div id="lists">
    <header-content :opertions="opertions" @header-btn-click="headerClick" :title="headerTitle" v-if="userAuths.create_invite_regist"></header-content>
    <header-content :title="headerTitle" v-if="!userAuths.create_invite_regist"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form">
    </Headers>
    <el-button type="info" size="small" @click="searchs()" class="querys">查询</el-button>
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
      <el-table-column width="200" label="创建者">
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
          <el-tag type="primary">{{ scope.row.status | sureType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="360">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleClick(scope.row.id)">查看</el-button>
          <el-button type="info" size="small" v-if="userAuths.edit_invite_regist && scope.row.status === -1" @click="handleClicks(scope.row.id)">编辑</el-button>
          <el-button type="info" size="small" @click="receive(scope.row.id)" v-if="scope.row.status!== -1">领取详情</el-button>
          <el-button v-if="scope.row.status !== -1 && scope.row.status < 2" type="danger" size="small" @click="endReceive(scope.row.id)">结束任务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
    <el-dialog
      title="提示"
      :visible.sync="ends"
    >
      <span style="color: red;">任务被强制结束后不能再次开启，确定要结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false, endId = ''">取 消</el-button>
        <el-button @click="endFinish" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Headers from './base/header1'
export default {
  name: 'sharetask',
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
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    formatDates(time) {
      time = Number(time)
      var date = new Date(time)
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
      endId: '',
      opertions: ['创建任务'],
      headerTitle: '调研问卷任务列表',
      tableData: [],
      itemDatas: [
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
      newpage: 1,
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
      this.newpage = Number(this.$route.query.page)
    }
  },
  mounted() {
    if (this.$route.query.page) {
      this.newpage = Number(this.$route.query.page)
      this.gteinviteList(this.newpage)
    }else{
      this.gteinviteList(1)
    }
  },
  methods: {
    endFinish() {
      http.get(api.finishTask+'/'+this.endId).then(res => {
        this.gteinviteList(this.newpage)
        this.$message('结束成功')
        this.ends = false
      }).catch(error => {
        this.ends = false
        this.$message({
          message: error.data.message,
          type: 'error'
        })
      })
    },
    endReceive(id) {
      this.ends = true
      this.endId = id
    },
    headerClick() {
      this.$router.push({ path: '/taskcenter/questionnaireCreate' })
    },
    gteinviteList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          event: 'qa_question'
        }
      }
      if (this.form.title !== '' || this.form.status !=='' || this.form.startTime
        !== '' || this.form.endTime !== '' || this.form.nickname !== '') {
        params = {
          pageNum: page,
          pageSize: 10,
          params: {
            title: this.form.title,
            status: this.form.status,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            nickname: this.form.nickname,
            event: 'qa_question'
          }
        }
        if (this.form.startTime > this.form.endTime) {
          this.$message.error('开始时间不能大于结束时间')
          return false
        }
      }
      var res = await http.post(api.questionTaskList, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
      }
    },
    searchs() {
      this.gteinviteList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.gteinviteList(val)
    },
    handleClick(id) {
      let page = this.newpage
      this.$router.push({ path: 'questionnaireDetail' + '/' + page + '?id=' + id })
    },
    handleClicks(id) {
      this.$router.push({ path: '/taskcenter/questionnaireCreate' + '?id=' + id })
    },
    receive(id) {
      let page = this.newpage
      this.$router.push({ path: 'questionnaireReceive' + '/' + page +'?id=' + id })
    }
  }
}
</script>
<style>
#lists .bigbox .el-form {
  padding: 0;
  height: 100px;
  overflow: hidden;
}
</style>
<style scoped>
#lists .bigbox {
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
#lists .querys {
  width: 130px;
  position: absolute;
  top: 140px;
  right: 20px;
}
</style>
