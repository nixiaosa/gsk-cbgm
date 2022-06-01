<template>
  <div id="createHeader">
    <el-form-item v-for="(item,index) in itemDatas" :label="item.label" :key="index" prop="name" :rules="rules">
      <div v-if="item.label=='任务类型'" class="enrollTask">邀请任务</div>
      <div v-if="item.label=='任务类型'" class="Tasktype">
        提示：平台用户邀请目标用户注册成功，才能获取积分奖励，如果要给受邀者相应积分奖励，需同时发布实名注册任务
      </div>
      <el-input :placeholder="item.placeholder" style="width:350px;" v-if="item.label=='任务名称'" v-model="addoptions.title"></el-input>
      <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd" v-if="item.label=='任务周期'" @change="times" v-model="addoptions.startTime">
      </el-date-picker>
      <span class="to" v-if="item.label=='任务周期'">-</span>
      <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd" v-if="item.label=='任务周期'" @change="endTimes" v-model="addoptions.endTime">
      </el-date-picker>
      <el-select v-model="addoptions.pointType" placeholder="请选择积分类型" v-if="item.label=='发放积分类型'" :disabled="isdisabled" @change="pointTypes">
        <el-option
          v-for="item in points"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    itemDatas: {
      type: Array
    },
    itemData: {
      type: Array
    },
    id: '',
    addoptions: {
      type: Object
    },
    points:{
      type: Array
    }
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      event: 'enroll',
      isdisabled: false,
      title: '',
      rules: [{ required: true, trigger: 'blue', message: '' }]
    }
  },
  mounted() {
    if (this.id && this.id !== '') {
      this.isdisabled = true
    }
  },
  methods: {
    times() {
      this.addoptions.startTime = Date.parse(this.addoptions.startTime)
    },
    pointTypes(val) {
      val == 1 ? this.itemData[1].label = '积分份数' : this.itemData[1].label = '医百医币份数'
      val == 1 ? this.itemData[1].placeholder = '请设置积分份数' : this.itemData[1].placeholder = '请设置医百医币份数'
      val == 1 ? this.itemData[2].placeholder = '请输入领取积分' : this.itemData[2].placeholder = '请输入领取医币'
    },
    endTimes() {
      if (this.addoptions.endTime.getFullYear) {
        let Year = this.addoptions.endTime.getFullYear()
        let Month = this.addoptions.endTime.getMonth() + 1
        let getDate = this.addoptions.endTime.getDate()
        this.addoptions.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime()
      }
    }
  }
}
</script>
<style scoped>
#createHeader .to {
  margin: 0 5px;
  color: #fff;
}
#createHeader .Tasktype {
  height: 20px;
  color: #ccc;
}
</style>



