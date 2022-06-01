<template>
  <div class="createTenant">
    <div class="header">
    </div>
    <div class="basicInfo">
      <el-form :model="basicInfo" ref="basicInfo" :rules="rules" label-width="140px" class="demo-ruleForm">
        <div v-show="isPageOneShow">
          <h5 class="basicInfoTitle">基础信息</h5>
          <el-form-item label="租户名称：" prop="name">
            <el-input class="input400" v-model="basicInfo.name" :disabled="true"></el-input>
          </el-form-item>
          <!-- <el-form-item label="主题色：" prop="color">
            <el-input class="input200" v-model="basicInfo.themeColor"></el-input>
          </el-form-item> -->
          <el-form-item label="平台名称：" prop="platformName">
            <el-input class="input400" v-model="basicInfo.platformName" :disabled="!isedit"></el-input>
            <p class="tip-span">示例：北京医百科技有限公司</p>
          </el-form-item>
          <el-form-item label="LOGO：" prop="name">
            <el-upload
              class="avatar-uploader"
              :accept="fileType"
              :disabled="!isedit"
              :action="upimgurl"
              :headers="token"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="basicInfo.imageUrl" :src="basicInfo.imageUrl" class="avatar">
              <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
              <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
            </el-upload>
            <span class="tip-span">提示：建议使用比例为2:1的图片,如800*400</span>
          </el-form-item>
          <h5 class="basicInfoTitle">域名信息</h5>
          <el-form-item label="用户端地址：">
            <span class="prohibit">http://{{basicInfo.consumerUrl}}</span>
          </el-form-item>
          <el-form-item label="管理后台地址：">
            <span class="prohibit">http://{{basicInfo.consumerUrl}}/admin</span>
          </el-form-item>

          <!-- <h5 class="basicInfoTitle" v-if="liveEnd1||liveEnd2||liveEnd4||liveEnd5">客户端(下载地址)</h5>
          <el-form-item label="店员培训：" v-if="liveEnd1">
            <span class="prohibit">{{liveEnd1}}</span>
          </el-form-item>
          <el-form-item label="空中课堂：" v-if="liveEnd2">
            <span class="prohibit">{{liveEnd2}}</span>
          </el-form-item>
          <el-form-item label="线上公开课：" v-if="liveEnd4">
            <span class="prohibit">{{liveEnd4}}</span>
          </el-form-item>
          <el-form-item label="学术会议：" v-if="liveEnd5">
            <span class="prohibit">{{liveEnd5}}</span>
          </el-form-item> -->

          <h5 class="basicInfoTitle" v-if="basicInfo.ios||basicInfo.android">App</h5>
          <el-form-item label="ios：" v-if="basicInfo.ios">
            <span><a :href="basicInfo.ios" target="blank">{{basicInfo.ios}}</a></span>
            <br>
            <img :src="basicInfo.ios" alt="">
          </el-form-item>
          <el-form-item label="android：" v-if="basicInfo.android">
            <span><a :href="basicInfo.android" target="blank">{{basicInfo.android}}</a></span>
            <br>
            <img :src="basicInfo.android" alt="">
          </el-form-item>
          <h5 class="basicInfoTitle">配置信息</h5>
          <el-form-item label="网站标题：">
            <el-input class="input400" v-model="basicInfo.websiteTitle" :disabled="!isedit" :placeholder="basicInfo.name"></el-input>
            <p class="tip-span">示例：北京医百科技有限公司</p>
          </el-form-item>
          <el-form-item label="网站关键字：">
            <el-input class="input600" v-model="basicInfo.websiteKeywords" :disabled="!isedit" placeholder="SaaS服务 在线教育 医疗"></el-input>
            <p class="tip-span">说明：输入网站关键字,可以多个</p>
          </el-form-item>
          <el-form-item label="网站描述：">
            <el-input type="textarea" class="input600" v-model="basicInfo.websiteDescription" :disabled="!isedit"></el-input>
            <p class="tip-span">说明：网站或者企业的简介，限定200字</p>
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="mailbox">
            <el-input class="input400" v-model="basicInfo.mailbox" :disabled="!isedit"></el-input>
            <p class="tip-span">说明：请填写客服联系邮箱</p>
          </el-form-item>
          <el-form-item label="客服电话：">
            <el-input class="input400" v-model="basicInfo.serviceTel" :disabled="!isedit"></el-input>
            <p class="tip-span">说明：请填写客服联系电话</p>
          </el-form-item>
          <el-form-item label="版权信息：">
            <el-input class="input600" v-model="basicInfo.icp" :disabled="!isedit"></el-input>
            <p class="tip-span">请填写版权信息，如：北京医百科技有限公司</p>
          </el-form-item>
          <el-form-item label="用户服务协议名称：">
            <el-input class="input600" :maxlength="50" v-model="basicInfo.agreename" :disabled="!isedit"></el-input>
            <p class="tip-span">说明：服务协议显示在用户登录页，限定50字</p>
          </el-form-item>
          <div style="overflow: hidden">
            <el-form-item label=" 用户服务协议内容：">
              <div v-if="!isedit" v-html="basicInfo.agreecontent" class="tip-span"></div>
              <div v-if="isedit" style="width: 810px; position: relative;margin-bottom: 50px">
                <quill-editor v-model="basicInfo.agreecontent"
                              @change="onEditorChange($event)"
                              ref="myTextEditor"
                              :options="editorOption">
                </quill-editor>
                <span v-show="textLength" style="position: absolute;bottom: -24px;right: 20px; color: #aaa">{{textLength}}/20000</span>
                <span class="tip-span">说明：服务协议内容支持文字与链接，链接地址样例为：https://www.100doc.com.cn，字数不超过20000字</span>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="上传证件照注释文字内容：">
            <el-input class="input600" :maxlength="300" v-model="basicInfo.papersDescription" :disabled="!isedit"></el-input>
          </el-form-item>
          <!-- <h5 class="basicInfoTitle">开通设置</h5>
            <el-form-item label="管理员账户：">
              <el-input class="input400" v-model="basicInfo.userAccount" placeholder="手机号" :maxlength='11'></el-input>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input class="input400" v-model="basicInfo.userPassword"></el-input>
            </el-form-item> -->
          <el-form-item label="精彩栏目别名：">
            <el-input class="input600" :maxlength="4" v-model="basicInfo.columnAlias" :disabled="!isedit"></el-input>
          </el-form-item>
          <el-form-item label="主题颜色：">
            <el-radio v-model="basicInfo.themeColor" label="rgb(26, 179, 112)" :disabled="!isedit">
               <em class="theme-color1"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(249, 119, 38)" :disabled="!isedit">
              <em class="theme-color2"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(147, 50, 191)" :disabled="!isedit">
               <em class="theme-color3"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(84, 197, 212)" :disabled="!isedit">
               <em class="theme-color4"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(40, 157, 233)" :disabled="!isedit">
               <em class="theme-color5"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(11, 102, 192)" :disabled="!isedit">
               <em class="theme-color6"></em>
            </el-radio>
            <el-radio v-model="basicInfo.themeColor" label="rgb(255, 110, 121)" :disabled="!isedit">
              <em class="theme-color7"></em>
            </el-radio>
            <!-- <el-radio v-model="basicInfo.themeColor" label="basicInfo.themeColor" :disabled="!isedit">
              <el-color-picker v-model="basicInfo.themeColor" class="color-picker" @change="themeColor" show-alpha :disabled="!isedit"></el-color-picker>
              <el-color-picker v-model="basicInfo.themeColor" color-format="rgb" class="color-picker" @change="themeColor" :disabled="!isedit"></el-color-picker>
            </el-radio> -->
            <span class="customize">自定义</span>
            <el-color-picker v-model="basicInfo.themeColor" color-format="rgb" class="color-picker" @change="themeColor" :disabled="!isedit"></el-color-picker>
          </el-form-item>
        </div>
        <el-form-item v-if="userAuths.basic_information_edit">
          <el-button type="primary" @click="edit()" v-show="!isedit">编 辑</el-button>
          <el-button type="primary" @click="submitForm('basicInfo')" v-show="isedit">保 存</el-button>
          <el-button @click="cancel()" v-show="isedit">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import http from '@/utils/fetch'
import api from '@/api/tenantInfoSave'
import { mapGetters } from 'vuex'
import { enoughLength, checkEmail, validatPlatName } from '@/utils/validate'
export default {
  name: 'createTenant',
  components: {
  },
  data() {
    const validatePname = (rule, value, callback) => {
      if (!validatPlatName(value)) {
        callback(new Error('平台名称只能包括汉字、英文和数字'))
      } else if (!enoughLength(value, 2)) {
        callback(new Error('平台名称位数不能小于2位'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else if (!checkEmail(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }
    return {
      editorOption: {
        placeholder: '请输入内容',
        modules: {
          toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'direction': 'rtl' }],
            ['link']
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          }
        }
      },
      fileType: '.jpg,.png,.gif',
      isedit: false,
      isPageOneShow: true,
      isPageTwoShow: false,
      upimgurl: api.uploadImg,
      ext: [],
      token: { Authorization: localStorage.getItem('yibai_token_c'), 'Remote-Host': window.localStorage.getItem('locationHost') },
      companyId: '',
      basicInfo: {
        columnAlias: '', // 精彩栏目别名
        agreecontent: '',
        agreename: '',
        imageUrl: '', // logo
        name: '', // 租户名称
        themeColor: '', // 主题色
        color:'',
        platformName: '', // 平台名称
        consumerUrl: '', // 用户端地址
        managementUrl: this.hosturl + '/admin', // 管理后台地址
        userAccount: '', // 管理员账户
        userPassword: '', // 管理员密码
        websiteTitle: '', // 网站title
        websiteKeywords: '', // 网站Keywords
        websiteDescription: '', // 网站Description
        mailbox: '', // 联系邮箱
        serviceTel: '', // 客服电话
        icp: '', // 版权及备案号
        agreement: '', // 用户协议标题
        agreementCentent: '', // 用户协议内容
        ios: '',
        android: '',
        papersDescription: '', //证件照注释信息
      },
      pagenow: '下一页',
      rules: {
        platformName: [{ required: true, trigger: 'blur', validator: validatePname }],
        mailbox: [{ required: false, trigger: 'blur', validator: validateEmail }]
      },
      textLength: 0,
      liveEnd1: '',
      liveEnd2: '',
      liveEnd4: '',
      liveEnd5: ''
    }
  },
  computed: {
    ...mapGetters([
      'service',
      'businessTrain',
      'businessClass',
      'businessOnlineOpenClass',
      'businessAcademicConFerence',
      'userAuths'
    ]),
    hosturl: () => {
      if (process.env.NODE_ENV.indexOf('development') >= 0) {
        return '.test.100doc.com.cn'
      }
      var host = window.location.host
      if (host.indexOf('test') >= 0) {
        return '.test.100doc.com.cn'
      } else {
        return '.100doc.com.cn'
      }
    }
  },
  mounted() {
    this.companyGet()
    this.configList() // 信息回显
    this.pushTool()
  },
  methods: {
    themeColor(val){
      this.basicInfo.themeColor = val
      // console.log(this.basicInfo.themeColor)
    },
    onEditorChange(event) {
      this.textLength = true
      this.textLength = event.quill.getLength() - 1
    },
    cancel() {
      this.isedit = false
      this.configList()
    },
    async pushTool() {
      var res = await http.post(api.pushTool, {})
      if (res.data.code === 0) {
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          if (data[i].businessId === 1) {
            if (this.businessTrain) {
              this.liveEnd1 = data[i].url
            }
            if (this.businessClass) {
              this.liveEnd2 = data[i].url
            }
          }
          if (data[i].businessId === 4) {
            if (this.businessOnlineOpenClass) {
              this.liveEnd4 = data[i].url
            }
          }
          if (data[i].businessId === 5) {
            if (this.businessAcademicConFerence) {
              this.liveEnd5 = data[i].url
            }
          }
        }
      } else {
        this.errorMsg(res.data.message)
      }
    },
    postHandle: async function(e) {
      if (this.textLength > 20000) {
        this.errorMsg('用户协议内容最多只能20000字')
        return false
      }
      var jsonString = {
        'color': e.color,
        'websiteTitle': e.websiteTitle,
        'websiteKeywords': e.websiteKeywords,
        'websiteDescription': e.websiteDescription,
        'mailbox': e.mailbox,
        'serviceTel': e.serviceTel,
        'platomName': e.platformName,
        'icp': e.icp,
        'logoUrl': e.imageUrl,
        agreecontent: e.agreecontent,
        papersDescription: e.papersDescription,
        columnAlias: e.columnAlias,
        agreename: e.agreename,
        themeColor: e.themeColor
      }
      // var companyUserString = {
      //   'password': md5(e.userPassword),
      //   'username': e.userAccount
      // }
      jsonString = JSON.stringify(jsonString)
      var params = {
        'ext': jsonString,
        'logoUrl': e.imageUrl,
        'platformName': e.platformName,
        columnAlias: e.columnAlias,
        themeColor: e.themeColor
        // 'companyUser': companyUserString
      }
      var res = await http.post(api.handle, params)
      if (res.data.code !== 0) {
        this.errorMsg(res.data.message)
      }
      if (res.data.code === 0) {
        this.successMsg('保存成功')
        this.isedit = false
        this.configList()
      }
    },
    configList: async function() {
      var params = {}
      var res = await http.post(api.companyGet, params)
      var $this = this.basicInfo
      if (res.data.code !== 0) {
        this.errorMsg('获取列表失败')
      }
      res = res.data.data
      // this.ext = JSON.parse(res.ext)
      let extData = JSON.parse(res.ext)
      $this.consumerUrl = res.url
      $this.imageUrl = res.logoUrl
      $this.name = res.name
      $this.platformName = res.platformName
      $this.color = extData.color
      $this.websiteTitle = extData.websiteTitle
      $this.websiteKeywords = extData.websiteKeywords
      $this.websiteDescription = extData.websiteDescription
      $this.mailbox = extData.mailbox
      $this.serviceTel = extData.serviceTel
      $this.icp = extData.icp
      $this.companyId = res.id
      $this.android = res.android
      $this.ios = res.ios
      $this.agreecontent = extData.agreecontent
      $this.papersDescription = extData.papersDescription
      $this.columnAlias = extData.columnAlias
      $this.agreename = extData.agreename
      $this.themeColor = extData.themeColor
    },
    isShow() {
      this.isPageOneShow = !this.isPageOneShow
      this.isPageTwoShow = !this.isPageTwoShow
      this.pagenow = this.pagenow === '下一页' ? '上一页' : '下一页'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postHandle(this.basicInfo)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(response, res, file) {
      this.basicInfo.imageUrl = response.data
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
    companyGet: async function() {
      var params = {}
      const res = await http.post(api.companyGet, params)
      if (res.data.code === 0) {
        this.companyId = res.data.data.id
      }
    },
    errorMsg(val) { // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    },
    successMsg(val) { // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: 'success'
      })
    },
    edit() {
      this.isedit = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.ql-container {
  height: 400px;
}
.ql-snow .ql-tooltip::before {
  content: '输入网址：' !important;
}
.ql-snow .ql-action::after {
  content: '编辑' !important;
}
.ql-snow .ql-editing .ql-action::after {
  content: '确定' !important;
}
.ql-snow .ql-editing .ql-remove::after {
  content: '移除' !important;
}
.basicInfo {
  margin-top: 30px;
  margin-left: 20px;
}

.prohibit {
  color: #999
}

.el-form-item__error{
  margin-left:30px !important;
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
  height: 89px;
  line-height: 89px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 89px;
  display: block;
}

.basicInfoTitle {
  position: relative;
}
.basicInfoTitle::after {
  position: absolute;
  left: -8px;
  top: -1px;
  content: '';
  width: 4px;
  height: 16px;
  // background: #20a0ff;
  background: $c-theme;
}
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input200 {
  width: 100px
}
.tip-span{
  margin: 0;
  margin-left:20px;
  color: #aaa
}
.createTenant .el-form-item:nth-last-child(3).is-required .el-form-item__label:before {
  content: '';
}

.theme-color1{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(26, 179, 112)
}
.theme-color2{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(249, 119, 38)
}
.theme-color3{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(147, 50, 191)
}
.theme-color4{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(84, 197, 212)
}
.theme-color5{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(40, 157, 233)
}
.theme-color6{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(11, 102, 192)
}
.theme-color7{
  display: inline-block;
  width: 50px;
  height: 20px;
  transform: translateY(5px);
  background-color: rgb(255, 110, 121)
}
.color-picker{
  transform: translateY(15px);
}
.customize{
  font-size: 14px;
  color: #606266;
  margin-right: 10px;
}
</style>
