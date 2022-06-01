<template>
  <div>
    <header-content :title="headerTitle" :opertions="['返回']" v-if="!this.$route.query.id" @change="back"></header-content>
    <div class="form-box">
      <el-form ref="createForm" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="任务类型">
          <span>邀请任务</span>
        </el-form-item>
        <el-form-item label="任务名称" prop="title">
          <el-input v-model="form.title" :maxlength="20" show-word-limit clearable placehplder="请输入名称"/>
        </el-form-item>
        <el-form-item prop="taskTime" label="任务周期">
          <el-date-picker
              v-model="form.taskTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放积分类型">
<!--          <el-radio v-model="form.pointType" :label="0">医百医币</el-radio>-->
          <el-radio v-model="form.pointType" :label="1">平台积分</el-radio>
        </el-form-item>
        <el-form-item label="邀请一人可领取">
          <el-input-number size="small" v-model="form.conditions[0].pointEvery" :min="1"></el-input-number>
          <span>  积分</span>
        </el-form-item>
        <el-form-item label="积分份数">
          <el-input-number size="small" v-model="form.conditions[0].numMax" :min="1"></el-input-number>
          <span>  份</span>
        </el-form-item>
        <el-form-item label="发放总积分">
          <span style="color: orangered">{{form.conditions[0].pointEvery * form.conditions[0].numMax}}</span>
        </el-form-item>
        <el-form-item label="任务简介">
          <el-input rows="17" type="textarea" :maxlength="500" show-word-limit v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="isLoding" type="primary" @click="submitForm(-1)">保存</el-button>
          <el-button :loading="isLoding" type="primary" @click="submitForm(0)">发布</el-button>
          <el-button :loading="isLoding" @click="back">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import HeaderContent from '@/components/header-content'

export default {
  components: {
    HeaderContent
  },
  props: {},
  data() {
    return {
      taskId: this.$route.params.id,
      form: {
        taskTime: [],
        status: null, // 是否发布<-1保存 0发布>
        title: '',
        startTime: '',
        endTime: '',
        conditions: [
          {
            identity: -1, //领取身份<这里默认传-1>
            pointEvery: 1, // 邀请一人领取积分
            numMax: 1, // 积分份数
            numMaxEvery: null, // 每人最多领取份数<值同numMax>"
          }
        ],
        description: '',
        event: 'enroll_new',
        pointType: 1, // 积分类型<0医币 1平台积分>
      },
      isLoding: false,
      headerTitle: '邀请注册任务列表-->创建任务',
      rules: {
        title: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 2 个字', trigger: 'blur' }
        ],
        taskTime: [
          { type: 'array', required: true, message: '请选择任务周期', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      if (!this.taskId) return
      this.$http.get(this.$api.inviteDetailsNew + this.taskId).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          data.taskTime = [data.startTime, data.endTime]
          this.form = data
        } else {
          this.$message.error(message)
        }
      })
    },
    back() {
      this.$router.push({path: '/taskCenter/invite/new'})
    },
    submitForm(status) {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          this.form.startTime = this.form.taskTime[0]
          this.form.endTime = this.form.taskTime[1]
          this.form.conditions.numMaxEvery = this.form.conditions.numMax
          this.form.status = status
          this.create()
        } else {
          this.$message.error('请检查必填选项')
          return false;
        }
      });
    },
    create() {
      this.isLoding = true
      this.$http.post(this.$api.inviteCreateNew, this.form).then(res => {
        this.isLoding = false
        let {code, message} = res.data
        if (code === 0) {
          if (this.form.status === -1) {
            this.$message.success('保存成功')
          } else {
            this.$message.success('发布成功')
          }
          this.back()
        } else {
          this.$message.error(message)
        }
        console.log(res);
      }).catch(err => {
        this.isLoding = false
        this.$message.error(err.message)
      })
    },
  }
}
</script>
<style scoped lang="scss">
.form-box {
  width: 600px;
}

</style>
