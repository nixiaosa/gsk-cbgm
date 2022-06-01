<template>
  <div class="modelist">
    <!--<el-input-->
    <!--style="width:200px;margin-bottom:15px;"-->
    <!--placeholder="搜索"-->
    <!--icon="search"-->
    <!--v-model="searchVal"-->
    <!--:on-icon-click="searchClick">-->
    <!--</el-input>-->
    <header-content :title="headerTitle"></header-content>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="发放人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.userAttend.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联内容">
        <template slot-scope="scope">
          <span>{{ scope.row.video.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sourceType | typechange }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.userAttend.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="奖励类型">
        <template slot-scope="scope">
          <span>{{ scope.row.awardType ==='bribery' ? '红包' : '物品' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70" label="个数">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="发放方式">
        <template slot-scope="scope">
          <span>{{ scope.row.equal === 1 ? '平均' : '随机' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取条件" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.receiveWatchTime | ssss}} </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}} </span>
        </template>
      </el-table-column>
      <el-table-column label="领取个数">
        <template slot-scope="scope">
          <span>{{ scope.row.outNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.outMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="info" size="small" v-if="bagDetail">查看</el-button>
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
      headerTitle: '百福袋管理',
      searchVal: '',
      totalNum: 10,
      tableData: [],
      multipleSelection: [],
      businessId: this.$route.matched[0].meta.businessId,
      bagDetail: false,
      newpage: 1
    }
  },
  filters: {
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    ssss(str) {
      var min = str / 60
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
      if (num === 'video') {
        return '视频'
      }
    }
  },
  mounted() {
    this.routers()
    this.queryAward(this.newpage)
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
    searchClick() {},
    routers: async function() {
      switch (this.businessId) {
        case 1:
          if (this.userAuths.train_fortune_bag_detail) this.bagDetail = true
          break
        case 2:
          if (this.userAuths.classroom_fortune_bag_detail) this.bagDetail = true
          break
        case 3:
          if (this.userAuths.interact_class_fortune_bag_detail) this.bagDetail = true
          break
        case 4:
          if (this.userAuths.online_class_fortune_bag_detail) this.bagDetail = true
          break
        case 5:
          if (this.userAuths.academic_conference_fortune_bag_detail) this.bagDetail = true
          break
        default:
          this.bagDetail = true
          break
      }
    },
    queryAward: async function(page) {
      // 查询百福袋列表
      var params = {
        pageNum: this.newpage,
        pageSize: 10
      }
      var res = await http.post(api.award + this.businessId, params)
      if (res.data.code === 0) {
        this.totalNum = parseInt(res.data.data.total)
        this.tableData = res.data.data.data
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCurrentChange(val) {
      this.queryAward(val)
      this.newpage = val
    },
    handleClick(id) {
      this.gotoDetail(id)
    },
    gotoDetail(id) {
      this.$router.push({
        path: 'blessdetail/' + id,
        query: {
          page: this.newpage
        }
      })
    }
  }
}
</script>
