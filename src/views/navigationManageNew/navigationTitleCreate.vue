<template>
  <div>
    <header-component title="编辑模版-网站首页标题" :props="['返回']" @change="headerChange"/>
    <div style="width: 400px">
      <el-form label-width="180px" :model="formLabelAlign">
        <span class="title">标题名称：视频内容</span>
        <el-form-item label="对应自定义标题名称">
          <el-input placeholder="7个字以内" :maxlength="7" v-model="formLabelAlign.video"></el-input>
        </el-form-item>
        <span class="title">标题名称：文章内容</span>
        <el-form-item label="对应自定义标题名称">
          <el-input placeholder="7个字以内" :maxlength="7" v-model="formLabelAlign.text"></el-input>
        </el-form-item>
        <span class="title">标题名称：活动内容</span>
        <el-form-item label="对应自定义标题名称">
          <el-input placeholder="7个字以内" :maxlength="7" v-model="formLabelAlign.activity"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-right: 30px">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="update">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/header-content/HeaderComponent";
export default {
  name: "navigationTitleCreate",
  components: {HeaderComponent},
  data() {
    return {
      isLoading: false,
      formLabelAlign: {
        video: '',
        text: '',
        activity: ''
      }
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    update() {
      if (!this.formLabelAlign.video) {
        this.$message.error("视频标题不能为空");
        return false;
      }
      if (!this.formLabelAlign.activity) {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (!this.formLabelAlign.text) {
        this.$message.error("活动标题不能为空");
        return false;
      }
      this.isLoading = true
      let userDefineTitles = `${this.formLabelAlign.video},${this.formLabelAlign.activity},${this.formLabelAlign.text}`
      let params = {
        id: this.$route.params.id,
        userDefineTitles: userDefineTitles
      }
      this.$http.post(this.$api.navigation.title.update, params).then(res => {
        this.isLoading = false
        let {code, message} = res.data
        if (code === 0) {
          this.$message.success('保存成功')
          this.$router.push({path: '/nav/navigationTitleManage'})
        } else {
          this.$message.error(message)
        }
      })
    },
    get() {
      this.$http.get(this.$api.navigation.title.get + this.$route.params.id).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {

          this.formLabelAlign.video = data.userDefineTitles.split(',')[0]
          this.formLabelAlign.text = data.userDefineTitles.split(',')[2]
          this.formLabelAlign.activity = data.userDefineTitles.split(',')[1]
        } else {
          this.$message.error(message)
        }
      })
    },
    headerChange() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.title {
  line-height: 40px;
}
</style>
