<!--
 * @Author: your name
 * @Date: 2021-04-19 10:34:11
 * @LastEditTime: 2021-04-23 10:31:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/lottery/base/header1.vue
-->
<template>
  <div id="game">
    <el-form label-width="110px" :label-position="labelPosition">
      <el-form-item v-for="(item,index) in itemDatas" :label="item.label" :key="index" prom="name" style="float:left;">
        <el-select v-model="form.status" placeholder="请选择" v-if="item.label==='活动状态'" style="margin-left:-41px;">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status">
          </el-option>
        </el-select>
         <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd" v-if="item.label==='活动周期'" v-model="form.startTime" @change="startTimes" style="margin-left:-41px;">
        </el-date-picker>
         <span style="color: #fff" v-if="item.label==='活动周期'">至</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd" v-if="item.label==='活动周期'" v-model="form.endTime" @change="endTimes">
        </el-date-picker>
        <el-input :placeholder="item.placeholder" v-if="item.label==='活动名称'" v-model="form.title" style="margin-left:-41px;width:180px;"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: 'left'
    }
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
    },
  },
  methods: {
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
<style>
#game .el-form .el-form-item {
  margin-right: 20px;
}

</style>

<style scoped>
#game {
  position: relative;
}
</style>


