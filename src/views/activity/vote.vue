<template>
  <div class="vote">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input v-model="formInline.topicTitle" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动状态">
        <el-select v-model="formInline.status" placeholder="请选择活动状态">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.status"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInline.startTime" @change="startTimes">
        </el-date-picker>
        <span style="color: #fff">--</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInline.endTime" @change="endTimes">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="formInline.createBy" placeholder="请输入创建人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <TableContent class="vote-table" :page="newpage" :tableConfig="tableConfig" :tableData="tableData" @change="tabRes" @btnName="btnName"></TableContent>
    <div style="margin: 20px;"></div>
     <el-dialog
      title="提示"
      :visible.sync="ends"
      >
      <span style="color: red;">是否确认删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="isends">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="10">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import TableContent from '@/components/table-content'
import HeaderContent from '@/components/header-content'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
export default {
  name: 'vote',
  components: {
    TableContent,
    HeaderContent
  },
  computed: {
    ...mapGetters(['userAuths', 'plattitle', 'companyid'])
  },
  data() {
    return {
      tableData: [],
      newpage: 1,
      total: 1,
      obj: {},
      ends: false,
      statusList: [
        { label: '全部' },
        { label: '未发布', status: 0 },
        { label: '未开始', status: 1 },
        { label: '进行中', status: 2 },
        { label: '已结束', status: 3 },
      ],
      formInline: {
        topicTitle: null,
        status: null,
        startTime: null,
        endTime: null,
        createBy: null,
      },
      btnNames: '',
      headerTitle: '（旧）投票活动管理',
      tableConfig: [
        { label: '活动标题',prop: 'topicTitle' },
        { label: '活动开始时间',prop: 'startTime' },
        { label: '活动结束时间',prop: 'endTime' },
        { label: '创建人', prop: 'createBy' },
        { label: '参与人数',prop: 'totalUserCount' },
        { label: '创建时间',prop: 'createTime' },
        { label: '活动状态',prop: 'status' },
        { label: '操作', prop: 'action' }
      ],
    }
  },
  created() {
    if (this.$route.query.page) {
      this.newpage = Number(this.$route.query.page)
    }
  },
  mounted() {
    this.voteList(this.newpage)
  },
  methods: {
    voteList: async function (page) {
      this.formInline.companyId = this.companyid
      if (this.formInline.startTime > this.formInline.endTime) {
        this.$message.error('开始时间不能大于结束时间')
        return false
      }
      let params
      var paramsData = {
        pageNum: page,
        pageSize: 10,
        params: this.formInline
      }
      var paramsData1 = {
        pageNum: page,
        pageSize: 10,
        params: {
          companyId: this.companyid
        }
      }
      if (this.formInline.topicTitle == null && this.formInline.status == null &&
          this.formInline.startTime == null && this.formInline.endTime == null &&
          this.formInline.createBy == null) {
        params = paramsData1
      } else {
        this.formInline.topicTitle === '' ? this.formInline.topicTitle = null : this.formInline.topicTitle
        this.formInline.createBy === '' ? this.formInline.createBy = null : this.formInline.createBy
          params = paramsData
      }
      const res = await http.post(api.voteList,params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
         this.tableData.forEach((element,index) => {
           if (!this.userAuths.vote_activity_detail) {
             element.action = ['排行榜','删除']
           } else {
             element.action = ['详情','排行榜','删除']
           }
          element.startTime = this.formatDate(element.startTime)
          element.endTime = this.formatDate(element.endTime)
          element.status = this.surestatus(element.status)
          element.index = ((this.newpage -1)*20) + index + 1
          element.createTime = this.formatDate(element.createTime)
        })
      } else {
        this.$message.error(res.data.message)
      }
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
    onSubmit() {
      this.voteList(this.newpage)
    },
    startTimes() {
      this.formInline.startTime = Date.parse(this.formInline.startTime)
    },
    surestatus(val) {
      switch (val) {
        case 0:
          return  '未发布'
        case 1:
          return  '未开始'
        case 2:
          return  '进行中'
        case 3:
          return  '已结束'
      }
    },
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.voteList(this.newpage)
    },
    tabRes(row) {
      this.obj = row
    },
    btnName(val) {
      if (val === '详情') {
       let id = this.obj.id
       this.$router.push({
         path: '/activity/votedetail/' + id,
         query: {
           page: this.newpage
         }
       })
      } else if (val === '排行榜') {
        let topicTitle = this.obj.topicTitle
        let id = this.obj.id
        this.$router.push({
          path: '/activity/makeChart/' + id + '/' + this.newpage,
          query: {
            title: topicTitle
          }
        })
      } else {
        this.ends = true
      }
    },
    isends() {
     this.votedelete()
     this.ends = false
    },
    votedelete: async function() {
      let id = this.obj.id
      var params = {
        id: id
      }
      const res = await http.post(api.votedelete,params)
      if (res.data.code === 0) {
        this.voteList(this.newpage)
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  
</style>


