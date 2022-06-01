<template>
  <div id="list">
    <header-content :opertions="opertions" @header-btn-click="headerClick" :title="headerTitle"></header-content>
    <Search v-on:change="setForm" :itemDatas="itemDatas" />
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column width="70" label="序号">
        <template slot-scope="scope">
          <span>{{ ((newpage-1)*10)+scope.$index+1 }}</span>
        </template>
      </el-table-column>
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
          <el-tag type="primary">{{ scope.row.status | sureType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="350">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="handleClick(scope.row.id)">查看</el-button>
          <el-button type="info" size="small" v-if="userAuths.edit_video_look && scope.row.status === -1" @click="handleClicks(scope.row.id)">编辑</el-button>
          <el-button type="info" size="small" @click="receive(scope.row.id)" v-if="scope.row.status!== -1">领取详情</el-button>
          <el-button v-if="scope.row.status !== -1 && scope.row.status < 2" type="danger" size="small" @click="endReceive(scope.row.id)">结束任务</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  import Search from '@/components/search/index'
  export default {
    name: 'sharetask',
    components: {
      HeaderContent,
      Search
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
        endId: '',
        ends: false,
        opertions: ['创建任务', '返回'],
        headerTitle: '答题奖励任务列表',
        tableData: [],
        form: {},
        itemDatas: [
          {
            type: 'title',
            label: '任务名称',
            placeholder: '请输入任务名称'
          },
          {
            type: 'status',
            label: '任务状态',
            placeholder: '请选择'
          },
          {
            type: 'timeScope',
            label: '任务周期'
          },
          {
            type: 'createUser',
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
        value8: ''
      }
    },
    created() {
      if (!this.userAuths.create_answer_task) this.opertions = ['返回']
      if (this.$route.query.page) {
        this.newpage = Number(this.$route.query.page)
      }
    },
    mounted() {
      this.gteinviteList(1)
    },
    methods: {
      setForm(item) {
        this.form = item
        this.gteinviteList(1)
      },
      endFinish() {
        let params = {
          id: this.endId
        }
        http.post(api.company.taskFinish, params).then(res => {
          if (res.data.code===0) {
            this.gteinviteList(this.newpage)
            this.$message('结束成功')
            this.ends = false
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }

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
      headerClick(item) {
        if (item === '返回') {
          this.$router.back()
        } else {
          this.$router.push({ path: 'createAll/1'})
          // this.$router.push({params: 'createAll'})
        }
      },
      gteinviteList: async function(page) {
        var params = {
          pageNum: page,
          pageSize: 10,
          params: {
            event: 'question'
          }
        }
        if (this.form.title !=='' || this.form.status !=='' || this.form.startTime !==''
          || this.form.endTime !=='' || this.form.nickname !=='') {
          params = {
            pageNum: page,
            pageSize: 10,
            params: {
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
        var res = await http.post(api.answerList, params)
        if (res.data.code === 0) {
          this.tableData = res.data.data.data
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      searchs() {
        this.gteinviteList(1)
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
        this.$router.push({ path: `taskdetails/${id}/${page}` })
      },
      handleClicks(id) {
        // this.$router.push({ path: 'creates' + '?id=' + id })
        this.$router.push({ path: 'createAll/1/' + id})
      },
      receive(id) {
        let page = this.newpage
        this.$router.push({ path: `taskGetDetails/${id}/${page}/1` })
      }
    }
  }
</script>
<style>
</style>
<style scoped>
  .centers {
    display: block;
    width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .centers:hover {
    display: block;
    width: 300px;
    overflow: auto;
    white-space: nowrap;
    cursor: pointer;
  }
  #list .querys {
    width: 130px;
    position: absolute;
    top: 140px;
    right: 20px;
  }
</style>
