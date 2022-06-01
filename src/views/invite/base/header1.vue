<template>
  <div id="bigbox">
    <el-form  class="demo-form-inline" :inline="true">
      <el-form-item v-for="(item,index) in itemDatas" :label="item.label" :key="index" prom="name" style="margin-right:10px;">
        <el-input :placeholder="item.placeholder" v-if="item.label==='任务名称'" v-model="form.title" style="width: 180px;"></el-input>
        <el-input :placeholder="item.placeholder" v-if="item.label==='创建者'" v-model="form.nickname" style="width: 180px;"></el-input>
        <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd" v-if="item.label==='任务周期'" v-model="form.startTime" @change="startTimes" style="width: 180px;">
        </el-date-picker>
        <span class="to" v-if="item.label==='任务周期'">至</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd" v-if="item.label==='任务周期'" v-model="form.endTime" @change="endTimes" style="width: 180px;">
        </el-date-picker>
        <el-select v-model="form.status" placeholder="请选择" style="width: 180px;" v-if="item.label==='任务状态'">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search()">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
export default {
  components: {
    HeaderContent
  },
  props: {
    itemDatas: {
      type: Array
    },
    options: {
      type: Array
    },
    form: {
      type: Object
    }
  },
  methods: {
    search() {
      this.$emit('search')
    },
    endTimes() {
      if (this.form.endTime.getFullYear) {
        let Year = this.form.endTime.getFullYear()
        let Month = this.form.endTime.getMonth() + 1
        let getDate = this.form.endTime.getDate()
        this.form.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime()
      }
    },
    startTimes() {
      this.form.startTime = Date.parse(this.form.startTime)
    }
  }
}
</script>
<style scoped>
#bigbox {
  width: 100%;
  height: 40px;
  overflow: hidden;
  margin-bottom: 20px;
}
#bigbox .to {
  color: #fff;
  margin: 0 5px;
}
</style>


