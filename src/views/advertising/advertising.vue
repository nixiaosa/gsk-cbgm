<template>
  <div class="modelist">
    <input id="uploadVideoNow-file" type="file" ref="upload" style="display:none"/>
    <div class="piont-flex" style="border:none">
      <div class="point-title">
        广告编辑
      </div>
      <div>
      </div>
    </div>
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题：">
        <el-input v-model="form.name" placeholder="输入广告标题" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <el-input
          style="width:500px"
          type="textarea"
          :rows="6"
          placeholder="请输广告入内容"
          v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item label="网址：">
        <el-input v-model="form.url" placeholder="输入广告连接的地址" style="width:500px"></el-input>
      </el-form-item>
      <el-form-item label="位置：">
        <el-radio class="radio" v-model="form.type" label="1">首页通栏</el-radio>
        <el-radio class="radio" v-model="form.type" label="2">栏目页通栏</el-radio>
        <el-radio class="radio" v-model="form.type" label="3">详情页通栏</el-radio>
      </el-form-item>
      <el-form-item label="图片：" prop="name">
        <el-upload class="avatar-uploader" id="contentimg1" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.pic" :src="form.pic" class="avatar">
          <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
          <div class="el-upload__tip" slot="tip" style="margin-left:30px">建议使用1200*100或相同比例的图片</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-upload id="contentimg" v-show="false" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
      <img :src="contentImg" class="avatar">
    </el-upload>

    <div>
    </div>
    <el-button v-if="!id" type="primary" style="margin-top:20px;margin-left:80px;" @click="createNews()">保 存</el-button>
    <el-button v-if="id" type="primary" style="margin-top:20px;margin-left:80px;" @click="sourceUpdata()">保 存</el-button>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    data() {
      return {
        schedule: false,
        videoHiden: false,
        progress: 0,
        uploadBoxIsShow: true,
        name: 'register-modules-example',
        contentImg: '',
        id: this.$route.query.id,
        content: ``,
        upimgurl: api.uploadImg,
        token: { Authorization: localStorage.getItem('yibai_token_c'), 'Remote-Host': window.localStorage.getItem('locationHost') },
        form: {
          id: '',
          name: '',
          url: '',
          description: '',
          type: '1',
          pic: ''
        }
      }
    },
    mounted() {
      if (this.id) {
        this.sourceGet()
      }
    },
    methods: {
      handleAvatarSuccess(response) {
        this.form.pic = response.data
      },
      handleAvatarSuccess1(response) {
        var vm = this
        vm.$refs.myTextEditor.quill.insertEmbed(vm.addImgRange !== null ? vm.addImgRange.index : 0, 'image', response.data, Quill.sources.USER)
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
      createNews() {
        if (this.form.name === '') {
          this.$message.error('请填写标题')
          return false
        } else if (this.form.url === '') {
          this.$message.error('请填广告连接')
          return false
        } else if (this.form.description === '') {
          this.$message.error('请填广告内容')
          return false
        } else if (this.form.type === '') {
          this.$message.error('请填广告显示位置')
          return false
        } else if (this.form.pic === '') {
          this.$message.error('请填上传图片')
          return false
        }
        this.sourceSave()
      },
//      创建广告
      sourceSave: async function() {
        var res = await http.post(api.sourceSave, this.form)
        if (res.data.code === 0) {
          this.$message.success('创建成功')
          this.$router.push({ path: '/resource/index' })
        } else {
          this.$message.error(res.data.message)
        }
      },
//      详情
      sourceGet: async function() {
        var res = await http.post(api.sourceGet, { id: this.id })
        if (res.data.code === 0) {
          res = res.data.data
          this.form.name = res.name
          this.form.description = res.description
          this.form.pic = res.pic
          this.form.type = res.type
          this.form.url = res.url
          this.form.id = res.id
        } else {
          this.$message.error(res.data.message)
        }
      },
      sourceUpdata: async function() {
        if (this.form.name === '') {
          this.$message.error('请填写标题')
          return false
        } else if (this.form.url === '') {
          this.$message.error('请填广告连接')
          return false
        } else if (this.form.description === '') {
          this.$message.error('请填广告内容')
          return false
        } else if (this.form.type === '') {
          this.$message.error('请填广告显示位置')
          return false
        } else if (this.form.pic === '') {
          this.$message.error('请填上传图片')
          return false
        }
        var res = await http.post(api.sourceUpdata, this.form)
        if (res.data.code === 0) {
          this.$message.success('修改成功')
          this.$router.push({ path: '/resource/index' })
        } else {
          this.$message.error(res.data.message)
        }
      }
    }
  }
</script>

<style>
  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .ql-video{
    width:500px;
    height:300px;
  }
  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .piont-flex{
    display: flex;
    justify-content: space-between;
    height:36px;
    margin-bottom: 15px;
    padding-bottom:35px;
  }
  .piont-flex .point-title{
    height: 36px;
    line-height: 36px;
  }
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
  .ql-editor{
    min-height:500px;
  }
</style>
