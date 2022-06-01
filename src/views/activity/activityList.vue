<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-table
      :data="tableData"
      border
    >
      <el-table-column
        width="240"
        label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        label="活动类型">
        <template>
          <span>活动投票</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="活动时间">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | formatDate }}</span>
          <br>
          <span>{{ scope.row.endTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.state | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="是否暂停">
        <template slot-scope="scope">
          <span v-if="scope.row.isStop===1" style="color:red">已暂停</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="是否删除">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===1" style="color:red">已删除</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="参与人数">
        <template slot-scope="scope">
          <span v-if="scope.row.personCount">{{scope.row.personCount}}</span>
          <span v-if="!scope.row.personCount">0</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="135"
        label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="goDetail(scope.row.id)" v-if="activeDetail">查看详情</el-button>
          <el-button type="danger" size="small" v-if="scope.row.state!==2&&scope.row.isStop===0&&scope.row.isDeleted!==1&&activeStop" @click="stopStartActive(scope.row.id,1)">暂停</el-button>
          <el-button type="info" size="small" v-if="scope.row.state!==2&&scope.row.isStop===1&&scope.row.isDeleted!==1&&activeStop" @click="stopStartActive(scope.row.id,0)">启动</el-button>
          <el-button type="danger" size="small" v-if="scope.row.isDeleted!==1&&scope.row.state!==1&&activeDel" @click="deteleActive(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      >
    </el-table>
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
  import { mapGetters } from 'vuex'
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'modelist',
    components: {
      HeaderContent
    },
    computed: {
      ...mapGetters([
        'userAuths'
      ])
    },
    data() {
      return {
        tableData: [],
        total: 1,
        pageNum: 1,
        currentPage: 1,
        businessId: this.$route.matched[0].meta.businessId,
        activeDetail: false,
        activeStop: false,
        activeDel: false,
        headerTitle: '活动列表'
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      getState(num) {
        if (num === 0) {
          return '未开始'
        } else if (num === 1) {
          return '进行中'
        } else if (num === 2) {
          return '已结束'
        }
      }
    },
    mounted() {
      this.routers()
      this.getActiveList(1)
    },
    methods: {
      goDetail(id) {
        // this.$router.push({ path: 'activity/information/' + id })
        this.$router.push({ path: `activity/information/${this.businessId}/${id}` })
      },
      routers: async function() {
        switch (this.businessId) {
          case 1:
            if (this.userAuths.train_activity_detail) this.activeDetail = true
            if (this.userAuths.train_activity_delete) this.activeDel = true
            if (this.userAuths.train_activity_stop_start) this.activeStop = true
            break
          case 2:
            if (this.userAuths.classroom_activity_detail) this.activeDetail = true
            if (this.userAuths.classroom_activity_delete) this.activeDel = true
            if (this.userAuths.classroom_activity_stop_start) this.activeStop = true
            break
          case 3:
            if (this.userAuths.interact_class_activity_detail) this.activeDetail = true
            if (this.userAuths.interact_class_activity_delete) this.activeDel = true
            if (this.userAuths.interact_class_activity_stop_start) this.activeStop = true
            break
          case 4:
            if (this.userAuths.online_class_activity_detail) this.activeDetail = true
            if (this.userAuths.online_class_activity_delete) this.activeDel = true
            if (this.userAuths.online_class_activity_stop_start) this.activeStop = true
            break
          case 5:
            if (this.userAuths.academic_conference_activity_detail) this.activeDetail = true
            if (this.userAuths.academic_conference_activity_delete) this.activeDel = true
            if (this.userAuths.academic_conference_activity_stop_start) this.activeStop = true
            break
          default:
            this.activeDetail = true
            this.activeDel = true
            this.activeStop = true
            break
        }
      },
      getActiveList: async function(pageNum) {
        var params = {
          pageSize: 10,
          pageNum: pageNum
        }
        var res = await http.post(api.activeList + '/' + `${this.businessId}`, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.tableData = res.data.data.data
          this.total = res.data.data.total
        }
      },
      stopStartActive: async function(id, state) {
        var params = {
          id: id,
          isStop: state
        }
        var res = await http.post(api.stopStartActive, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.getActiveList(this.currentPage)
        }
      },
      deteleActive: async function(id) {
        var res = await http.get(api.deteleActive + id, {})
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.getActiveList(this.currentPage)
        }
      },
      handleCurrentChange(val) {
        this.getActiveList(val)
      }
    }
  }
</script>
<style>
</style>
