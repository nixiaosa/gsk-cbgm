<template>
  <div id="list---2">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form label-width="130px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <Headers :itemData="itemData"></Headers>
      <contents :contentData="contentData" :conditions="conditions"></contents>
      <div style="margin: 20px" class="interval"></div>
      <el-form-item label="简介信息:"> </el-form-item>
      <div class="bigboxl">{{ this.description }}</div>
      <!-- <el-form-item label="发放总积分:" prop="name" v-if="pointType == 1">
        <span style="color:orange;">{{pointTotal}}积分</span>
      </el-form-item> -->
       <!-- <el-form-item label="发放总医币:" prop="name" v-if="pointType == 0">
        <span style="color:orange;">{{pointTotal}}医币</span>
      </el-form-item> -->
      <el-form-item label="活动状态:" prop="name">
        <span style="color:forestgreen;">{{ status | sureType }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
import Headers from './base/details-header'
import contents from './base/detaIls-content'
export default {
  name: 'detail',
  components: {
    HeaderContent,
    Headers,
    contents
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
    sureType(v) {
      switch (v) {
        case -1:
          return '未发布'
        case 0:
          return '未开始'
        case 1:
          return '已开始'
        case 2:
          return '已结束'
      }
    }
  },
  data() {
    return {
      opertions: ['返回'],
      pointType: null,
      itemData: [
        {
          label: '任务类型:',
          event: ''
        },
        {
          label: '任务名称:',
          title: ''
        },
        {
          label: '任务周期:',
          startTime: '',
          endTime: ''
        },
        {
          label: '发放积分类型:',
          pointType: ''
        }
      ],
      contentData: [
        {
          label: '领取条件:'
        }
      ],
      title: '',
      event: '',
      startTime: '',
      pointTotal: '',
      endTime: '',
      description: '',
      status: '',
      conditions: [],
      id: this.$route.query.id,
      headerTitle: '调研问卷任务列表->查看详情',
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    invitedetails: async function(id) {
      var res = await http.get(api.questionDetails + id)
      if (res.data.code === 0) {
        let obj = this.itemData
        for (let i = 0; i < obj.length; i++) {
          let num = i
          obj[num].title = res.data.data.title
          obj[num].event = res.data.data.event
          obj[num].startTime = res.data.data.startTime
          obj[num].endTime = res.data.data.endTime
          obj[num].pointType = res.data.data.pointType
        }
        this.conditions = res.data.data.conditions
        this.pointTotal = res.data.data.pointTotal
        this.status = res.data.data.status
        this.description = res.data.data.description
        this.pointType = res.data.data.pointType
      }
    },
    headerClick() {
      this.$router.push({
        path: '/taskcenter/questionnaire' ,
        query:{
          page: this.$route.params.page
        }
      })
    }
  },
  mounted() {
    this.invitedetails(this.id)
  }
}
</script>
<style>
#list---2 .el-form-item__label {
  text-align: left;
  margin-left: 20px;
}
</style>
<style scoped>
.bigbox {
  margin: 10px 10px;
  border: 1px solid #ccc;
  height: 300px;
  position: relative;
}
#pointMax {
  position: absolute;
  right: 130px;
  bottom: 40px;
  font-size: 14px;
}
.bigboxl {
  border: 1px solid #ccc;
  height: 300px;
  margin: 0 10px;
  padding-top: 20px;
}
</style>
