<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="试卷状态">
        <el-select v-model="formInline.states" placeholder="请选择试卷状态">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.states"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="答题周期">
        <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInline.beginTime" @change="startTimes" >
        </el-date-picker>
        <span style="color: #ffffff">-</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInline.endTime" @change="endTimes">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="试卷名称">
        <el-input v-model="formInline.name" placeholder="请输入试卷名称"></el-input>
      </el-form-item>
      <el-form-item style="">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableDatas"
      border
    >
      <el-table-column label="试卷名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.examPageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答题周期" width="280px">
        <template slot-scope="scope">
          <span>
            {{ scope.row.startTime | formatDates }} - {{ scope.row.endTime | formatDates }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="答题时限">
        <template slot-scope="scope">
          <span>{{ scope.row.limitTime }}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="已答题人数">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.finishiNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试卷状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetail(scope.row.id)">查看</el-button>
          <el-button type="danger" size="small" @click="endcase(scope.row.id)" v-if="scope.row.status === 2">结束答题</el-button>
          <!-- <el-button v-show="scope.row.isCredentials" type="info" size="small" @click="photoExport(scope.row.id)">导出证件信息</el-button> -->
          <!-- <el-button
            type="info"
            size="small"
            @click="goApplyList(scope.row)"
          >申请管理</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="确认提示"
      :visible.sync="ends"
    >
      <span style="color: red;">强制结束后不能再次开启，确定要结束吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="endsVideo">确 定</el-button>
      </span>
    </el-dialog>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  export default {
    name: "findExamManageLis",
    components: {
      HeaderContent
    },
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      gethasTask(v) {
        switch (v) {
          case 0:
            return '否'
          case 1:
            return '是'
        }
      },
      formatDates(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd hh:mm')
      },
      getState(state) {
        switch (state) {
          case 0:
            return '未发布'
          case 1:
            return '未开始'
          case 2:
            return '进行中'
          case 3:
            return '已结束'
          case 4:
            return '已失效'
        }
      }
    },
    data() {
      return {
        xlsUrls: '',
        headerTitle: '线上答题管理',
        currentPage: 1,
        total: 1,
        ends: false,
        id: '2',
        endId: '',
        tableDatas: [],
        statusList: [
          { label: '全部' },
          { label: '未发布', states: 0 },
          { label: '未开始', states: 1 },
          { label: '进行中', states: 2 },
          { label: '已结束', states: 3 },
          { label: '已失效', states: 4 }
        ],
        formInline: {
          states: null,
          beginTime: null,
          endTime: null,
          name: null
        }
      }
    },
    mounted() {
      this.findExamManageLis(this.currentPage)
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      // 导出证件照
      async photoExport(id) {
        var res = await http.get(api.questionManageCredentialsExport + id)
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.xlsUrls = res.data.data
          window.open(this.xlsUrls)
        } else {
          this.$message.error(res.data.message)
        }
      },
      goApplyList(row){
        this.$router.push({
          path: "answerManage/applylist/" + row.id,
          query: {
            isAutoAudit: row.auditStatus
          }
        });
      },
      findExamManageLis: async function(pageNum) {
        if (this.formInline.beginTime > this.formInline.endTime) {
          this.$message.error("开始时间不能大于结束时间")
          return false
        }
        let params = {}
        if (this.formInline.states === null && this.formInline.beginTime === null
          && this.formInline.endTime === null && this.formInline.name === null) {
          params = {
            pageNum: pageNum,
            pageSize: 10
          }
        } else {
          this.formInline.states === '' ? this.formInline.states = null : this.formInline.states
          this.formInline.name === '' ? this.formInline.name = null : this.formInline.name
          params = {
            pageNum: pageNum,
            pageSize: 10,
            status: this.formInline.states,
            examPaperName: this.formInline.name,
            startTime: this.formInline.beginTime,
            endTime: this.formInline.endTime
          }
        }
        const res = await http.post(api.findManageLis,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      godetail(id) {
        this.$router.push({
          path: '/activity/answerDetail/' + id,
          query: {
            page: this.currentPage
          }
        })
      },
      handleCurrentChange(val) {
        this.findExamManageLis(val)
        this.currentPage = val
      },
      endcase(id) {
        this.endId = id
        this.ends = true
      },
      startTimes() {
        this.formInline.beginTime = Date.parse(this.formInline.beginTime)
      },
      endTimes() {
        if (this.formInline.endTime.getFullYear) {
          let Year = this.formInline.endTime.getFullYear()
          let Month = this.formInline.endTime.getMonth() + 1
          let getDate = this.formInline.endTime.getDate()
          this.formInline.endTime = new Date(
            `${Year}/${Month}/${getDate} 23:59:59`
          ).getTime()
        }
      },
      endsVideo() {
        this.endcaseCollection()
        this.ends = false
      },
      endcaseCollection: async function() {
        const res = await http.post(api.doFinish + this.endId)
        if (res.data.code === 0) {
          this.findExamManageLis(this.currentPage)
        } else {
          this.$message.error(res.data.message)
        }
      },
      onSubmit() {
        this.findExamManageLis(this.currentPage)
      }
    }
  }
</script>

<style scoped>

</style>
