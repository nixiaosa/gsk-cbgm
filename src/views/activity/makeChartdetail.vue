<!--
 * @Author: your name
 * @Date: 2020-07-10 11:22:52
 * @LastEditTime: 2020-10-21 19:18:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/activity/makeChartdetail.vue
-->
<template>
  <div class="makeChartdetail">
    <header-content :title="headerTitle + title" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <TableContent :page="newpage" :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"></TableContent>
    <div style="margin:20px;"></div>
    <el-pagination background :current-page="newpage" layout="total, prev, pager, next" @current-change="handleCurrentChange" :total="total" :page-size="20">
    </el-pagination>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import TableContent from '@/components/table-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
export default {
  name: 'makeChartdetail',
  components: {
    HeaderContent,
    TableContent
  },
  data() {
    return {
      tableData: [],
      total: 1,
      id: this.$route.params.id,
      title: this.$route.query.title,
      newpage: 1,
      tableConfig: [
        { label: '姓名',prop: 'userName' },
        { label: '手机号',prop: 'phoneNo' },
        { label: '投票数',prop: 'userVoteNumber' },
        { label: '投票时间',prop: 'createTime' },
      ],
      headerTitle: '（旧）投票活动管理 > 排行榜详情 > ',
      opertions: ['返回']
    }
  },
  mounted() {
    this.makeChartdetail(this.newpage)
  },
  methods: {
    headerClick() {
      let id = this.$route.query.voteId
      this.$router.push({
        path: '/activity/makeChart/' + id + '/' + this.$route.params.page,
        query: {
          pages: this.$route.query.pages,
          title: this.title
        }
      })
    },
    makeChartdetail: async function (page) {
      var params = {
        pageSize: 20,
        pageNum: page,
        params: {
          optionId: this.id
        }
      }
      const res = await http.post(api.makeChartdetail,params)
      if (res.data.code === 0) {
        this.tableData = res.data.data.list
        this.total = res.data.data.total
        this.tableData.forEach((element,index) => {
          element.index = ((this.newpage -1)*20) + index + 1
          element.createTime = this.formatDate(element.createTime)
        })
      } else {
        this.$message.error(res.data.message)
      }
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.makeChartdetail(val)
    },
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    tabRes() {
    }
  }
}
</script>
<style scoped>

</style>


