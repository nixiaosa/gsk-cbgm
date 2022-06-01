<template>
  <div id="conditionsId">
<!--    <el-form-item v-for="(item,index) in contentData" :key="index" :label="item.label">-->
<!--    </el-form-item>-->
    <p v-for="(item,index) in conditions" :key="index + 'a'" class="contentData">
      <el-form-item v-show="taskVersions" label="邀请者身份:"> {{ item.identityName }}</el-form-item>
      <el-form-item label="积分份数:" v-if="item.pointType === 1"> {{ item.numMax }}</el-form-item>
      <el-form-item label="医币份数:" v-if="item.pointType === 0"> {{ item.numMax }}</el-form-item>
      <el-form-item v-show="taskVersions" label="每人最多领取份数:"> {{ item.numMaxEvery }}</el-form-item>
      <el-form-item label="每人领取:"> {{ item.pointEvery }}积分</el-form-item>
      <el-form-item v-show="taskVersions" label="受邀者身份:"> {{ item.preIdentityName }}</el-form-item>
      <el-form-item v-if="item.pointType === 1" label="总积分:"> {{ item.pointMax }}积分</el-form-item>
      <el-form-item v-if="item.pointType === 0" label="总医币:"> {{ item.pointMax }}医币</el-form-item>
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      taskVersions: this.$route.meta.type === 'old'
    }
  },
  props: {
    conditions: {
      type: Array
    },
    contentData: {
      type: Array
    },
  }
}
</script>
<style scoped>
#conditionsId .contentData {
  border: 1px solid #cccccc;
  margin: 0 10px 10px 10px;
  position: relative;
}
</style>


