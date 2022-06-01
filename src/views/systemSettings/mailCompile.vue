<template>
  <div class="smsCompile">
    <div class="header">
      <el-button @click="back()" type='info'>返回</el-button>
    </div>
    <div class="smsCompileBox">
      <el-form :model="smsCompileForm" ref="smsCompileForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="模板名称：" prop="gateway">
          <el-input class="input600" type="text" v-model="smsCompileForm.templateNma" placeholder='添加讲者短信'></el-input>
        </el-form-item>
        <el-form-item label="邮件标题" prop="gateway">
          <el-input class="input600" type="text" v-model="smsCompileForm.mailTitle"></el-input>
        </el-form-item>
        <el-form-item label="模板内容：" prop="gateway">
          <el-input class="input600" type="textarea" :rows="10" placeholder="" v-model="smsCompileForm.templateContent">
          </el-input>
          <div class="textB">
            <span class="text">[培训名称]</span>
            <span class="text">[开始时间]</span>
            <span class="text">[邀请人]</span>
            <span class="text">[姓名]</span>
            <span class="text">[手机号码]</span>
            <span class="text">[直播端地址]</span>
            <span class="text">[观看端地址]</span>
            <span class="hind">{{hind}}</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('smsCompileForm')">提交</el-button>
          <el-button type="warning" @click="recover()">恢复初始内容</el-button>
          <el-button @click="back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'smsCompile',
  components: {
  },
  data() {
    return {
      hind: '备注：请使用这些标识替换短信中的个性化信息',
      smsCompileForm: {
        mailTitle: 'XXX邀请您加入XXXXXX店员培训',
        templateNma: '',
        templateContent: '【XXXX】欢迎加入医百店员培训，您的账户为您的手机号码：[手机号码]，密码的初始密码为123456。医百店员培训直播端下载地址：[直播端地址]。登录成功后，请尽快修改密码。',
        recover: '【XXXX】欢迎加入医百店员培训，您的账户为您的手机号码：[手机号码]，密码的初始密码为123456。医百店员培训直播端下载地址：[直播端地址]。登录成功后，请尽快修改密码。'
      }
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    /**
     * 恢复初始内容
     */
    recover() {
      this.smsCompileForm.templateContent = this.smsCompileForm.recover
    },
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.smsCompileBox {
  margin-top: 30px;
}

.text {
  display: inline-block;
  margin-right: 10px;
  line-height: 20px !important;
  font-size: 14px;
  color: rgb(72, 87, 106);
}
.hind{
  display: block;
  font-size: 14px;
  color:red;
}
.header {
  width: 90%;
  margin: 0 20px;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #ccc;
  text-align: right;
}

.header button {
  margin-right: 40px;
}

.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input800 {
  width: 800px;
}

.input200 {
  width: 100px
}
</style>
