<template>
  <div :class="classStyleType">
    <file-upload
      class="file-upload"
      :url="fileUrl"
      :path-key="pathKey"
      :max-file-size="uploadMaxSize"
      :annex-type="annexType"
      @uploadend="handleUploadSuccess">
      <img v-show="fileUrl" :src="fileUrl" class="cover">
      <i v-show="!fileUrl && styleType !== '4'" class="el-icon-plus cover-uploader-icon"></i>
      <div v-if="styleType === '4'" class="content">
        <p><i class="el-icon-circle-plus"></i></p>
        <p><span>点击上传图片</span></p>
      </div>
    </file-upload>
    <span v-if="showTips" class="tips" v-html="tips"></span>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'
  import FileUpload from './File-upload.vue'
  export default {
    name: 'YB-upload',
    computed: {
      // ...mapGetters([
      //   'userId'
      // ]),
      classStyleType() {
        let str = ''
        switch (this.styleType) {
          case '1':
            str = 'YB-upload'
            break;
          case '2':
            str = 'YB-upload style2'
            break;
          case '3':
            str = 'YB-upload style3'
            break;
          case '4':
            str = 'YB-upload style4'
            break;
          case '5':
            str = 'YB-upload style5'
            break;
          case '6':
            str = 'YB-upload style6'
            break;
        }
        return str
      }
    },
    props: {
      pathKey: {
        type: [String, Number]
      },
      styleType: {
        type: String,
        default: '1'
      },
      annexType: {
        type: String,
        default: 'png,jpg,jpeg,gif'
      },
      tips: {
        type: String,
        default: '图片格式为jpg、gif、png，最小尺寸：320*180'
      },
      showTips: {
        type: Boolean,
        default: false
      },
      uploadMaxSize: {
        type: Number,
        default: 20971520 // 2097152 / 1024 /1024 = 20 Mb
      },
      fileUrl: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
      }
    },
    methods: {
      handleUploadSuccess(file, res) {
        if (res.code === 0) {
          this.$emit('handleCoverSuccess', res.data.downLoadUrl)
        }
      }
    },
    components: {
      FileUpload
    }
  }
</script>

<style>
  .YB-upload .progress-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
  }
  .YB-upload .image-upload-btn {
    float: left;
    width: 180px;
    height: 180px;
  }
  .YB-upload .image-upload-form {
    z-index: 1;
  }
  .YB-upload .el-progress {
    width: 100%;
  }
  /* 二套样式 重置 */
  .YB-upload.style2 .progress-wrapper,
  .YB-upload.style2 .image-upload-btn {
    width: 320px;
  }
  /* 三套样式 重置 */
  .YB-upload.style3 .progress-wrapper,
  .YB-upload.style3 .image-upload-btn {
    width: 220px;
  }
  /* 四套样式 重置 */
  .YB-upload.style4 .progress-wrapper,
  .YB-upload.style4 .image-upload-btn {
    width: 480px;
    height: 270px;
  }
  /* 四套样式 重置 */
  .YB-upload.style5 .progress-wrapper,
  .YB-upload.style5 .image-upload-btn {
    width: 80px;
    height: 80px;
  }
  /* 六套样式 重置 */
  .YB-upload.style6 .progress-wrapper,
  .YB-upload.style6 .image-upload-btn {
    width: 180px;
    height: 260px;
  }
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.YB-upload
  .cover
    width 180px
    height 180px
    display block
  .cover-uploader-icon
    box-sizing border-box
    z-index 1
    position absolute
    top 0
    left 0
    width 180px
    height 180px
    line-height 180px
    font-size 28px
    color #8c939d
    text-align center
    border 1px dashed #d9d9d9
    border-radius 4px
    &:hover
      border-color #20a0ff
  .tips
    display inline-block
    width 100%
    font-size 12px
    color #A6A6A6
  /* 二套样式 */
  &.style2
    .cover,
    .cover-uploader-icon
      width 320px
  /* 三套样式 */
  &.style3
    .cover,
    .cover-uploader-icon
      width 220px
  /* 四套样式 */
  &.style4
    .content
      box-sizing border-box
      width 480px
      height 270px
      text-align center
      border 1px solid #ECECEC
      border-radius 4px
      cursor pointer
      > p
        height 32px
        line-height 32px
        text-align center
        font-size 14px
        color #656565
        &:first-child
          margin-top 106px
      .el-icon-circle-plus
        font-size 32px
        color $company-theme-color
    .cover
      width 480px
      height 270px
  /* 五套样式 */
  &.style5
    .cover,
    .cover-uploader-icon
      width 80px
      height 80px
      line-height 80px
  /* 六套样式 */
  &.style6
    .cover,
    .cover-uploader-icon
      width 180px
      height 260px
      line-height 260px
</style>
