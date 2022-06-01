<template>
  <div class="modelist">
    <header-content title="公众号设置"></header-content>
    <div class="wrap-box">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="关注微信公众号:">
          <el-radio class="radio" v-model="form.follow" :label="1">强制</el-radio>
          <el-radio class="radio" v-model="form.follow" :label="0">不强制</el-radio>
        </el-form-item>
        <el-form-item label="微信公众号二维码提示文案:">
          <el-input style="width:420px" v-model="form.qrcodeDesc"
                    :maxlength="20" show-word-limit placeholder="请输入1-20个字符"></el-input>
        </el-form-item>
      </el-form>
      <div class="ewm-box">
        <img :src="form.twoDimensionCode">
        <p>{{ form.qrcodeDesc ? form.qrcodeDesc : '长按识别二维码'}}</p>
        <span v-if="form.follow == '0'">跳过</span>
      </div>
    </div>
    
    <el-button type="primary" @click="onSubmit">保存</el-button>
    <el-button style="margin-left:10px">取消</el-button>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";

export default {
  data() {
    return {
      form: {
        id: '',
        follow: '0',
        qrcodeDesc: '',
        twoDimensionCode: ''
      }
    };
  },
  async mounted() {
    await this.getCompanyWxSetting();
  },
  methods: {
    getCompanyWxSetting: async function(){
        const res = await http.get(api.getCompanyWxSetting);
        if (res.data.code === 0) {
          this.form.id = res.data.data.id
          this.form.follow = res.data.data.follow
          this.form.qrcodeDesc = res.data.data.qrcodeDesc
          this.form.twoDimensionCode = res.data.data.twoDimensionCode
        } else {
          this.$message.error(res.data.message);
        }
    },
    onSubmit: async function(){
        let params = {}
        params = {
          id: this.form.id,
          follow: this.form.follow,
          qrcodeDesc: this.form.qrcodeDesc
        };
        const res = await http.post(api.companyWxSetting,params);
        if (res.data.code === 0) {
          this.$message.success("设置成功!");
        } else {
          this.$message.error(res.data.message);
        }
    }
  },
  computed: {},
  components: {
    HeaderContent
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.wrap-box{
  position: relative;
  clear: both;
  padding: 0 0 350px 0;
}
.el-form--inline .el-form-item {
  display: block;
}
::v-deep .el-form--inline .el-form-item__label {
    width: 200px;
}
.ewm-box{
  border: 1px solid #ccc;
  border-radius: 10px;
  position: absolute;
  width: 300px;
  height: 400px;
  right: 240px;
  top:0;
  text-align: center;
  img{
    width: 200px;
    height: 200px;
    margin: 20px 0;
  }
  p{
    font-size: 14px;
  }
  span{
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100px;
    height: 40px;
    font-size: 14px;
    line-height: 40px;
    margin: 20px 0 0 0;
  }
}
</style>
