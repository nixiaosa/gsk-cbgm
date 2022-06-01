<template>
  <div class="userlist-container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <el-form :model="registerForm" label-width="100px" :rules="registerRules" ref="registerForm">
          <h3 class="title">增加新用户</h3>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="registerForm.username" auto-complete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerForm.password" auto-complete="new-password"></el-input>
            默认密码：123456
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native.prevent="submitForm('registerForm')" :loading="loading">提交</el-button>
            <el-button @click.native.prevent="resetForm('registerForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- <h3 class="title">增加新用户</h3>
        <el-input v-model="input1" auto-complete="new-password">
          <template slot="prepend">用户名：</template>
        </el-input>
        <el-input v-model="input2" type="password" auto-complete="new-password">
          <template slot="prepend">密码：</template>
        </el-input> -->
      </el-col>
    </el-row>
    <div :class="color | classtheme('divbox')">123</div>
  </div>
</template>

<script>
import { register } from '@/api/user'
import { isvalidUsername } from '@/utils/validate'
export default {
  name: 'userlist',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        // callback(new Error('密码不能小于6位'))
        callback(new Error('密码错误，请输入正确密码'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: 123456
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      color: 'black'
    }
  },
  computed: {
    classobj(theme, num) {
      return theme + num
    }
  },
  filters: {
    classtheme: function(value, str) {
      return str + value
    }
  },
  methods: {
    submitForm() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          register(this.registerForm.username, this.registerForm.password, 1).then(() => {
            this.$alert('新加用户成功，用户名为' + this.registerForm.username, '添加用户提醒', {
              confirmButtonText: '确定',
              callback: () => {
                this.registerForm = {
                  username: '',
                  password: ''
                }
              }
            })
          }).catch()
        }
      })
    },
    resetForm() {
      this.registerForm = {
        username: '',
        password: ''
      }
    }
  }
}
</script>
