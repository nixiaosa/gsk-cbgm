<template>
  <div class="modelist">
    <div class="banner-eidt">
      <el-form :model="form" label-width="80px" ref="bannerForm">
        <el-form-item label="Banner名称:">
          <el-input v-model="form.name" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="Banner图:" width='100'>
          <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.picture" :src="form.picture" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
            <div class="el-upload__tip" slot="tip" style="margin-left:70px">建议使用1200*400或相同比例的图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接地址:">
          <el-input v-model="form.url" style="width:500px"></el-input>
          <div style="margin-left:70px;color:rgb(131, 145, 165)">必须填写以http://或https://开头的完整地址，如：http://www.100doc.cn/</div>
        </el-form-item>
        <el-form-item label="打开方式:">
          <el-radio-group v-model="form.newWindow">
            <el-radio label="0">打开新窗口</el-radio>
            <el-radio label="1">刷新现有窗口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="form.showOrder" style="width:80px" min="0" type="number"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:30px;">
          <el-button type="primary" @click="beforeCreateBanner()" v-if="!isId" :flag="Isflag">保 存</el-button>
          <el-button type="primary" @click="beforeBannerUpdate()" v-if="isId" :flag="Isflag">保 存</el-button>
          <el-button @click="cancelBanner()">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'modelist',
  components: {},
  data() {
    return {
      form: {
        name: '',
        newWindow: '0',
        url: '',
        showOrder: 0,
        picture: ''
      },
      isId: this.$route.query.id,
      upimgurl: api.uploadImg,
      Isflag: true,
      token: { Authorization: localStorage.getItem('yibai_token_s'), 'Remote-Host': window.localStorage.getItem('locationHost') }
    }
  },
  computed: {
    url() {
      return this.form.url
    }
  },
  filters: {},
  mounted() {
    this.getBanner()
  },
  methods: {
    beforeCreateBanner() {
      if (this.Isflag) {
        this.createBanner()
      }
    },
    createBanner: async function() {
      if (!this.form.name) {
        alert('Banner名称不能为空')
        return false
      }
      if (!this.form.picture) {
        alert('请先上传Banner图')
        return false
      }
      if (!this.form.url) {
        alert('请为Banner增加链接地址')
        return false
      }
      if (this.form.showOrder < 0) {
        alert('排序序号不能小于0')
        return false
      }
      var openwindow = this.form.newWindow ? this.form.newWindow : 0
      var params = {
        name: this.form.name,
        url: this.form.url,
        picture: this.form.picture,
        showOrder: this.form.showOrder,
        newWindow: openwindow
      }
      var res = await http.post(api.createBanner, params)
      if (res.data.code === 0) {
        this.$router.push({ path: 'banner' })
      }
      this.Isflag = false
    },
    beforeBannerUpdate() {
      this.$refs.bannerForm.validate(valid => {
        if (valid) {
          if (this.Isflag) {
            this.bannerUpdate()
          }
        }
      })
    },
    bannerUpdate: async function() {
      if (!this.form.name) {
        alert('Banner名称不能为空')
        return false
      }
      if (!this.form.picture) {
        alert('请先上传Banner图')
        return false
      }
      if (!this.form.url) {
        alert('请为Banner增加链接地址')
        return false
      }
      if (this.form.showOrder < 0) {
        alert('排序序号不能小于0')
        return false
      }
      var openwindow = this.form.newWindow ? this.form.newWindow : 0
      var params = {
        id: Number(this.$route.query.id),
        name: this.form.name,
        url: this.form.url,
        picture: this.form.picture,
        showOrder: this.form.showOrder,
        newWindow: openwindow
      }
      var res = await http.post(api.bannerUpdate, params)
      if (res.data.code === 0) {
        this.$router.push({ path: 'banner' })
      }
      this.Isflag = false
    },
    cancelBanner() {
      this.$router.push({ path: 'banner' })
    },
    handleAvatarSuccess(res, file) {
      this.form.picture = res.data
    },
    getBanner: async function() {
      var id = this.$route.query.id
      if (id) {
        var params = {
          id: id
        }
        var res = await http.post(api.getBanner, params)
        if (res.data.code === 0) {
          this.form = res.data.data
        }
      }
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
    }
  },
  watch: {
    url(newValue, oldValue) {
      if (oldValue !== newValue) {
        this.Isflag = true
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
.banner-eidt {
  width: 800px;
  padding-top: 20px;
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
.banner-eidt .el-form-item__error {
  margin-left: 30px !important;
}
</style>
