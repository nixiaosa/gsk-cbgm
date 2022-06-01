<template>
  <div class="model-create-survey">
    <el-form ref="form" :model="surveyForm" label-width="80px">
      <el-form-item label="调查问卷标题">
        <el-input v-model="surveyForm.title" style="width: 80%"></el-input>
      </el-form-item>

      <el-form-item label="封面图">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="问题类型">
        <el-select v-model="surveyForm.region" placeholder="请问卷类型">
          <el-option label="标准问卷" value="standard"></el-option>
          <el-option label="开放问卷" value="open"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="答题设置">
        <el-radio-group v-model="surveyForm.type">
          <el-radio label="仅答题一次" name="type" value="once"></el-radio>
          <el-radio label="可重复答题" name="type" value="repeat"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="问卷数量">
        <el-input-number v-model="surveyForm.num" :min="1" :max="1000"></el-input-number>
      </el-form-item>

      <el-form-item label="调查时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="surveyForm.startTime" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="选择时间" v-model="surveyForm.endTime" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import { formatDate } from '../../common/data'
  import ElRadioGroup from '../../../node_modules/element-ui/packages/radio/src/radio-group'
  import ElRadio from '../../../node_modules/element-ui/packages/radio/src/radio'
  export default {
    components: {
      ElRadio,
      ElRadioGroup
    },
    data() {
      return {
        imageUrl: '',
        surveyForm: {
          name: '',
          num: '1',
          region: '',
          startTime: '',
          endTime: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    computed: {},
    filters: {
      formatDate(time) {
        time = Number()
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {},
    methods: {
      onSubmit() {
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像只能是jpg、png、gif格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
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

</style>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
