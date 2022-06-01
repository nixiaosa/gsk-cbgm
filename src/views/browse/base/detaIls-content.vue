<template>
  <div id="conditions">
    <el-form-item v-for="(item,index) in contentData" :key="index" :label="item.label">
    </el-form-item>
    <p v-for="(item,index) in conditions" :key="index" class="contentData">
      <el-form-item label="领取身份:">{{ item.identityName }}</el-form-item>
      <el-form-item label="每人领取:">{{ item.pointEvery }}</el-form-item>
      <el-form-item label="观看时长:">{{ item.pro.browseTime/60 }}分钟</el-form-item>
      <el-form-item label="积分份数:" v-if="item.pointType == 1">{{ item.numMax }}</el-form-item>
      <el-form-item label="医币份数:" v-if="item.pointType == 0">{{ item.numMax }}</el-form-item>
      <el-form-item label="每人最多领取份数:">{{ item.numMaxEvery }}</el-form-item>
      <el-form-item label="观看内容:">任意1个关联的业务内容</el-form-item>
      <span class="pointMax" v-if="item.pointType == 1">总积分:{{ item.pointMax }}积分</span>
      <span class="pointMax" v-if="item.pointType == 0">总医币:{{ item.pointMax }}医币</span>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    conditions: {
      type: Array
    },
    contentData: {
      type: Array
    },
    receiveDatas: {
      type: Array
    }
  }
}
</script>
<style scoped>
#conditions .contentData {
  border: 1px solid #cccccc;
  height: 300px;
  margin: 0 10px 10px 10px;
  position: relative;
  overflow: hidden;
}
#conditions .pointMax {
  position: absolute;
  right: 180px;
  bottom: 40px;
  font-size: 14px;
}
</style>


