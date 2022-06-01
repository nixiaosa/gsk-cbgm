<template>
  <div id="list---2">
    <header-content :title="headerTitle" :opertions="btnList" @header-btn-click="headerClick"></header-content>
    <el-form label-width="130px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <Headers :itemData="itemData"></Headers>
      <contents :contentData="contentData" :conditions="conditions"></contents>
      <div style="margin: 20px" class="interval"></div>
      <el-form-item label="简介信息:"> </el-form-item>
      <div class="bigBoxL" v-html="description"></div>
      <el-form-item label="发放总积分:" prop="name" v-if="pointType === 1">
        <span style="color:orange;">{{pointTotal}}积分</span>
      </el-form-item>
       <el-form-item label="发放总医币:" prop="name" v-if="pointType === 0">
        <span style="color:orange;">{{pointTotal}}医币</span>
      </el-form-item>
      <el-form-item label="活动状态:" prop="name">
        <span style="color:forestgreen;">{{ status | sureType }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import HeaderContent from '@/components/header-content'
import { formatDate } from '@/common/data'
import Headers from './base/details-header'
import contents from './base/detaIls-content'
export default {
  name: 'InviteDetails',
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
      let date = new Date(time)
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
      taskVersions: this.$route.meta.type,
      btnList: ['返回'],
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
      headerTitle: '邀请注册列表->查看详情',
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
  mounted() {
    this.inviteDetails(this.id)
  },
  methods: {
    inviteDetails(id) {
      let apiUrl = this.taskVersions === 'new' ? this.$api.inviteDetailsNew : this.$api.inviteDetails
      this.$http.get(apiUrl + id).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          let obj = this.itemData
          for (let i = 0; i < obj.length; i++) {
            let num = i
            obj[num].title = data.title
            obj[num].event = data.event
            obj[num].startTime = data.startTime
            obj[num].endTime = data.endTime
            obj[num].pointType = data.pointType
          }
          this.conditions = data.conditions
          this.pointTotal = data.pointTotal
          this.status = data.status
          this.description = data.description
          this.pointType = data.pointType
        }
      })
    },
    headerClick() {
      let pushUrl
      if (this.$route.meta.type === 'new') {
        pushUrl = '/taskCenter/invite/new'
      } else {
        pushUrl = '/taskCenter/invite'
      }
      this.$router.push({
        path: pushUrl,
        query:{
          page: this.$route.params.page
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#list---2 {
  .el-form-item__label {
    text-align: left;
    margin-left: 20px;
  }
}
.bigBoxL {
  border: 1px solid #ccc;
  height: 300px;
  margin: 0 10px;
  padding-top: 20px;
  white-space: pre-wrap;
}
</style>
