<template>
  <div class="YB-upload-img-list">
    <ul>
      <li v-for="(imgItem, imgI) in baseFileList" :key="imgI">
        <el-image style="width: 100%; height: 100%" :src="imgItem.url">
        </el-image>
        <span class="success-tips"><i class="el-icon-upload-success el-icon-check"></i></span>
        <div class="picture-card">
          <i class="el-icon-zoom-in" @click="handlePictureCardPreview(imgItem.url)"></i>
          <i class="el-icon-delete" @click="imageDelete(imgItem, imgI)"></i>
        </div>
      </li>
      <file-upload
        class="uploadBox"
        :class="'style_'+uploadStyle"
        :multiple="multiple"
        :pathKey="pathKey"
        progress-type="circle"
        :stroke-width="6"
        :text-inside="false"
        :annex-type="annexType"
        @uploadend="imageuploaded">
        <i class="el-icon-plus uploader-icon"></i>
      </file-upload>
    </ul>
    <el-dialog :visible.sync="dialogVisible" :lock-scroll="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import FileUpload from '@/components/QCloud-upload/File-upload'

  export default {
    name: 'YB-upload-img-list',
    props: {
      multiple: {
        type: Number,
        default: 1
      },
      annexType: {
        type: String,
        default: 'png,jpg,jpeg,gif'
      },
      baseFileList: {
        type: Array
      },
      pathKey: {
        type: [String, Number]
      },
      maxLength: {
        type: Number,
        default: 50
      },
      uploadStyle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        ocrMaxSize: 15728640,
        maxSize: 52428800,
        previewerList: [],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    mounted() {
      console.log(this.baseFileList);
    },
    methods: {
      handlePictureCardPreview(data) {
        this.dialogImageUrl = data
        this.dialogVisible = true
      },
      imageuploaded(file, response) {
        if (response.code === 0) {
          this.imgsave(file, decodeURIComponent(response.data.Location))
        }
      },
      imgsave (file, data) {
        console.log(this.baseFileList.length, this.maxLength);
        if (this.baseFileList.length >=  this.maxLength) {
          this.$message.error(`最多上传${this.maxLength}个`)
          return
        }
        let params = {url: data, name: file.name}
        this.$emit('imgend', params)
      },
      imageDelete(item, imgI) {
        this.$emit('imgDel', item, imgI)
      }
    },
    components: {
      FileUpload
    }
  }
</script>

<style>
  .YB-upload-img-list .progress-wrapper .el-progress--circle {
    margin-top: 9px;
    margin-left: 8px;
  }
  .YB-upload-img-list .image-upload-btn {
    width: 146px;
    height: 146px;
  }
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .YB-upload-img-list
    display flex
    flex-wrap wrap
    font-size 16px
    font-weight 700
    align-items center
    ul
      width 88%
      display flex
      justify-content flex-start
      flex-wrap wrap
      font-size 16px
      font-weight 700
      li
        box-sizing border-box
        width 146px
        flex 0 0 auto
        height 146px
        position relative
        margin 0 8px 8px 0
        border-radius 6px
        border 1px solid #c0ccda
        overflow hidden
        img
          display block
          width 100%
          height 100%
        .success-tips
          position: absolute;
          right: -15px;
          top: -6px;
          width: 40px;
          height: 24px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          > i
            position: absolute;
            top: 11px;
            right: 14px;
            color #fff
            font-size: 12px;
            transform: rotate(-45deg);
        .picture-card
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0,0,0,.5);
          transition: opacity .3s;
          &:hover
            opacity: 1;
          > i
            position absolute
            top 50%
            margin -10px 5px 0 5px
            cursor pointer
            &.el-icon-zoom-in
              left 44px
      .uploadBox
        box-sizing border-box
        width 148px
        height 148px
        line-height 146px
        text-align center
        vertical-align top
        background-color #fbfdff
        border 1px dashed #c0ccda
        border-radius 6px
        cursor pointer
        .uploader-icon
          font-size 28px
          color #8c939d
        &:hover
          border-color $company-theme-color
          color $company-theme-color
        &.style_2
          display none
</style>
