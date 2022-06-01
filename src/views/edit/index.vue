<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="网站名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="主题色选择">
        <el-checkbox-group>
          <el-radio class="radio" v-model="form.type" label="default">default</el-radio>
          <el-radio class="radio" v-model="form.type" label="green" style="color:green">绿色</el-radio>
          <el-radio class="radio" v-model="form.type" label="black" style="color:black">黑色</el-radio>
          <el-radio class="radio" v-model="form.type" label="red" style="color:red">红色</el-radio>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上传logo">
        <base64-upload class="user"
          imageSrc="https://wenzhixin.github.io/vue-base64-upload/demo/user.jpg"
          @change="onChangeImage">
        </base64-upload>
        <span style="color:red">点击进行图片上传，* 建议56*30比例的png格式图片 *</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Base64Upload from 'vue-base64-upload'
export default {
  name: 'config',
  components: {
    Base64Upload
  },
  data() {
    return {
      form: {
        name: '',
        type: 'default',
        logo: ''
      }
    }
  },
  methods: {
    onChangeImage(file) {
      var imgBase64 = 'data:' + file.type + ';base64,' + file.base64
      this.form.logo = imgBase64
    }
  }
}
</script>

<style>
.user {
  width: 112px;
  height: 60px;
}
.user input[type="file"]{
  cursor: pointer;
}
</style>
