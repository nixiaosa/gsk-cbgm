<template>
  <div class="modelist">
    <div class="header">
      <el-button type="primary" @click="toggleSelection('save')">保 存</el-button>
      <el-button  @click="toggleSelection('cancel')">取 消</el-button>
    </div>
    <div class="tab-box">
      <el-tabs v-model="activeName2" type="card">
        <el-tab-pane label="基本信息" name="first">
          <create-survey></create-survey>
        </el-tab-pane>
        <el-tab-pane label="问题管理" name="second">
          <create-paper></create-paper>
        </el-tab-pane>
        <el-tab-pane label="奖励管理" name="third">

        </el-tab-pane>
        <el-tab-pane label="问卷结果" name="fourth">

        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
<script>
  import { formatDate } from '../../common/data'
  import CreateSurvey from './createSurvey.vue'
  import CreatePaper from './createPaper.vue'
  export default {
    name: 'modelist',
    components: { CreateSurvey, CreatePaper },
    data() {
      return {
        activeName2: 'second'
      }
    },
    computed: {},
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {},
    methods: {
      toggleSelection(val) {
        if (val === 'save') {
          alert('save')
        } else {
          this.$router.push({ path: `/survey/survey` })
        }
      }
    }
  }
</script>
<style>
  .header{
    margin: 20px 0px;
    padding-bottom: 10px;
    width: 100%;
    text-align: right;
  }
  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .tab-box{
    margin: 20px 0;
    padding-bottom: 10px;
    width: 100%;
    border-bottom:1px solid #cccccc;
  }
</style>
