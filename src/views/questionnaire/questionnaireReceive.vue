<template>
  <div id="list">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <ul class="wraper">
      <li v-if="pointType !== 0">
        <span>发放总积分</span>
        <span class="total">{{ pointTotal }}积分</span>
      </li>
      <li v-if="pointType == 0">
        <span>发放总医币</span>
        <span class="total">{{ pointTotal }}医币</span>
      </li>
       <li v-if="pointType == 0">
        <span>领取总医币</span>
        <span class="total">{{ pointTotal }}医币</span>
      </li>
      <li v-if="pointType !== 0">
        <span>领取总积分</span>
        <span class="total">{{pointOut}}积分</span>
      </li>
      <li>
        <span>发放总份数</span>
        <span class="total">{{numMax}}份</span>
      </li>
      <li>
        <span>领取总份数</span>
        <span class="total">{{numOut}}份</span>
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
      <el-table-column label="姓名" width="208">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="230">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column>
      <el-table-column label="手机" width="230">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column width="230" label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" width="230" v-if="pointType !== 0">
        <template slot-scope="scope">
          {{ scope.row.city}}
        </template>
      </el-table-column>
      <el-table-column label="区县" width="230" v-if="pointType == 0">
        <template slot-scope="scope">
          {{ scope.row.county}}
        </template>
      </el-table-column>
      <el-table-column label="医院" width="230">
        <template slot-scope="scope">
          {{ scope.row.hospital}}
        </template>
      </el-table-column>
      <el-table-column label="科室" width="230">
        <template slot-scope="scope">
          {{ scope.row.office }}
        </template>
      </el-table-column>
      <el-table-column label="职称" width="230">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="领取积分" width="230">
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
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  export default {
    components: {
      HeaderContent
    },
    filters:{
      formatDate(time) {
        time = Number(time)
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    name: "receive",
    data() {
      return {
        newpage: 1,
        total: 0,
        tableData: [],
        multipleSelection: [],
        pointType: null,
        opertions: ['返回'],
        headerTitle: '调研问卷任务列表->领取详情',
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
      this.invitedetails(this.id)
    },
    methods:{
      headerClick() {
        let page = this.$route.params.page
        this.$router.push({
          path: '/taskcenter/questionnaire' ,
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
      getXls: async function() {
        var params = {
        id: this.id,
        event: 'qa_question'
        }
        var res = await http.post(api.questionReceiveListExport, params)
        if (res.data.code === 0) {
           this.xlsUrl = res.data.data
        }
      },
      downLoadData() {
        this.dialogVisible = false
        window.open(this.xlsUrl)
      },
      inviteReceive: async function(page) {
        var params = {
          pageNum: page,
          pageSize: 10,
          params:{
            id: this.id,
            event: 'qa_question'
          }
        }
        var res = await http.post(api.questionReceiveList,params)
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      invitedetails: async function(id) {
        var res = await http.get(api.questionReceiveDetails + id)
        if (res.data.code === 0) {
          this.pointTotal = res.data.data.pointTotal
          this.pointOut = res.data.data.pointOut
          this.numOut = res.data.data.numOut
          this.numMax = res.data.data.numMax
          this.pointType = res.data.data.pointType
        }
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
  ul,li{
    list-style: none;
  }
  #list  .wraper{
    height: 120px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  #list .wraper li{
    position: relative;
    width: 24%;
    border:1px solid #ccc;
    margin: 10px 10px 0 0;
    text-align: center;
    line-height: 100px;
  }
  #list .wraper li .total{
    position: absolute;
    top: 30px;
    /* left: 45%; */
    left:50%;
    transform: translateX(-50%);
  }
  #list #right{
    position: absolute;
    right: 30px;
    top: 300px;
  }
</style>
