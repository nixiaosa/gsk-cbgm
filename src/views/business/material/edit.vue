<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :model="form" label-width="100px" ref="artForm">
      <el-form-item label="资料名称:" prop="title" class="star2">
        <el-input v-model="form.title" style="width:640px" placeholder="50字以内" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="作者:" prop="keyword">
        <el-input v-model="form.author" style="width:640px" placeholder="15字以内" maxlength="15"></el-input>
      </el-form-item>
      <el-form-item label="附件：" class="star">
        <file-upload
          class="avatar-uploader"
          :path-key="busId"
          :max-file-size="uploadMaxSize"
          :annexType="annexType"
          @uploading="beforeHandleAvatar"
          @uploadend="handleAvatarSuccess"
          @onRemove="handleRemove"
        >
          <el-button type="primary" size="small">点击上传</el-button>
        </file-upload>
        <div class="tip">注：支持附件类型为：doc、docx、ppt、pptx、xls、xlsx、pdf、zip、rar、txt、jpg、jpeg、png，大小不超过50M ，仅支持上传1个附件</div>
        <transition name="el-zoom-in-top">
          <a v-if="fileData" class="el-upload-list__item-name file-show"><i class="el-icon-document"></i>{{ this.fileData}}<i class="el-icon-upload-success el-icon-circle-check upload-success"></i><i class="el-icon-close upload-del" @click="handleRemove"></i></a>
        </transition>
      </el-form-item>
       <el-form-item label="资料描述:" prop="keyword">
        <el-input type="textarea" v-model="form.description" style="width:640px" placeholder="请输入..."></el-input>
      </el-form-item>
    </el-form>
    <el-button v-if="!$route.query.id" type="primary" style="margin-top:20px" @click="save()">保 存</el-button>
    <el-button v-if="$route.query.id" type="primary" style="margin-top:20px" @click="save($route.query.id)">保 存</el-button>
    <el-button @click="cancel()">取 消</el-button>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import HeaderContent from "@/components/header-content";
import $cos from "yb-cos";
import FileUpload from '@/components/QCloud-upload/File-upload'
export default {
  name: "materialEdit",
  components: {
    HeaderContent,FileUpload
  },
  filters: {
  },
  data() {
    return {
      annexType: 'doc,docx,ppt,pptx,xls,xlsx,pdf,zip,rar,txt,jpg,jpeg,png',
      maxSize: 52428800,
      headerTitle: "资料编辑",
      opertions: ["新建资料"],
      uploadCos: '',
      fileJson: {
        name: "",
        url: ""
      },
      progress: 0,
      name: "register-modules-example",
      id: this.$route.query.id,
      busId: this.$route.query.busId,
      value: "",
      // upimgurl: api.uploadImg,
      // upimgurl: api.payUploadFile,
      token: {
        Authorization: localStorage.getItem("yibai_token_c"),
        "Remote-Host": window.localStorage.getItem("locationHost")
      },
      form: {
        description: "",
        fileUrl: [],
        title: "",
        author: "",
        fileSize: "",
        coverMap: ""
      },

      batchstopDia: false,
      sstBatch: "0",
      fileList: [],
      fileData: '',
      showUpload: false,
      batchUploadDia: false,
      fileName: '',
      uploadMaxSize: 52428800,
    };
  },
  async mounted() {
    if( this.$route.query.id ){
      await this.getDetail()
    }
  },
  created() {
  },
  methods: {
  beforeHandleAvatar(file, item){
    this.fileBeforeAvatarUpload(file)
  },
  handleAvatarSuccess(file, res) {
    if (res.code === 0) {
      // console.log(res)
      this.form.fileUrl = res.data.downLoadUrl
      this.form.fileSize = (file.size / 1024 /1024).toFixed(2) < 0.01 ? 0.01 : (file.size / 1024 /1024).toFixed(2)
      this.fileData = file.name
    }
  },
 
  async save(id){
    let params = {}
      if(id){
        params = {
          id: id,
          title: this.form.title,
          size: this.form.fileSize,
          url: this.form.fileUrl,
          description: this.form.description,
          author: this.form.author,
          fileName: this.fileData
        };
      } else {
        params = {
          title: this.form.title,
          size: this.form.fileSize,
          url: this.form.fileUrl,
          description: this.form.description,
          author: this.form.author,
          fileName: this.fileData
        };
      }
      
      if(!this.form.title.trim()){
        this.$message.error("资料名称不能为空")
        return false
      }
      if(!this.form.fileUrl){
        this.$message.error("请上传附件")
        return false
      }
      const res = await http.post(api.documentCreate, params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.$router.push({path: "/material/materialList"});
      } else {
        this.$message.error(res.data.message);
      }
   },
   cancel() {
      this.$router.push({path: "/material/materialList"});
   },
   async getDetail(){
     const res = await http.get(api.documentGetDetail + this.$route.query.id);
      if (res.data.code === 0) {
        this.form.title = res.data.data.title
        this.form.author = res.data.data.author
        this.form.description = res.data.data.description
       
        this.fileList.push(this.fileJson)
        this.fileList[0].name = res.data.data.url
        this.fileList[0].url = res.data.data.url
        this.form.fileUrl = res.data.data.url

        this.fileData = res.data.data.fileName

      } else {
        this.$message.error(res.data.message);
      }
   },
    deleteAuthFile() {
      this.form.fileUrl = null
      this.fileData = ""
      this.form.fileSize = ""
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
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.star {
  position: relative;
}

.star::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  left: 36px;
  top: 12px;
}

.star2 {
  position: relative;
}

.star2::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  left: 20px;
  top: 12px;
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
