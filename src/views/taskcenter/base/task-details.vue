<template>
  <div>
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div>
      <el-form label-width="80px" :model="formLabelAlign">
        <el-form-item label="答题类型:">
          <span>答题奖励</span>
        </el-form-item>
        <el-form-item label="任务名称:">
          <span>{{dataInfo.title}}</span>
        </el-form-item>
        <el-form-item label="任务周期:">
          <span>{{dataInfo.startTime | formatDate}} 至 {{dataInfo.endTime | formatDate}}</span>
        </el-form-item>
        <el-form-item label="积分类型:">
          <span>{{dataInfo.pointType===1?'平台积分':'医百积分'}}</span>
        </el-form-item>
        <el-form-item label="活动状态:">
          <span>{{dataInfo.status | sureType}}</span>
        </el-form-item>
        <el-form-item label="关联内容:">
          <span v-for="(item,index) in dataInfo.businesses" :key="index" style="margin-right: 10px">{{item.busName}}</span>
        </el-form-item>
      </el-form>
      <span class="label_titlt">领取条件：</span>
      <div class="border_box" v-if="dataInfo.conditions">
        <el-form label-width="80px" :model="formLabelAlign">
          <el-form-item label="积分份数:">
            <span>{{dataInfo.conditions[0].numMax}}</span>
          </el-form-item>
          <el-form-item label="领取规则:">
            <span>大于等于{{dataInfo.conditions[0].pro.pointLimit}}分</span>
          </el-form-item>
          <el-form-item label="每人领取:">
            <span>{{dataInfo.conditions[0].pointEvery}}</span>
          </el-form-item>
          <el-form-item label="总积分:">
            <span>{{dataInfo.conditions[0].pointMax}}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span class="label_titlt">活动简介：</span>
    <div class="border_box">
      {{dataInfo.description}}
    </div>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: 'taskDetails',
    data() {
      return {
        formLabelAlign: {
          type: '',
          name: '',
          region: ''
        },
        dataInfo: '',
        headerTitle: '任务详情',
        opertions: ['返回']
      }
    },
    filters: {
      sureType(v) {
        switch (v) {
          case -1:
            return '未发布'
          case 0:
            return '未开始'
          case 1:
            return '进行中'
          case 2:
            return '已结束'
        }
      },
      formatDate(time) {
        if (!time) {
          return ''
        }
        time = Number(time)
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd')
      },
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        http.get(api.answerDetail + this.$route.params.id).then(res => {
          this.dataInfo = res.data.data
        })
      },
      headerClick() {
        this.$router.back()
      }
    },
    components: {
      HeaderContent
    }
  }
</script>
<style scoped lang="scss">
  .label_titlt {
    line-height: 40px;
  }
  .border_box {
    width: 600px;
    padding: 20px;
    border: 1px solid #999999;
  }
</style>
