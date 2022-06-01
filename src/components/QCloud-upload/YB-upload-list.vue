<template>
  <div :class="classStyleType">
    <file-upload-list
      class="file-upload-list"
      :preview="preview"
      :multiple="multiple"
      @onPreview="onPreview"
      @onRemove="onRemove"
      @uploadend="uploadend"
      :accept="accept"
      :annex-type="annexType"
      :limit-num="limitNum"
      :maxFileSize="maxFileSize"
      :file-list="fileList"
      :pathKey="pathKey"
      liKey="url"
      liName="name"
      :disabled="disabled"
    >
      <el-button v-if="showUploadBtn" :size="btnSize" type="primary" :disabled="disabled" :plain="btnPlain">{{btnName}}</el-button>
    </file-upload-list>
    <!--预览图片-->
    <el-dialog
      :lock-scroll="false"
      :show-close="false"
      :visible.sync="dialogVisible"
      width="50%">
      <div style="text-align: center">
        <img style="max-width: 100%" :src="imgUrl" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import FileUploadList from '@/components/QCloud-upload/File-upload-list'
  export default {
    name: 'YB-upload-list',
    computed: {
      classStyleType() {
        let str = ''
        switch (this.styleType) {
          case '0':
            str = 'YB-upload-list'
            break;
          case '1':
            str = 'YB-upload-list style1'
            break;
          case '2':
            str = 'YB-upload-list style2'
            break;
          case '3':
            str = 'YB-upload-list style3'
            break;
          case '4':
            str = 'YB-upload-list style4'
            break;
          case '5':
            str = 'YB-upload-list style5'
            break;
        }
        return str
      },
      showUploadBtn() {
        let boo = true
        if (this.styleType === '5' && this.fileList.length > 0) {
          boo = false
        }
        return boo
      }
    },
    props: {
      multiple: {
        type: Number,
        default: 1
      },
      maxFileSize: {
        type: Number,
        default: 5242880 // 5242880 / 1024 /1024 = 5 Mb
      },
      preview: {
        type: Boolean,
        default: false
      },
      btnName: {
        type: String,
        default: '点击上传'
      },
      btnSize: {
        type: String,
        default: ''
      },
      btnPlain: {
        type: Boolean,
        default: false
      },
      styleType: {
        type: String,
        default: '0'
      },
      accept: {
        type: String,
        default: '.xls,.xlsx'
      },
      annexType: {
        type: String,
        default: 'xls,xlsx'
      },
      limitNum: {
        type: Number,
        default: 1
      },
      fileList: {
        type: Array,
        default: () => []
      },
      pathKey: {
        type: [String, Number]
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        imgUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      onPreview(file) {
        if (!this.preview) {
          return
        }
        const _FileName = file.fileName || file.name
         let _FileUrl
        if (file.fileUrl) {
          _FileUrl = file.fileUrl
        } else {
          _FileUrl = file.url ? file.url : file.response.url.fileUrl
        }
        let fileName = _FileName.lastIndexOf('.')
        let fileNameLength = _FileName.length
        let fileFormat = _FileName.substring(fileName + 1, fileNameLength)
        let limitType = 'bmp,png,tif,gif,jpeg,jpg'
        if (limitType.indexOf(fileFormat) !== -1) {
          this.imgUrl = _FileUrl
          clearTimeout(timer)
          let timer = setTimeout(() => {
            this.dialogVisible = true
          }, 300)
        } else {
          if ('pdf'.indexOf(fileFormat) < 0) {
            window.open('https://view.officeapps.live.com/op/view.aspx?src=' + _FileUrl)
          } else {
            window.open(_FileUrl)
          }
        }
      },
      onRemove(item) {
        this.$emit('onRemove', item)
      },
      uploadend(file, data) {
        this.$emit('uploadend', file, data)
      }
    },
    components: {
      FileUploadList
    }
  }
</script>

<style>
  .YB-upload-list .file-upload-list .file-ul {
    padding-top: 0;
  }
  /* 一套样式 */
  .YB-upload-list.style1 .file-upload-list {
    display: flex;
    flex-wrap: wrap;
  }
  .YB-upload-list.style1 .file-upload-list > div,
  .YB-upload-list.style1 .file-upload-list > ul {
    width: 100%
  }
  .YB-upload-list.style1 .image-upload-btn {
    display: none;
  }
  /* 二套样式 */
  .YB-upload-list.style2 .file-upload-list .progress-wrapper {
    display: none;
  }
  .YB-upload-list.style2 .file-upload-list .file-ul {
    display: none;
  }
  /* 三套样式 */
  .YB-upload-list.style3 .file-upload-list {
    display: flex;
    flex-wrap: wrap;
  }
  .YB-upload-list.style3 .file-upload-list > div,
  .YB-upload-list.style3 .file-upload-list > ul {
    width: 100%
  }
  .YB-upload-list.style3 .file-upload-list .progress-wrapper {
    padding: 4px 0;
  }
  /* 四套样式 */
  .YB-upload-list.style4 .file-upload-list {
    display: flex;
    flex-wrap: wrap;
  }
  .YB-upload-list.style4 .file-upload-list > div,
  .YB-upload-list.style4 .file-upload-list > ul {
    width: 100%
  }
  .YB-upload-list.style4 .file-upload-list .progress-wrapper {
    padding: 4px 0;
    width: 104px;
  }
  /* 五套样式 */
  .YB-upload-list.style5 .file-upload-list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
