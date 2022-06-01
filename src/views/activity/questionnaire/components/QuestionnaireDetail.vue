<template>
    <div>
      <p>问卷名称：{{data.questionName}}</p>
      <p>问卷状态：{{data.status | status}}</p>
      <p>创建时间：{{data.createTime | formatDate}}</p>
      <p>限答次数：{{data.limitNums}}次</p>
      <p>已答题人数：{{data.userNumber}}人</p>
      <p>收集份数：{{data.nums}}份</p>
      <p>已收集份数：{{data.submitNumber}}份</p>
      <p>创建人：{{data.createBy}}</p>
      <div>
        问卷简介：
        <div style="margin-left: 20px" v-html="data.brief"></div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'Detail',
    props: {
      data: {
        type: Object,
        default: function() {
        }
      }
    },
    filters: {
      formatDate(time) {
        let data = new Date(time).Format('yyyy-MM-dd hh:mm')
        return data
      },
      status(val) {
        switch (val) {
          case 0:
            return "未发布"
          case 1:
            return '未开始'
          case 2:
            return '未开始'
          case 3:
            return '进行中'
          case 4:
            return '已结束'
          default:
            return '未知状态'
        }
      },
    }
  }
</script>

<style scoped>

</style>
