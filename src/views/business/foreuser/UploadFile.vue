<template>
  <div>
    <el-upload
        :action="upimgurl"
        :headers="token"
        accept=".xlsx"
        :show-file-list="false"
        :on-success="remoHandleAvatarSuccess"
    >
      <el-button type="primary" size="small">{{ title }}</el-button>
    </el-upload>
  </div>
</template>

<script>
import api from "@/api/tenantInfoSave";

export default {
  name: "UploadFile",
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      token: {
        Authorization: localStorage.getItem('yibai_token_c'),
        'Remote-Host': window.localStorage.getItem('locationHost')
      },
      upimgurl: this.$api.uploadImg,
    }
  },
  methods: {
    remoHandleAvatarSuccess(response) {
      if (this.urls !== '') {
        this.$emit('change', response.data)
      }
    }
  }
}
</script>

<style scoped>

</style>
