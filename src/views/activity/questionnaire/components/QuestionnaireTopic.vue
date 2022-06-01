<!--
 * @Author: your name
 * @Date: 2021-01-11 21:53:44
 * @LastEditTime: 2021-02-19 11:19:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/activity/questionnaire/components/QuestionnaireTopic.vue
-->
<template>
    <div>
      <div v-for="(item, index) in data" :key="index" class="radioBox">
        <div v-if="item.questionType === 'radio'">
          <p>{{index+1}}.{{item.itemName}}</p>
          <el-radio-group>
            <p class="radioBox" v-for="(list, index) in item.options" :key="index">
              <el-radio disabled :label="3">
                <span style="color: dimgray">{{list.optionNo}}.{{list.optionName}}</span>
                <span style="margin-left: 30px">{{list.percentVal || 0}}%</span>
              </el-radio>
            </p>
          </el-radio-group>
        </div>
        <div v-if="item.questionType === 'checkbox'">
          <p>{{index+1}}.{{item.itemName}}</p>
          <el-checkbox-group>
            <p v-for="list2 in item.options">
              <el-checkbox disabled class="radioBox">
                <span style="color: dimgray">{{list2.optionNo}}.{{list2.optionName}}</span>
                <span style="margin-left: 30px">{{list2.percentVal || 0}}%</span>
              </el-checkbox>
            </p>
          </el-checkbox-group>
        </div>
        <div v-if="item.questionType === 'text'">
          <p>{{index+1}}.{{item.itemName}}</p>
          <p style="margin-left: 20px">
            <span style="margin-left: 30px" v-show="item.percentVal">{{item.percentVal}}%</span>
          </p>
        </div>
        <div v-if="item.questionType === 'image'">
          <p>{{index+1}}.{{item.itemName}}</p>
          <p class="radioBox" v-for="(list, index) in item.options" :key="index">
              <img :src="list.optionNo" width="200">
              <span style="margin-left: 5px">{{list.optionName}}</span>
          </p>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'QuestionnaireTopic',
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    mounted(){
    },
    data() {
      return {
        radio2: 3
      }
    }
  }
</script>

<style scoped>
.radioBox {
  padding-left: 20px;
  margin-bottom: 16px;
}
</style>
