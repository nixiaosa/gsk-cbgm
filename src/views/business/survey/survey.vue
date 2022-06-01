<template>
  <div class="modelist">
    <!--<el-input-->
    <!--style="width:200px;margin-bottom:15px;"-->
    <!--placeholder="搜索"-->
    <!--icon="search"-->
    <!--v-model="searchVal"-->
    <!--:on-icon-click="handleIconClick">-->
    <!--</el-input>-->
    <header-content :title="headerTitle"></header-content>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="标2题" width="260">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.userAttend.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联内容" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.video && scope.row.video !== null">{{ scope.row.video.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联类型" width="100">
        <template slot-scope="scope">
          <span>视频</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="154">
        <template slot-scope="scope">
          <span>{{ scope.row.userAttend.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问卷个数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.answersTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成个数" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.joinNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="169">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="210">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="info" size="small" v-if="surveyDetail">查看</el-button>
          <el-button :loading="isLoading" v-show="!scope.row.isDeleted" type="danger" size="small" @click="stop('1', scope.row.id)">
            停用
          </el-button>
          <el-button :loading="isLoading" v-show="scope.row.isDeleted" type="success" size="small" @click="stop('0', scope.row.id)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination background layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="totalNum" :current-page.sync="newpage">
    </el-pagination>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate, strToJson } from '@/common/data'
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
      isLoading: false,
      headerTitle: '调查问卷管理',
      searchVal: '',
      newpage: 1,
      totalNum: 10,
      tableData: [],
      multipleSelection: [],
      businessId: this.$route.matched[0].meta.businessId
    }
  },
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    ssss(str) {
      var obj = strToJson(str)
      var min = obj.watchTime / 60
      if (min === 0) {
        return '无'
      }
      str = '观看时长>' + min + '分钟'
      return str
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
    typechange(num) {
      if (num === 0) {
        return '直播'
      }
      if (num === 1) {
        return '视频'
      }
      if (num === 2) {
        return '调查问卷'
      }
    }
  },
  mounted() {
    this.routers()
    this.queryQuestionnaire(this.newpage)
  },
  created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page)
      this.newpage = page
    } else {
      this.newpage = this.newpage
    }
  },
  methods: {
    stop(type, id) {
      this.isLoading = true
      let params = {
        isDeleted: type,
        id: id
      }
      this.$http.post(this.$api.stopQuestionnaire, params).then(res => {
        this.isLoading = false
        let {code} = res.data
        if (code === 0) {
          this.queryQuestionnaire(this.newpage)
        }
      })
    },
    handleIconClick() {},
    routers: async function() {
      switch (this.businessId) {
        case 1:
          if (this.userAuths.train_questionnaire_detail) this.surveyDetail = true
          break
        case 2:
          if (this.userAuths.classroom_questionnaire_detail) this.surveyDetail = true
          break
        case 3:
          if (this.userAuths.interact_class_questionnaire_detail) this.surveyDetail = true
          break
        case 4:
          if (this.userAuths.online_class_questionnaire_detail) this.surveyDetail = true
          break
        case 5:
          if (this.userAuths.academic_conference_questionnaire_detail) this.surveyDetail = true
          break
        default:
          this.surveyDetail = true
          break
      }
    },
    queryQuestionnaire: async function(page) {
      var params = {
        pageNum: this.newpage,
        pageSize: 10
      }
      var res = await http.post(
        api.queryQuestionnaire + `${this.businessId}`,
        params
      )
      if (res.data.code === 0) {
        this.totalNum = parseInt(res.data.data.total)
        this.tableData = res.data.data.data
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.queryQuestionnaire(val)
      this.newpage = val
    },
    handleClick(id) {
      this.gotoDetail(id)
    },
    gotoDetail(id) {
      this.$router.push({
         path: 'surveydetail/' + id ,
         query: {
           page: this.newpage
          }
         })
    }
  }
}
</script>
<style>
</style>
