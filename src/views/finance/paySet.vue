<template>
  <div class="modelist" v-loading="loading">
    <header-content :title="headerTitle"></header-content>
    <el-steps :active="active" finish-status="success" class="paySet" simple>
      <el-step title="配置业务域名"></el-step>
      <el-step title="设置支付信息"></el-step>
      <el-step title="公众号与商户号关联"></el-step>
      <el-step title="验证支付信息"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-alert :title="warnText" type="warning" v-if="warnShow"></el-alert>
    <div class="martop"></div>
    <el-form label-width="160px" :model="form" :label-position="labelPosition" ref="form">
      <el-form-item label="公众号APPID：" v-if="active === 0">
        <el-input class="input640" v-model="form.wxAppId"></el-input>
      </el-form-item>
      <el-form-item label="appSecret：" v-if="active === 0">
        <el-input class="input640" v-model="form.appSecret"></el-input>
      </el-form-item>
      <el-form-item label="上传授权文件：" v-if="active === 0">
        <el-upload
          class="upload-demo"
          :action="upimgurl"
          :headers="token"
          :on-remove="handleRemove"
          :on-change="fileSuccess"
          :before-upload="fileBeforeAvatarUpload"
          :file-list="fileList"
        >
          <el-button size="small" type="primary" v-if="form.authFileUrl == null">点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          ></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="业务域名：" v-if="active === 0">
        <el-input class="input640" v-model="wxAuthCatalogue" disabled></el-input>
        <el-button class="copy" type="default" @click="onCopy()">复制</el-button>
      </el-form-item>
      <el-form-item label="微信商户号：" v-if="active === 1">
        <el-input class="input640" v-model="form.wxMerchantNo"></el-input>
      </el-form-item>
      <el-form-item label="API秘钥：" v-if="active === 1">
        <el-input class="input640" v-model="form.wxApiSecretkey"></el-input>
      </el-form-item>
      <el-form-item label="商户号APIv3秘钥：" v-if="active === 1">
        <el-input class="input640" v-model="form.wxApiV3Key"></el-input>
      </el-form-item>
      <el-form-item label="商户号API证书序列号：" v-if="active === 1">
        <el-input class="input640" v-model="form.wxApiCert"></el-input>
      </el-form-item>
      <el-form-item label="商户号API证书秘钥：" v-if="active === 1">
        <el-input type="textarea" class="input640" v-model="form.wxApiCertSecretkey" :rows="10"></el-input>
      </el-form-item>
      <el-form-item label="公众号支付授权目录：" v-if="active === 1">
        <el-input class="input640" v-model="wxAuthCatalogue" disabled></el-input>
        <el-button class="copy" type="default" @click="onCopy()">复制</el-button>
      </el-form-item>
    </el-form>
    <div class="readme" v-if="active === 2">
       <el-checkbox v-model="form.isrelated" true-label='1' false-label='0'>我已完成公众和商户号关联</el-checkbox>
    </div>
    <div class="ewm-title" v-if="active === 3">扫码验证支付信息</div>
    <div class="ewm" v-if="active === 3" >
      <qrcode-vue :value="payEwm" :size="size" />
      <span>扫描二维码支付0.01元。<br>此费用会进入关联的商户号上，平台不予退还。</span>
    </div>
    <div class="success-result" v-if="active === 5">
      <i class="el-icon-success"></i><span>恭喜您，完成平台支付设置</span>
    </div>
    <div class="btnlist">
      <el-button class="input200" type="primary" @click="lastStep" v-if="active !== 0 && active !== 5" :disabled="lastBtnDisable">上一步</el-button>
      <el-button class="input200" type="primary" @click="nextStep" v-if="active !== 5" :disabled="nextBtnDisable">下一步</el-button>
    </div>
    <div class="text-link" v-if="active !== 5">
      <div class="title" v-if="active===0 || active===1 || active===2">操作步骤</div>
      <ul v-if="active===0">
        <li>1、登录微信公众平台后台可以下载业务域名授权文件；</li>
        <li>2、复制业务域名，填写到微信公众平台后台业务域名下。</li>
      </ul>
      <ul v-if="active===1">
        <li>1、联系微信商户号管理员找到微信商户号、支付密钥等信息，填写入该页面；</li>
        <li>2、复制授权目录，将授权目录内容填写到“微信支付商户平台-产品中心-开发配置”中。</li>
        <!-- <li>3、复制H5支付域名，将H5支付域名内容填写到“微信支付商户平台-产品中心-开发配置”中。</li> -->
      </ul>
      <ul v-if="active===2">
        <li>1、登录微信商户号后台“产品中心-AppID授权管理-账号关联（AppID绑定）”进行账号关联（AppID绑定）；</li>
        <li>2、登录微信公众号后台“微信支付--待关联商户号”，确认商户号与公众号关联。</li>
      </ul>
      <div class="title" v-if="active===0 || active===1 || active===2">帮助和指南</div>
      <ul v-if="active===0">
        <li>1、如何申请微信服务号？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=535" target="_blank">点击查看</el-link></li>
        <li>2、如何给服务号申请微信认证？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=536" target="_blank">点击查看</el-link></li>
        <li>3、如何获取微信公众号AppID？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=537" target="_blank">点击查看</el-link></li>
        <li>4、如何获取业务授权文件？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=538" target="_blank">点击查看</el-link></li>
      </ul>
      <ul v-if="active===1">
        <li>1、如何获取微信商户号？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=540" target="_blank">点击查看</el-link></li>
        <li>2、如何获取商户API秘钥？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=541" target="_blank">点击查看</el-link></li>
        <li>3、如何获取APIv3秘钥？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=542" target="_blank">点击查看</el-link></li>
        <li>4、如何获取API证书及证书秘钥？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=543" target="_blank">点击查看</el-link></li>
        <li>5、如何配置支付授权目录？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=544" target="_blank">点击查看</el-link></li>
      </ul>
      <ul v-if="active===2">
        <li>1、商户号如何进行AppID绑定？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=545" target="_blank">点击查看</el-link></li>
        <li>2、如何确认商户号与公众号关联？<el-link type="primary" :underline="false" href="https://cloud.100doc.com.cn/product/docCenter?type=11&pathId=545" target="_blank">点击查看</el-link></li>
      </ul>
    </div>
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
import { Loading } from "element-ui"
import UploadFile from "@/views/business/foreuser/UploadFile";
export default {
  http,
  api,
  name: 'paySet',
  components: {
    HeaderContent,
    QrcodeVue
  },
  data() {
    return {
      labelPosition: 'top',
      token: {
        Authorization: localStorage.getItem("yibai_token_c"),
        "Remote-Host": window.localStorage.getItem("locationHost")
      },
      upimgurl: api.payUploadFile,
      headerTitle: '支付设置',
      isLoding: 0,
      percentageNum: 0,
      fileList: [],
      fileJson: {
        name: "",
        url: ""
      },
      showUpload: false,
      accept: '.xls,.xlsx,.txt', // 支持上传的附件后缀
      active: 0,
      isClick: false,
      form: {
        wxAppId: null,
        appSecret: null,
        wxMerchantNo: null,
        wxApiSecretkey: null,
        wxApiV3Key: null,
        wxApiCertSecretkey: null,
        id: null,

        userName: '',
        fileUrl: [],
        content: "",
        columnId: "",
        title: "",
        keyword: "",
        imageUrl: "",
        author: "",
        isrelated: null
      },
      payEwm: null,
      size: 160,
      orderNo: null,
      pollingStatus: null,
      warnText: null,
      warnShow: true,
      nextBtnDisable: true,
      lastBtnDisable: false,
      nextBtnShow: true,
      lastBtnShow: false,
      loading: false,
      wxAuthCatalogue: window.location.host,
    }
  },
  computed: {},
  watch: {
    'form.wxAppId': {
      handler: function() {
        if (!this.form.wxAppId && this.active === 0) {
          this.nextBtnDisable = true
        }else if(this.form.wxAppId && this.active === 0){
          this.nextBtnDisable = false
        }
      }
    },
    'form.appSecret': {
      handler: function() {
        if (!this.form.appSecret && this.active === 0) {
          this.nextBtnDisable = true
        }else if(this.form.appSecret && this.active === 0){
          this.nextBtnDisable = false
        }
      }
    },
    'form.wxMerchantNo': {
      handler: function() {
        if (!this.form.wxMerchantNo && this.active === 1) {
          this.nextBtnDisable = true
        }else if(this.form.wxMerchantNo && this.active === 1){
          this.nextBtnDisable = false
        }
      }
    },
    'form.wxApiSecretkey': {
      handler: function() {
        if (!this.form.wxApiSecretkey && this.active === 1) {
          this.nextBtnDisable = true
        }else if(this.form.wxApiSecretkey && this.active === 1){
          this.nextBtnDisable = false
        }
      }
    },
    'form.wxApiV3Key': {
      handler: function() {
        if (!this.form.wxApiV3Key && this.active === 1) {
          this.nextBtnDisable = true
        }else if(this.form.wxApiV3Key && this.active === 1){
          this.nextBtnDisable = false
        }
      }
    },
    'form.wxApiCert': {
      handler: function() {
        if (!this.form.wxApiCert && this.active === 1) {
          this.nextBtnDisable = true
        }else if(this.form.wxApiCert && this.active === 1){
          this.nextBtnDisable = false
        }
      }
    },
    'form.wxApiCertSecretkey': {
      handler: function() {
        if (!this.form.wxApiCertSecretkey && this.active === 1) {
          this.nextBtnDisable = true
        }else if(this.form.wxApiCertSecretkey && this.active === 1){
          this.nextBtnDisable = false
        }
      }
    },
    'form.isrelated': {
      handler: function() {
        if (this.form.isrelated === '0' && this.active === 2) {
          this.nextBtnDisable = true
        }else if(this.form.isrelated === '1' && this.active === 2){
          this.nextBtnDisable = false
        }
      }
    }
  },
  async mounted() {
    await this.paySettingsInfo()
  },
  methods: {
    onCopy(e){
      let url = this.wxAuthCatalogue;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
    },
    polling() { 
      var that = this
      var timer = setInterval(function() {
        if( that.orderNo ){
          that.getMerchantPayStatus()
        }
        if (that.pollingStatus === 'SUCCESS') {
          clearInterval(timer)
          that.nextBtnDisable = false
        }
        if (that.pollingStatus == null) {
          clearInterval(timer)
          that.nextBtnDisable = false
        }
      }, 1000)
    },
    getMerchantPayStatus: async function() {
       //支付验证状态轮询
      var res = await http.get(api.getMerchantPayStatus + this.orderNo);
      if (res.data.code === 0) {
        this.pollingStatus = res.data.data.status
        if( this.active === 2 && this.payEwm ){
          this.active++
          this.lastBtnDisable = true
          this.loading = false
        }
      } else {
        this.$message.error(res.data.message);
        this.loading = false
      }
    },
    paySettingsEdit: async function(step) {
      var params = {
        step: step,
        ...this.form
      }
      var res = await http.post(api.paySettingsEdit,params);
      if (res.data.code === 0) {
        // this.wxAuthCatalogue = res.data.data.wxAuthCatalogue
        this.form.id = res.data.data.id
        this.payEwm = res.data.data.resultInfo
        this.orderNo = res.data.data.orderNo
        if(step === 3){
          this.nextBtnDisable = true
          this.polling()
          this.loading = true
        }
      } else {
        this.$message.error(res.data.message);
        this.loading = false
      }
    },
    paySettingsInfo: async function() {
      this.warnText ="需要登录微信公众平台填写信息并将以下配置文件放在相应的位置"
      var res = await http.get(api.paySettingsInfo);
      if (res.data.code === 0 && res.data.data) {
        this.form = res.data.data
        if(this.form.authFileUrl){
          this.fileList.push(this.fileJson)
          this.fileList[0].name = this.form.authFileUrl
          if(this.form.wxAppId){
            this.nextBtnDisable = false
          }
        }
      } else {
        // this.$message.error(res.data.message);
      }
    },
    deleteAuthFile() {
      this.form.authFileUrl = null
      this.$http.delete(api.deleteAuthFile)
      this.nextBtnDisable = true
    },
    handleRemove(file, fileList) {
      // 删除附件触发
      this.deleteAuthFile()
    },
    fileSuccess(file, fileList) {
      // 附件上传成功
      if(file.response){
        // console.log(file.response.data.id)
        this.form.id = file.response.data.id
        // console.log(this.form.id)
      }
      this.form.authFileUrl = file.name
      if(this.form.wxAppId && this.form.authFileUrl && this.form.id){
        this.nextBtnDisable = false
      }else{
        this.nextBtnDisable = true
      }
    },
    fileBeforeAvatarUpload(file) {
      let passType =
        "doc、docx、zip、rar、txt";
      let fileType = file.name.split(".");
      fileType = fileType[fileType.length - 1];
      const isPassType = passType.indexOf(fileType) !== -1;
      if (!isPassType) {
        this.$message.error("暂不支持该格式上传");
      }
      return isPassType;
    },
    lastStep(){
      if(this.active < 1){
        this.active = 0
      }if(this.active > 4){
        this.active = 4
      }else{
        this.active--
      }
    },
    nextStep() {
      if (this.active === 0) {
        this.warnShow = true
        this.warnText ="需要登录微信商户号填写如下信息并将以下配置文件放在相应的位置"
        this.paySettingsEdit(1)
        this.active++
      } else if (this.active === 1) {
        this.warnShow = true
        this.warnText ="此步骤需要在微信公众号、微信商户号上操作，不在平台上操作。（操作步骤请见下发内容）"
        this.paySettingsEdit(2)
        this.active++
      } else if (this.active === 2) {
        this.warnShow = false
        this.paySettingsEdit(3)
        // this.nextBtnDisable = true
        // this.polling()
        // this.loading = true
      }else if (this.active === 3) {
        this.warnShow = false
        this.active = 5
      }
    },
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    },
    warning(val) {
      this.$message({
        message: val,
        type: 'warning'
      })
    },
    error(val) {
      this.$message.error(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
::v-deep .el-upload-list__item{
  width: 640px;
}
.el-link{
  line-height: 1
}
.modelist{
  position: relative;
}
.paySet {
  margin: 20px 0 16px 0;
}
.martop{
  margin-top: 24px;
}
.input640 {
  width: 640px;
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
.upload-demo{
  margin-left: 0;
}
.btnlist{
  width: 500px;
}
.readme{
  width: 226px;
  box-sizing: border-box;
  padding: 13px 16px;
  margin-bottom: 72px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E5E5E5;
}
.text-link{
  margin-top: 68px;
  .title{
    font-size: 16px;
    font-weight: bold;
    color: #333333;
  }
  ul{
    list-style: none;
    padding: 0;
    li{
      font-size: 14px;
      color: #999999;
      line-height: 1.5;
      .el-button{
        padding: 0;
      }
    }
  }
}
.ewm{
  position: relative;
  width: 640px;
  height: 192px;
  background: #F5F5F5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 72px;
  box-sizing: border-box;
  span{
    position: absolute;
    left: 192px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }
}
.ewm-title{
  font-size: 14px;
  color: #333333;
  line-height: 14px;
  margin-bottom: 24px;
}
.success-result{
  margin: 200px 0 300px 0;
  text-align: center;
  .el-icon-success{
    font-size: 48px;
    color: rgb(26, 179, 112);
  }
  span{
    display: inline-block;
    font-size: 18px;
    color: #222222;
    line-height: 1;
    transform: translateY(-10px);
    margin-left: 10px
  }
}
.copy{
  margin-left: 10px
}
</style>
