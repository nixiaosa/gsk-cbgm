<template>
    <div id="list">
      <header-content :opertions="opertions" @header-btn-click="headerClick" :title="headerTitle"></header-content>
     <div class="bigbox">
       <el-form label-width="150px" class="demo-ruleForm">
         <el-form-item label="状态" style="float: left;">
           <el-select v-model="value8" filterable placeholder="请选择">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="创建时间" style="float: left;">
           <el-input  placeholder="请输入内容,最多可输入100字符"></el-input>
         </el-form-item>
         <el-form-item label="任务名称" style="float: left;">
           <el-input  placeholder="请输入任务名称"></el-input>
         </el-form-item>
         <el-form-item label="创建者" style="float: left;">
           <el-input  placeholder="请输入内创建者姓名"></el-input>
         </el-form-item>
       </el-form>
       <el-button type="info" size="small" style="width: 135px;height: 35px;">搜索</el-button>
     </div>
    </div>
</template>

<script>
    import HeaderContent from '@/components/header-content'
    export default {
      name: "sharetask",
      components: {
       HeaderContent
      },
      data() {
        return {
          headerTitle: '任务中心->分享任务列表->查看详情',
          opertions: ['创建任务'],
          input2: '',
          input21: '',
          input22: '',
          input23: '',
          value8: '',
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
        }
      },
      methods:{
        headerClick() {
          this.$router.push({path: '/taskcenter/create'})
        }
      }
    }
</script>

<style scoped>
  #list .bigbox {
    display: flex;
    height: 50px;
    /*justify-content: center;*/
    flex-wrap: nowrap;
  }
</style>
