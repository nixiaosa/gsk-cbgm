<!--
 * @Author: your name
 * @Date: 2020-08-17 10:39:02
 * @LastEditTime: 2020-08-17 17:38:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/questionnaire/base/detaIls-content.vue
-->
<template>
  <div id="conditionsId">
    <div style="margin:10px">领取条件：</div>
    <p v-for="(item,index) in conditions" :key="index + 'a'" class="contentData">
      <!-- <el-form-item label="邀请者身份:"> {{ item.identityName }}</el-form-item> -->
      <el-form-item label="积分份数:" v-if="item.pointType == 1"> {{ item.numMax }}</el-form-item>
      <el-form-item label="医币份数:" v-if="item.pointType == 0"> {{ item.numMax }}</el-form-item>
      <!-- <el-form-item label="每人最多领取份数:"> {{ item.numMaxEvery }}</el-form-item> -->
      <!-- <el-form-item label="每人领取:"> {{ item.pointEvery }}</el-form-item> -->
      <!-- <el-form-item label="受邀者身份:"> {{ item.preIdentityName }}</el-form-item> -->
      <el-form-item label="领取规则:">问卷完成领取积分</el-form-item>
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
  }
}
</script>
<style scoped>
#conditionsId .contentData {
  border: 1px solid #cccccc;
  /* height: 200px; */
  padding: 20px 0;
  box-sizing: border-box;
  margin: 0 10px 10px 10px;
  position: relative;
}
#conditionsId .pointMax {
  margin-left: 20px;
  font-size: 14px;
}
</style>


