<template>
  <div id="list">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <ul class="wraper">
      <li v-if="pointType !== 0">
        <span>发放总积分</span>
        <span class="total">{{ pointTotal }}积分</span>
      </li>
      <li v-if="pointType === 0">
        <span>发放总医币</span>
        <span class="total">{{ pointTotal }}医币</span>
      </li>
      <li v-if="pointType === 0">
        <span>领取总医币</span>
        <span class="total">{{ pointTotal }}医币</span>
      </li>
      <li v-if="pointType !== 0">
        <span>领取总积分</span>
        <span class="total">{{ pointOut }}积分</span>
      </li>
      <li>
        <span>发放总份数</span>
        <span class="total">{{ numMax }}份</span>
      </li>
      <li>
        <span>领取总份数</span>
        <span class="total">{{ numOut }}份</span>
      </li>
    </ul>
    <div id="right">
      <el-button type="info" size="mini" @click="openDialog">导出领取结果</el-button>
      <el-dialog
          title="提示"
          :visible.sync="dialogVisible">
        <span>是否导出数据？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downLoadData">是</el-button>
          <el-button @click="dialogVisible = false">否</el-button>
        </span>
      </el-dialog>
    </div>
    <div style="margin: 100px 0;"></div>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column v-if="version === 'old'" label="受邀者" width="208">
        <template slot-scope="scope">
          <span>{{ scope.row.fromName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="version === 'old'" label="身份" width="230">
        <template slot-scope="scope">
          {{ scope.row.identityName }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="230">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="230">
        <template slot-scope="scope">
          {{ scope.row.sex === 'man' ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="医院" width="230">
        <template slot-scope="scope">
          {{scope.row.hospital}}
        </template>
      </el-table-column>
      <el-table-column label="科室" width="230">
        <template slot-scope="scope">
          {{scope.row.office}}
        </template>
      </el-table-column>
      <el-table-column label="职称" width="230">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column width="230" label="手机">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请者" width="230">
        <template slot-scope="scope">
          {{ version === 'new' ? scope.row.toUserName : scope.row.toName }}
        </template>
      </el-table-column>
      <el-table-column v-if="version === 'new'" label="邀请者手机号" width="230">
        <template slot-scope="scope">
          {{ scope.row.toUserPhone }}
        </template>
      </el-table-column>
      <el-table-column label="领取积分" width="230" v-if="pointType !== 0">
        <template slot-scope="scope">
          {{ scope.row.point }}
        </template>
      </el-table-column>
      <el-table-column label="领取医币" width="230" v-if="pointType == 0">
        <template slot-scope="scope">
          {{ scope.row.point }}
        </template>
      </el-table-column>
      <el-table-column label="领取时间" width="230">
        <template slot-scope="scope">
          {{ scope.row.createtime | formatDate }}
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next"
                   @current-change="handleCurrentChange" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import {formatDate} from '@/common/data'

export default {
  components: {
    HeaderContent
  },
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  name: "receive",
  data() {
    return {
      version: this.$route.meta.type,
      newpage: 1,
      total: 0,
      tableData: [],
      multipleSelection: [],
      pointType: null,
      opertions: ['返回'],
      headerTitle: '邀请注册任务列表->领取详情',
      id: this.$route.query.id,
      taskId: this.$route.query.id,
      pointTotal: '', // 发放总积分
      pointOut: '', // 领取总积分
      numOut: '', // 领取总份数
      numMax: '', // 发放总份数
      xlsUrl: '',
      dialogVisible: false, // 确认导出数据弹窗是否显示
    }
  },
  mounted() {
    this.inviteReceive(1)
    this.inviteDetails(this.id)
  },
  methods: {
    headerClick() {
      let page = this.$route.params.page
      this.$router.push({
        path: this.version === 'new' ? '/taskcenter/invite/new' : '/taskcenter/invite',
        query: {
          page: page
        }
      })
    },
    /*
   * 导出数据弹窗
   * */
    openDialog() {
      this.dialogVisible = true
      this.getXls()
    },
    getXls() {
      this.version === 'new' ? this.newExport() : this.oldExport()
    },
    oldExport() {
      // 旧导出
      this.$http.get(this.$api.ReceiveWatch + this.taskId).then(res => {
        let {code, message} = res.data
        if (code === 0) {
          this.xlsUrl = message
        } else {
          this.$message.error(message)
        }
      })
    },
    newExport() {
      // 新版导出
      let params = {
        event: 'enroll_new',
        id: this.taskId
      }
      this.$http.post(this.$api.ReceiveWatchNew, params).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          this.xlsUrl = data
        } else {
          this.$message.error(message)
        }
      })
    },
    downLoadData() {
      this.dialogVisible = false
      window.location.href = this.xlsUrl
    },
    inviteReceive(page) {
      let params = {
        pageNum: page,
        pageSize: 10,
        params: {
          taskId: this.version === 'new' ? null : this.id,
          id: this.version === 'new' ? this.id : null,
          event: this.version === 'new' ? 'enroll_new' : 'enroll'
        }
      }
      let apiUrl
      this.version === 'new' ? apiUrl = this.$api.inviteReceiveNew : apiUrl = this.$api.inviteReceive
      this.$http.post(apiUrl, params).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          this.tableData = this.version === 'new' ? data.list : data.data
          this.total = data.total
        } else {
          this.$message.error(message)
        }
      })
    },
    inviteDetails(id) {
      let apiUrl
      this.version === 'new' ? apiUrl = this.$api.enrollNewGet : apiUrl = this.$api.inviteDetails
      this.$http.get(apiUrl + id).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          this.pointTotal = data.pointTotal
          this.pointOut = data.pointOut
          this.numOut = data.numOut
          this.numMax = data.numMax
          this.pointType = data.pointType
        } else {
          this.$message.error(message)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.inviteReceive(val)
    },
  }
}
</script>

<style scoped>
ul, li {
  list-style: none;
}

#list .wraper {
  height: 120px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}

#list .wraper li {
  position: relative;
  width: 24%;
  border: 1px solid #ccc;
  margin: 10px 10px 0 0;
  text-align: center;
  line-height: 100px;
}

#list .wraper li .total {
  position: absolute;
  top: 30px;
  left: 45%;
}

#list #right {
  position: absolute;
  right: 30px;
  top: 300px;
}
</style>
