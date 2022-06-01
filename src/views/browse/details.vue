<template>
  <div id="list1">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form label-width="130px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <Headers :itemData="itemData"></Headers>
      <div id="contents">
        <el-form-item label="关联业务内容:"></el-form-item>
        <div id="wraper">
          <div v-for="(item, index) in businesses" :key="index + 'b'" style="margin: 15px;">
            <<{{ item.busName }}>></div>
        </div>
      </div>
      <div id="content">
        <contents :contentData="contentData" :conditions="conditions"></contents>
        <div style="margin: 20px"></div>
        <el-form-item label="简介信息:"></el-form-item>
        <div class="bigboxl">{{ this.description }}</div>
        <el-form-item label="发放总积分:" prop="name" v-if="pointType == 1">
          <span style="color:orange;">{{pointTotal}}积分</span>
        </el-form-item>
        <el-form-item label="发放总医币:" prop="name" v-if="pointType == 0">
          <span style="color:orange;">{{pointTotal}}医币</span>
        </el-form-item>
        <el-form-item label="活动状态:" prop="name">
          <span style="color:forestgreen;">{{ status | sureType }}</span>
        </el-form-item>
      </div>
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
  name: 'details',
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
    },
    brotype(v) {
      switch (v) {
        case 60:
          return '1分钟'
        case 180:
          return '3分钟'
        case 300:
          return '5分钟'
        case 600:
          return '10分钟'
        case 900:
          return '15分钟'
        case 1800:
          return '30分钟'
      }
    }
  },
  data() {
    return {
      opertions: ['返回'],
      pointType: null,
      contentData: [
        {
          lebel: '领取条件:'
        }
      ],
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
        },{
          label: '发放积分类型:',
          pointType: '',
        }
      ],
      receiveDatas: [
        {
          label: '积分份数:'
        },
        {
          label: '每人最多领取份数:'
        },
        {
          label: '观看内容:'
        }
      ],
      status: '',
      title: '',
      event: '',
      startTime: '',
      pointTotal: '',
      endTime: '',
      description: '',
      conditions: [],
      businesses: [],
      id: this.$route.query.id,
      headerTitle: '视频浏览任务列表->查看详情',
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
    lookdetails: async function(id) {
      var res = await http.get(api.lookdetails + id)
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
        this.businesses = res.data.data.businesses
        this.pointType = res.data.data.pointType
      }
    },
    headerClick() {
      this.$router.push({
        path: '/taskcenter/browse' ,
        query:{
          page: this.$route.params.page
        }
      })
    }
  },
  mounted() {
    this.lookdetails(this.id)
  }
}
</script>
<style>
#list1 .el-form-item__label {
  text-align: left;
  margin-left: 20px;
}
</style>
<style scoped>
#infor-content {
  float: left;
}
#wraper {
  min-height: 320px;
  border: 1px solid #ccc;
  margin: 0 10px;
}
.bigbox {
  margin: 10px 10px;
  border: 1px solid #ccc;
  height: 300px;
  position: relative;
}
.bigboxl {
  border: 1px solid #ccc;
  height: 300px;
  margin: 0 10px;
  padding-top: 20px;
}
#bottom {
  height: 50px;
  position: relative;
}
#ts {
  display: inline-block;
}
#clos {
  position: absolute;
  top: 0;
  left: 200px;
  color: red;
}
#pointMax {
  position: absolute;
  right: 130px;
  bottom: 50px;
  font-size: 14px;
}
.test-area {
  width: 100%;
  height: 300px;
  background-attachment: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 5px;
  padding-top: 20px;
  outline: none;
  margin: 60px 0 0 -70px;
}
#btns {
  width: 600px;
  height: 200px;
  margin: 80px 0 0 30px;
}
</style>
