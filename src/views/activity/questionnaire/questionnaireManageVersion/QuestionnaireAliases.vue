<template>
  <div>
    <el-form :inline="true" :model="titleForm">
      <el-form-item label="调研问卷页面显示设置">
        <el-radio class="radio" v-model="titleForm.questionTitleShow" :label="0">否</el-radio>
        <el-radio class="radio" v-model="titleForm.questionTitleShow" :label="1">是</el-radio>
        <el-input v-if="titleForm.questionTitleShow === 1" style="width:420px" v-model="titleForm.questionTitleValue"
                  :maxlength="5" show-word-limit placeholder="请输入1-5个字符的显示内容"></el-input>
        <el-button type="info" size="small" style="margin-left:10px" @click="titleSubmit">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";

export default {
  name: "QuestionnaireAliases",
  computed: {
    ...mapGetters(["companyConfig"])
  },
  data() {
    return {
      titleForm: {
        questionTitleShow: 0,
        questionTitleValue: ""
      }
    }
  },
  mounted() {
    this.titleForm.questionTitleShow = this.companyConfig.questionTitleShow || 0
    this.titleForm.questionTitleValue = this.companyConfig.questionTitleValue || ''
  },
  methods: {
    titleSubmit: async function() {
      if (!this.titleForm.questionTitleValue) {
        this.$message.error("内容不能为空");
        return false;
      }
      if (!this.titleForm.questionTitleShow) {
        this.titleForm.questionTitleShow = 0
        this.titleForm.questionTitleValue = ''
      }
      let params = {
        id: this.companyConfig.companyid,
        ...this.titleForm
      }

      const res = await http.post(api.userCompanyUpdate,params)
      if (res.data.code === 0) {
        this.$message.success("设置成功")
      } else {
        this.$message.error(res.data.message)
      }
    },
  }
}
</script>

<style scoped>

</style>
