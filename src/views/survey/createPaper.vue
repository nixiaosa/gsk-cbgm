<template>
  <div class="model-create-paper">
    <div class="paper-title">添加问题</div>
    <el-form ref="form" :model="paperForm" label-width="80px">
      <el-form-item label="问题类型">
        <el-radio-group v-model="paperForm.type">
          <el-radio label="radio" >单选题</el-radio>
          <el-radio label="checkbox" >多选题</el-radio>
          <el-radio label="open" >开放题</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题目">
        <el-input v-model="paperForm.title" style="width: 80%;">
        </el-input>
      </el-form-item>

      <el-form-item label="分数">
        <el-input-number v-model="paperForm.score" @change="handleChange" :min="1" :max="100"></el-input-number>
      </el-form-item>

      <el-form-item label="选项" v-if="paperForm.type==='radio'">
        <el-radio-group v-model="paperForm.answer" style="width: 70%">
        <div v-for="(item,index) in paperForm.optionData" :key="item.id" style="margin-left: 20px;margin-top: 20px">
          <el-radio :label="index">正确答案</el-radio>
          <el-input v-model="paperForm.optionData[index]" style="width: 60%;margin-left: 15px">
          </el-input>
          <el-button type="primary" @click="deleteOption(index)" icon="delete" style="margin-left: 15px"></el-button>
        </div>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选项" v-if="paperForm.type==='checkbox'">
        <el-checkbox-group v-model="paperForm.answer" @change="handleCheckedCitiesChange">
          <div v-for="(item,index) in paperForm.optionData" :key="item.id" style="margin-left: 20px;margin-top: 20px">
              <el-checkbox  :label="index"  >正确答案</el-checkbox>
              <el-input v-model="paperForm.optionData[index]" style="width: 60%;margin-left: 15px">
              </el-input>
              <el-button type="primary" @click="deleteOption(index)" icon="delete" style="margin-left: 15px"></el-button>
          </div>
        </el-checkbox-group>
      </el-form-item>




      <el-form-item label="字数限制" v-if="paperForm.type==='open'">
        <el-input placeholder="最少5个字，最多1000字" v-model="paperForm.fontLimit" style="width:40%">
          <template slot="append">字数</template>
        </el-input>
      </el-form-item>



      <div  class="avatar-plus" @click="pushElement('check')" v-if="paperForm.type!=='open'">
        <i class="el-icon-plus" style="margin-right: 30px"></i>
        <span style="font-size: 20px">添加新选项</span>
      </div>


      <el-form-item>
        <el-button type="primary" @click="onSubmitQuestion">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>




    </el-form>


  </div>
</template>
<script>
  import { formatDate } from '../../common/data'
  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
export default {
    created() {},
    components: { ElInput },
    data() {
      return {
        answer: '',
        paperForm: {
          answer: [],
          title: '',
          type: 'radio',
          optionData: ['', '', '', ''],
          score: '1',
          fontLimit: ''
        }
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
      deleteOption(index) {
        if (this.paperForm.optionData.length == 2) {
          return false
        }
        this.paperForm.optionData.splice(index, 1)
      },
      pushElement(val) {
        if (val === 'check') {
          if (this.paperForm.optionData.length == 20) {
            return false
          }
          this.paperForm.optionData.push('')
        }
      },
      handleChange() {

      },
      onSubmitQuestion() {

      },
      handleCheckedCitiesChange() {
      }
    }
  }
</script>
<style>
  .model-create-survey {
    width: 80%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .paper-title{
    margin:20px 0;
    font-size: 20px;
  }
  .avatar-plus{
    font-size: 40px;
    color: #8c939d;
    height: 148px;
    line-height: 148px;
    text-align: center;
    display:  -webkit-flex;
    display: flex;
    justify-content: center;
    display:  -webkit-flex;
    display: flex;
    align-items:center;
  }

</style>
