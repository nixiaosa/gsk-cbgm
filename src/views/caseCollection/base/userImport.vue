<template>
  <div>
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :model="form" label-width="120px" ref="artForm">
      <el-form-item label="用户信息完整度:" prop="title">
        <el-radio v-model="form.isComplete" label="1">完整（参与活动时不填写或填写较少信息）</el-radio>
        <el-radio v-model="form.isComplete" label="0">仅有姓名与手机号码（参与活动时需填写更多信息）</el-radio>
      </el-form-item>
      <el-form-item label="通知导入观众:" prop="keyword">
        <el-radio v-model="form.notifyImportUser" label="1">是（被导入观众，系统发送短信通知）</el-radio>
        <el-radio v-model="form.notifyImportUser" label="0">否（系统不发送短信通知）</el-radio>
      </el-form-item>
      <el-form-item label="导入用户：">
        <file-upload
          class="avatar-uploader"
          :path-key="$route.query.busId"
          :max-file-size="uploadMaxSize"
          :annexType="annexType"
          @uploading="beforeHandleAvatar"
          @uploadend="handleAvatarSuccess"
          @onRemove="handleRemove"
        >
          <el-button type="primary" size="small">点击上传</el-button>
        </file-upload>
        <el-button type="primary" size="small" class="downLoad" @click="downLoad">下载模版</el-button>
        <div class="tip">*注意：导入目标用户，请先下载模板，并按要求填写相关信息</div>
        <transition name="el-zoom-in-top">
          <a v-if="fileData" class="el-upload-list__item-name file-show"><i class="el-icon-document"></i>{{ this.fileData}}<i class="el-icon-upload-success el-icon-circle-check upload-success"></i><i class="el-icon-close upload-del" @click="handleRemove"></i></a>
        </transition>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="margin-top:10px;margin-left:120px" :disabled="submitDisabled" @click="onSubmit()">提交</el-button>
     <!--  导入结果弹窗  -->
    <import-result-dialog ref="childImportResultDialog"></import-result-dialog>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
import $cos from "yb-cos";
import FileUpload from '@/components/QCloud-upload/File-upload'
import ImportResultDialog from "./Import-result-dialog.vue"

export default {
  name: "userImport",
  components: { HeaderContent,FileUpload,ImportResultDialog },
  props: ["id", "page", "busId"],
  data() {
    return {
      headerTitle: "导入用户",
      opertions: ["返回"],
      annexType: 'xls,xlsx',
      maxSize: 52428800,
      uploadCos: '',
      fileJson: {
        name: "",
        url: ""
      },
      progress: 0,
      name: "register-modules-example",    
      value: "",
      form: {
        description: "",
        attendExcel: [],
        title: "",
        author: "",
        fileSize: "",
        coverMap: "",
        notifyImportUser: "1",
        isComplete: "1",
      },

      batchstopDia: false,
      sstBatch: "0",
      fileList: [],
      fileData: '',
      showUpload: false,
      batchUploadDia: false,
      fileName: '',
      uploadMaxSize: 52428800,
      submitDisabled: true
    };
  },
  watch: {},
  filters: {},
  created() {},
  async mounted() {
    // this.personUploadList(1)
  },
  methods: {
    getImportInfo(val) {
      this.$refs.childImportResultDialog.getInfo(val)
    },
    downLoad(){
      if( this.form.isComplete === '1'){
        // 完整版
        window.open('https://yibaifiles-1252497236.cos.ap-chengdu.myqcloud.com/webPc/%E8%A1%A8%E6%A0%BC/%E7%97%85%E4%BE%8B%E5%BE%81%E9%9B%86/3/%E5%AF%BC%E5%85%A5%E7%97%85%E4%BE%8B%E5%BE%81%E9%9B%86%E7%94%A8%E6%88%B7.xls')
      } else {
        // 仅有姓名和手机号
        window.open('https://yibaifiles-1252497236.cos.ap-chengdu.myqcloud.com/webPc/%E8%A1%A8%E6%A0%BC/%E5%AF%BC%E5%85%A5%E7%94%A8%E6%88%B7%E6%A8%A1%E6%9D%BF.xls')
      }
      
    },
    beforeHandleAvatar(file, item){
      this.fileBeforeAvatarUpload(file)
    },
    handleAvatarSuccess(file, res) {
      if (res.code === 0) {
        this.form.attendExcel = decodeURIComponent(res.data.Location)
        this.form.fileSize = (file.size / 1024 /1024).toFixed(2) < 0.01 ? 0.01 : (file.size / 1024 /1024).toFixed(2)
        this.fileData = file.name
        this.submitDisabled = false
        
      }
    },
    deleteAuthFile() {
      this.form.attendExcel = null
      this.fileData = ""
      this.form.fileSize = ""
      this.submitDisabled = true
    },
    handleRemove(file, fileList) {
      // 删除附件触发
      this.deleteAuthFile()
    },
    fileBeforeAvatarUpload(file) {
      let fileType = file.name.split(".");
      fileType = fileType[fileType.length - 1];
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 50MB!");
        return false
      }
      if (this.fileList.length > 1) {
        this.$message.error("最多上传1个附件");
        return false
      }
      return isLt2M;
    },
    async onSubmit(){
      this.submitDisabled = true
      let params = {}
      params = {
        businessId: "8", //病例征集
        busId: this.$route.query.busId,
        id: this.$route.query.id,
        isComplete: Number(this.form.isComplete),
        notifyImportUser: Number(this.form.notifyImportUser),
        busType: "casecollect",
        name: this.$route.query.name,
        attendExcel: this.form.attendExcel
      };
      const res = await http.post(api.userEnrollImport, params)
      if (res.data.code === 0) {
        this.getImportInfo(res.data.data)
        this.submitDisabled = false
        // this.$message.success("提交成功")
        // this.$router.back()
      } else {
        this.$message.error(res.data.message)
      }
    },
    headerClick(){
      this.$router.back()
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.downLoad{
  position: absolute;
  left: 100px;
  top: 5px;
}
.tip{
  font-size: 14px;
  line-height: 1;
  color: rgb(131, 145, 165);
  margin-bottom: 10px;
}
.upload-del{
  display: none;
  vertical-align: top;
  margin: 2px 0 0 50px
}
.upload-success{
  vertical-align: top;
  margin: 2px 0 0 50px
}
.file-show:hover{
   .upload-del{
     display: inline-block
   }
   .upload-success{
     display: none
   }
}
</style>
