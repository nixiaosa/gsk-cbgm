<template>
  <div class="modelist">
    <input id="uploadVideoNow-file" type="file" ref="upload" style="display:none">
    <div class="piont-flex" style="border:none">
      <div class="point-title">文章编辑</div>
      <div></div>
    </div>
    <el-form :model="form" label-width="100px" :rules="artRules" ref="artForm">
      <el-form-item label="文章标题:" prop="title">
        <el-input v-model="form.title" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="栏目:">
        <el-select v-model="value" @change="columnSon" :placeholder="placeholder">
          <el-option
            v-for="item in columnTags"
            :key="item.parent.id"
            :label="item.parent.name"
            :value="item.parent.id"
          ></el-option>
        </el-select>
        <el-select v-model="form.columnId" :placeholder="placeholder2">
          <el-option
            v-for="item in columnTagSon"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作者:" prop="keyword">
        <el-input v-model="form.author" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="关键字:" prop="keyword">
        <el-input v-model="form.keyword" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="封面图:" prop="name">
        <el-upload
          class="avatar-uploader"
          id="contentimg1"
          :action="upimgurl"
          :headers="token"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
          <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
        </el-upload>
        <span style="margin-left:30px;">*注：图片比例为：16:9，图片格式为jpg/png/jpeg，大小不超过10M</span>
      </el-form-item>
      <el-form-item label="显示时间：">
        <el-date-picker
          v-model="form.showTime"
          type="datetime"
          :picker-options="pickerDisabled"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="附件：">
        <el-upload
          class="upload-demo"
          :action="upimgurl"
          :headers="token"
          :on-remove="handleRemove"
          :on-change="fileSuccess"
          :before-upload="fileBeforeAvatarUpload"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >注：支持附件类型为：doc、docx、ppt、pptx、xls、xlsx、pdf、zip、rar、txt、jpg、jpeg、png，大小不超过20M ，最多上传20个附件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-upload
      id="contentimg"
      multiple
      v-show="false"
      :action="upimgurl"
      :headers="token"
      :show-file-list="false"
      :on-exceed="exceedChange"
      :on-success="handleAvatarSuccess1"
      :before-upload="beforeAvatarUpload"
    >
      <img :src="contentImg" class="avatar">
    </el-upload>
    <!-- 上传视频开始 -->
    <div v-show="videoHiden" class="info-item-wrapper">
      <div v-show="uploadBoxIsShow" class="info-lable">
        <span class="attention">*</span>上传视频
      </div>
      <div v-show="uploadBoxIsShow" class="info-content">
        <el-button v-show="uploadBoxIsShow" id="uploadVideoNow">点击上传</el-button>
      </div>
    </div>

    <!--视频上传进度开始-->
    <el-dialog
      title="选择上传"
      :visible.sync="schedule"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      size="tiny"
    >
      <el-form :model="form" style="width:100%">
        <el-form-item label="类型：" prop="keyword">
          <el-radio v-model="radio" label="1">视频</el-radio>
          <el-radio v-model="radio" label="2">音频</el-radio>
        </el-form-item>
        <el-form-item v-show="radio === '1'" label="视频封面图:" prop="name">
          <el-upload
            class="avatar-uploader"
            :action="upimgurl"
            :headers="token"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="videoImageUrl" :src="videoImageUrl" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
          </el-upload>
          <span style="margin-left:30px;">*注：图片格式为jpg/png/jpeg，大小不超过10M</span>
        </el-form-item>
        <el-form-item label="上传文件：" prop="keyword">
          <el-button
            v-show="uploadingVideoIsShow"
            type="primary"
            @click="uploadingVideo"
          >{{radio === '1' ? '选择视频' : '选择音频'}}</el-button>
          <el-progress
            v-show="!uploadingVideoIsShow"
            style="width: 50%;float:left;margin-top: 8px"
            :text-inside="true"
            :stroke-width="16"
            :percentage="progress"
          ></el-progress>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="schedule = false">取 消</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="uploadingOk">确定</el-button>
      </div>
    </el-dialog>
    <!--视频上传进度结束-->
    <span v-show="videoHiden" class="hintLive">支持上传的格式：MP4</span>
    <!-- 上传视频结束 -->
    <div>
      <div class="quill-editor-example">
        <!-- quill-editor -->
        <quill-editor v-model="form.content" ref="myTextEditor" :options="editorOption"></quill-editor>
      </div>
    </div>
    <el-button v-if="!id" type="primary" style="margin-top:20px" @click="createNews1()">保 存</el-button>
    <el-button v-if="id" type="primary" style="margin-top:20px" @click="newsUpdate1()">保 存</el-button>
    <el-button @click="cancel()">取 消</el-button>
  </div>
</template>
<script>
import liveapi from "@/api/liveapi";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { Quill } from "vue-quill-editor";
import { ImageDrop } from "quill-image-drop-module";
import imageResize from "quill-image-resize-module";
import $ from "jquery";
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/imageResize", imageResize);

export default {
  data() {
    const isLengthOut = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("标题不能为空"));
      } else if (value.trim().length > 100) {
        callback(new Error("标题不能大于100个字"));
      } else {
        callback();
      }
    };
    const isLengthOut2 = (rule, value, callback) => {
      if (value.trim().length > 100) {
        callback(new Error("关键字不能大于100个字"));
      } else {
        callback();
      }
    };
    return {
      fileList: [], // 上传文件列表
      columnId: "",
      uploadingVideoIsShow: true, // 控制上传视频进度条是否显示
      videoImageUrl: "",
      radio: "1",
      videoUrl: "",
      model: false,
      schedule: false,
      isDisabled: true,
      videoHiden: false,
      progress: 0,
      uploadBoxIsShow: true,
      placeholder: "请选择栏目",
      placeholder2: "请选择子栏目",
      name: "register-modules-example",
      contentImg: "",
      id: this.$route.query.id,
      options: [],
      columnTagSon: [],
      columnTags: [],
      value: "",
      upimgurl: api.uploadImg,
      token: {
        Authorization: localStorage.getItem("yibai_token_c"),
        "Remote-Host": window.localStorage.getItem("locationHost")
      },
      dataColumnId: "",
      form: {
        fileUrl: [],
        content: ``,
        columnId: "",
        title: "",
        keyword: "",
        imageUrl: "",
        author: "",
        showTime: new Date()
      },
      editorOption: {
        placeholder: "请输入内容",
        modules: {
          toolbar: [
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            [{ direction: "rtl" }],
            ["link", "image", "video"]
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageDrop: true,
          imageResize: true
        }
      },
      artRules: {
        title: [{ required: true, trigger: "blur", validator: isLengthOut }],
        keyword: [{ required: false, trigger: "blur", validator: isLengthOut2 }]
      },

      pickerDisabled: {
        disabledDate: time => {
          return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
        }
      }
    };
  },
  mounted() {
    this.columnList();
    this.getNews();
    var vm = this;
    var imgHandler = async function(image) {
      vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection();
      if (image) {
        var fileInput = document.getElementById("contentimg"); // 隐藏的file文本ID
        var fileUpimg = fileInput.getElementsByClassName("el-upload")[0];
        fileUpimg.click(); // 加一个触发事件
      }
    };
    vm.$refs.myTextEditor.quill
      .getModule("toolbar")
      .addHandler("image", imgHandler);

    // 视频
    var that = this;
    var getSignature = function(callback) {
      $.ajax({
        url: liveapi.upvideourl,
        type: "POST",
        dataType: "json",
        success: function(result) {
          callback(result.data);
        }
      });
    };
    $("#uploadVideoNow-file").on("change", function() {
      var filePath = document.getElementById("uploadVideoNow-file").value;
      var videoExt = filePath.substr(filePath.lastIndexOf(".")).toLowerCase();
      if (that.radio === "1") {
        if (videoExt !== ".mp4") {
          that.$message.error("当前只支持MP4格式视频");
          return false;
        }
      } else {
        if (videoExt !== ".mp3") {
          that.$message.error("当前只支持MP3格式的音频");
          return false;
        }
      }
      that.schedule = true;
      that.uploadBoxIsShow = false;
      var videoFile = this.files[0];
      window.qcVideo.ugcUploader.start({
        videoFile: videoFile,
        getSignature: getSignature,
        allowAudio: 1,
        success: function(result) {
          if (that.radio === "2") {
            that.videoUrl = result.videoUrl;
            that.isDisabled = false; // 保存按钮可以点击
          }
        },
        progress: function(result) {
          that.uploadingVideoIsShow = false;
          that.progress = parseInt(result.curr * 100);
        },
        finish: function(result) {
          that.fileKey = result.fileId;
          if (!vm.addVideoRange) {
            vm.addVideoRange = vm.$refs.myTextEditor.quill.getSelection();
          }
          that.videoUrl = result.videoUrl;
          that.isDisabled = false; // 保存按钮可以点击
        },
        error: function(result) {
          alert("上传失败的原因：" + result.msg);
          $("#uploadVideoNow-file").val("");
          that.schedule = false;
          that.progress = 0;
        }
      });
    });
    $("#uploadVideoNow").on("click", function() {
      $("#uploadVideoNow-file").click();
    });

    var videoHandler = async function(video) {
      vm.addVideoRange = vm.$refs.myTextEditor.quill.getSelection();
      if (video) {
        that.schedule = true;
      }
    };
    // 上传视频组建点击事件
    vm.$refs.myTextEditor.quill
      .getModule("toolbar")
      .addHandler("video", videoHandler);
  },
  computed: {
    editor() {
      return this.$refs.myTextEditor.quill;
    }
  },
  methods: {
    exceedChange() {
      this.$message.error("一次最多同时上传10个文件，请从新选择");
    },
    handleRemove(file, fileList) {
      // 删除附件触发
      this.fileList = fileList;
      let fileUrl = this.fileList.map(({ name, response, url }) => ({
        name: name,
        url: response ? response.data : url
      }));
      this.form.fileUrl = fileUrl;
    },
    fileSuccess(file, fileList) {
      // 附件上传成功
      this.fileList = fileList;
      let fileUrl = this.fileList.map(({ name, response, url }) => ({
        name: name,
        url: response ? response.data : url
      }));
      this.form.fileUrl = fileUrl;
    },
    uploadingOk() {
      const vm = this;
      var videoIframe = "";
      const host = window.location.host;
      let nowAdmin = "http://admin.100doc.com.cn/video/index.html";
      if (
        host.indexOf("localhost") !== -1 ||
        host.indexOf(".test.100doc.com.cn") !== -1
      ) {
        nowAdmin = "http://admin.test.100doc.com.cn/video/index.html";
      } else if (host.indexOf(".100live.cn") !== -1) {
        nowAdmin = "http://admin.100live.cn/video/index.html";
      }
      if (this.radio === "1") {
        videoIframe =
          nowAdmin +
          "?autoplay=0&MP4=" +
          this.videoUrl +
          "&IMG=" +
          this.videoImageUrl;
        console.log(videoIframe);
      } else {
        videoIframe = nowAdmin + "?MP3=" + this.videoUrl;
      }
      this.$refs.myTextEditor.quill.insertEmbed(
        vm.addVideoRange !== null ? vm.addVideoRange.index : 0,
        "video",
        videoIframe,
        Quill.sources.USER
      );
      this.addVideoRange = null;
      $("#uploadVideoNow-file").val("");
      this.isDisabled = true;
      this.progress = 0;
      this.schedule = false;
      this.uploadingVideoIsShow = true;
      this.videoImageUrl = "";
    },
    // 点击上传视频
    uploadingVideo() {
      $("#uploadVideoNow-file").click();
    },
    cancel() {
      this.$router.push({ path: "/article/index" });
    },
    getNews: async function() {
      if (this.$route.query.id) {
        var params = {
          id: this.$route.query.id
        };
        var res = await http.post(api.getNews, params);
        if (res.data.code === 0) {
          this.form.content = res.data.data.content;
          this.form.title = res.data.data.title;
          this.form.keyword = res.data.data.keyword;
          this.form.imageUrl = res.data.data.imageUrl;
          this.form.author = res.data.data.author;
          this.columnId = res.data.data.columnId;
          this.fileList = res.data.data.fileUrl
            ? JSON.parse(res.data.data.fileUrl)
            : [];
          this.form.fileUrl = res.data.data.fileUrl;
          this.getcolumn(res.data.data.columnId);
          this.form.showTime = res.data.data.showTime
            ? res.data.data.showTime
            : res.data.data.createtime;
        }
      }
    },
    columnSon(val) {
      this.columnGet(val);
    },
    columnList: async function() {
      var res = await http.get(api.columnList);
      if (res.data.code === 0) {
        this.columnTags = res.data.data;
      }
    },
    getcolumn: async function(id) {
      var res = await http.post(api.getcolumn, { id: id });
      if (res.data.code === 0) {
        this.placeholder = res.data.data.parent.name;
        this.placeholder2 = res.data.data.child.name;
        this.dataColumnId = res.data.data.child.id;
      }
    },
    columnGet: async function(id) {
      var res = await http.post(api.columnGet, { parent: id });
      if (res.data.code === 0) {
        this.columnTagSon = res.data.data;
      }
    },
    createNews1() {
      this.$refs.artForm.validate(valid => {
        if (valid) {
          this.createNews();
        }
      });
    },
    createNews: async function() {
      if (!this.form.title) {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (!this.form.imageUrl) {
        this.$message.error("封面图不能为空");
        return false;
      }
      if (!this.form.content) {
        this.$message.error("文章内容不能为空");
        return false;
      }
      if (this.value && !this.form.columnId) {
        this.$message.error("子栏目不能为空");
        return false;
      }
      if (this.form.fileUrl === "") {
        this.form.fileUrl = [];
      }
      if (typeof this.form.fileUrl !== "string") {
        this.form.fileUrl = JSON.stringify(this.form.fileUrl);
      }
      var res = await http.post(api.createNews, this.form);
      if (res.data.code === 0) {
        this.success("创建成功");
        this.$router.push({ path: "/article/index" });
      }
    },
    newsUpdate1() {
      this.$refs.artForm.validate(valid => {
        if (valid) {
          this.newsUpdate();
        }
      });
    },
    newsUpdate: async function() {
      if (!this.form.title) {
        this.$message.error("文章标题不能为空");
        return false;
      }
      if (!this.form.imageUrl) {
        this.$message.error("封面图不能为空");
        return false;
      }
      if (!this.form.content) {
        this.$message.error("文章内容不能为空");
        return false;
      }
      if (this.value && !this.form.columnId && !this.dataColumnId) {
        this.$message.error("子栏目不能为空");
        return false;
      }
      if (this.form.columnId !== "") {
        this.dataColumnId = this.form.columnId;
      }
      if (this.form.fileUrl === "") {
        this.form.fileUrl = [];
      }
      if (typeof this.form.fileUrl !== "string") {
        this.form.fileUrl = JSON.stringify(this.form.fileUrl);
      }
      var params = {
        id: this.$route.query.id,
        title: this.form.title,
        keyword: this.form.keyword,
        columnId: this.dataColumnId,
        imageUrl: this.form.imageUrl,
        content: this.form.content,
        author: this.form.author,
        showTime: this.form.showTime,
        fileUrl: this.form.fileUrl
      };
      var res = await http.post(api.newsUpdate, params);
      if (res.data.code === 0) {
        this.success("修改成功");
        this.$router.push({ path: "/article/index" });
      }
    },
    success(val) {
      this.$message({
        message: val,
        type: "success"
      });
    },
    handleAvatarSuccess(response) {
      this.form.imageUrl = response.data;
    },
    handleAvatarSuccess1(response) {
      var vm = this;
      vm.$refs.myTextEditor.quill.insertEmbed(
        vm.addImgRange !== null ? vm.addImgRange.index : 0,
        "image",
        response.data,
        Quill.sources.USER
      );
      vm.$refs.myTextEditor.quill.setSelection(vm.addImgRange.index + 1);
    },
    handleAvatarSuccess2(response) {
      this.videoImageUrl = response.data;
    },
    fileBeforeAvatarUpload(file) {
      let passType =
        "doc、docx、ppt、pptx、xls、xlsx、pdf、zip、rar、txt、jpg、jpeg、png";
      let fileType = file.name.split(".");
      fileType = fileType[fileType.length - 1];
      const isPassType = passType.indexOf(fileType) !== -1;
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isPassType) {
        this.$message.error("暂不支持该格式上传");
      }
      if (!isLt2M) {
        this.$message.error("文件大小不能超过 20MB!");
      }
      return isPassType && isLt2M;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是 jpg、png、jpeg 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style>
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
/*.modelist .el-form-item__label{*/
/* width:110px !important;*/
/*}*/
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.ql-video {
  width: 500px;
  height: 300px;
}
.ql-tooltip + div > div > span {
  display: none !important;
}
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.piont-flex {
  display: flex;
  justify-content: space-between;
  height: 36px;
  margin-bottom: 15px;
  padding-bottom: 35px;
}
.piont-flex .point-title {
  height: 36px;
  line-height: 36px;
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
.el-form-item__error {
  margin-left: 30px !important;
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
.ql-editor {
  min-height: 500px;
}
.cropper-content .cropper {
  width: auto;
  height: 300px;
}
.ql-editor {
  height: 700px;
  overflow: scroll;
}
</style>
