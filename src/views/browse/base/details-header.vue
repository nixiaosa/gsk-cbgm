<template>
  <div id="detailsHeader">
    <el-form-item v-for="(item,index) in itemData" :key="index" :label="item.label">
      <span v-if="item.label=='任务类型:'">{{item.event | eventType}}</span>
      <span v-if="item.label=='任务名称:'">{{item.title}}</span>
      <span v-if="item.label == '任务周期:'">{{item.startTime | formatDate}} 到 {{item.endTime | formatDate}}</span>
      <span v-if="item.label=='发放积分类型:'">{{ item.pointType | point }}</span>
    </el-form-item>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
export default {
  props: {
    itemData: {
      type: Array
    }
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
    eventType(v) {
      switch (v) {
        case 'enroll':
          return '邀请注册任务'
        case 'look':
          return '视频浏览任务'
      }
    },
    point(v) {
      switch (v) {
        case 0:
          return '医百医币'
        case 1:
          return '平台积分'  
      }
    }
  }
}
</script>
<style scoped>
</style>


