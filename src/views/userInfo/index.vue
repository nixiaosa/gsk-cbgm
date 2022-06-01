<template>
  <el-form :label-position="labelPosition" label-width="100px" :model="form" style="margin-top:20px;">
    <el-form-item :label="ishaveimg" width='100'>
      <el-upload
        class="avatar-uploader"
        :action="upimgurl"
        :headers="token"
        :disabled="!iseidt"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="form.photo" :src="form.photo" class="avatar">
        <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
        <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="姓名：">
      <el-input class="input400" v-model="form.nickname" :disabled="!iseidt"></el-input>
    </el-form-item>
    <el-form-item label="性别：">
      <el-radio class="radio" v-model="form.sex" label="man" :disabled="!iseidt">男</el-radio>
      <el-radio class="radio" v-model="form.sex" label="woman" :disabled="!iseidt">女</el-radio>
    </el-form-item>
    <el-form-item label="手机号：">
      <el-input class="input400" v-model="form.phone" :disabled="!iseidt"></el-input>
    </el-form-item>
    <el-form-item label="邮箱：">
      <el-input class="input400" v-model="form.email" :disabled="!iseidt"></el-input>
    </el-form-item>
    <el-form-item>
      <div v-show="iseidt">
        <el-button @click="updateinfo()" type="primary">确认</el-button>
        <el-button  @click="cancel()">取消</el-button>
      </div>
      <div v-show="!iseidt">
        <el-button @click="edit()" type="primary">编辑</el-button>
      </div>
    </el-form-item>

  </el-form>

</template>

<script>
import http from '@/utils/tenant'
import userapi from '@/api/login1'
import store from '@/store'
import { formatDate } from '@/common/data'
import api from '@/api/tenantInfoSave'
export default {
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  data() {
    return {
      upimgurl: api.uploadImg,
      iseidt: false,
      ishaveimg: '头像',
      token: { Authorization: localStorage.getItem('yibai_token_c'), 'Remote-Host': window.localStorage.getItem('locationHost') },
      labelPosition: 'right',
      userAccountInfo: false,
      form: {
        userName: '',
        radio: '1',
        phone: '',
        nickname: '',
        sex: '',
        email: '',
        password: '',
        photo: ''
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val
      this.getuserlist(val)
    },
    // 获取图片地址
    handleAvatarSuccess(res) {
      this.form.photo = res.data
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
    getuserinfo: async function() {
      var params = {}
      var res = await http.get(userapi.getuserinfo, params)
      if (res.data.data) {
        if (res.data.data.photo) {
          this.form.photo = res.data.data.photo
        }
        if (res.data.data.nickname) {
          this.form.nickname = res.data.data.nickname
        }
        if (res.data.data.sex) {
          this.form.sex = res.data.data.sex
        }
        if (res.data.data.phone) {
          this.form.phone = res.data.data.phone
        }
        if (res.data.data.email) {
          this.form.email = res.data.data.email
        }
      }
    },
    updateinfo: async function() {
      var params = {
        email: this.form.email,
        nickname: this.form.nickname,
        photo: this.form.photo,
        phone: this.form.phone,
        sex: this.form.sex
      }
      var res = await http.post(userapi.updateinfo, params)
      if (res.data.code === 0) {
        this.getuserinfo()
        store.dispatch('GetInfo')
        this.iseidt = false
      }
    },
    edit() {
      this.iseidt = true
      this.ishaveimg = '上传头像'
    },
    cancel() {
      this.getuserinfo()
      this.ishaveimg = '头像'
      this.iseidt = false
    }
  },
  mounted() {
    this.getuserinfo()
  }
}
</script>
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
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input800 {
  width: 800px;
}
.input300 {
  width: 300px;
}
.input200 {
  width: 100px;
}
</style>

<style scoped>
.user-container {
  width: 95%;
  margin-left: 20px;
}
.user-container-header {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.el-checkbox-group {
  line-height: 30px;
  overflow: hidden;
}
.el-checkbox {
  float: left;
  width: 25%;
  margin: 0;
  padding: 0;
}
</style>
