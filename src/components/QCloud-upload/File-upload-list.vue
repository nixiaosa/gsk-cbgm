<template>
  <div>
    <div class="progress-wrapper" v-show="uploadready">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
    </div>
    <div class="image-upload-btn" v-show="!uploadready" v-if="fileList.length < limitNum">
      <slot></slot>
      <form class="image-upload-form" v-if="!disabled">
        <label class="image-upload-label" :for="upId"></label>
        <input v-if="multiple > 1" class="image-upload-input" :id="upId" type="file" :accept="accept" @change="getFile" multiple>
        <input v-else class="image-upload-input" :id="upId" type="file" :accept="accept" @change="getFile">
      </form>
    </div>
    <ul class="file-ul">
      <transition-group name="yb-list">
        <li v-for="(item, index) in fileList" :key="item[liKey]" >
          <i class="el-icon-document"></i>
          <a href="javascript:;" @click="$emit('onPreview', item, index)">{{item[liName]}}</a>
          <i class="el-icon-upload-success el-icon-circle-check"></i>
          <i class="el-icon-close" @click="$emit('onRemove', item, index)" v-if="!disabled"></i>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
  // import { Api } from '@/api/api'
  import api from "@/api/tenantInfoSave";
  import $cos from 'yb-cos'
  import lrz from 'lrz'

  // Location // 一般链接
  // downLoadUrl // 下载链接

  export default {
    name: 'File-upload-list',
    props: {
      multiple: {
        type: Number,
        default: 1
      },
      accept: {
        type: String,
        default: '*'
      },
      annexType: {
        type: String,
        default: 'ppt,pptx,pdf,png,jpg,jpeg,doc,docx,xls,xlsx'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxFileSize: {
        type: Number,
        default: 5242880 // 5242880 / 1024 /1024 = 5 Mb
      },
      pathKey: {
        type: [String, Number]
      },
      fileList: {
        type: Array,
      },
      limitNum: {
        type: Number,
        default: 100
      },
      liKey: {
        type: String,
        default: 'fileUrl'
      },
      liName: {
        type: String,
        default: 'fileName'
      },
      isLrz: { // 是否需要JS压缩后再上传 只适用于图片压缩
        type: Boolean,
        default: false
      }
    },
    created() {
      this.upId = 'uid_' + Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,9))
    },
    data() {
      return {
        upId: '',
        percentage: 0,
        uploadready: false
      }
    },
    methods: {
      __dispatch(name, res, data) {
        this.$emit && this.$emit(name, res, data)
      },
      getFile($event) {
        const $ele = $event.srcElement || $event.target
        this.fileParsing($ele, () => {
          /*
          * 校验通过
          * */
          if (this.isLrz) {
            /*
            * 需要压缩
            * */
            lrz($ele.files[0]).then((data) => {
              this.upload($ele, $ele.files[0], data.file)
            })
          } else {
            for (let file of $ele.files) {
              this.upload($ele, file, file)
            }
          }
        })

      },
      fileParsing($ele, callback) {
        /*
          * 同时选择问卷数量校验
          * */
        let multipleValidation = this.multipleValidation($ele.files)
        if (multipleValidation.code === 'ERROR') {
          this.cancel($ele)
          this.$message.error(multipleValidation.message)
          return false
        }
        for (let val of $ele.files) {
          /*
          * 格式校验
          * */
          let formatValidation = this.formatValidation(val)
          if (formatValidation.code === 'ERROR') {
            this.cancel($ele)
            this.$message.error(formatValidation.message)
            return false
          }
          /*
          * 大小校验
          * */
          let sizeValidation = this.sizeValidation(val)
          if (sizeValidation.code === 'ERROR') {
            this.cancel($ele)
            this.$message.error(sizeValidation.message)
            return false
          }
        }
        /*
        * 验证通过
        * */
        callback()
      },
      multipleValidation(files) {
        // 最大同时选择数量
        if (files.length > this.multiple) {
          let params = {
            code: 'ERROR',
            message: `上传失败！最大同时选择${this.multiple}个文件，当前选择${files.length}个`
          }
          return params
        } else {
          return {code: 'SUCCESS'}
        }
      },
      sizeValidation(file) {
        // 大小校验
        if (file.size > this.maxFileSize) {
          let formatSize
          if (parseInt(this.maxFileSize / 1024 / 1024) > 0) {
            formatSize = (this.maxFileSize / 1024 / 1024).toFixed(2) + 'MB'
          } else if (parseInt(this.maxFileSize / 1024) > 0) {
            formatSize = (this.maxFileSize / 1024).toFixed(2) + 'kB'
          } else {
            formatSize = this.maxFileSize.toFixed(2) + 'Byte'
          }
          let params = {
            code: 'ERROR',
            message: `${file.name}上传失败！请上传${formatSize}以内文件`
          }
          return params
        } else {
          let params = {
            code: 'SUCCESS'
          }
          return params
        }
      },
      formatValidation(file) {
        // 格式校验
        let fileExt = file.name.substring(file.name.lastIndexOf('.') + 1)
        const annexTypeArr = this.annexType.split(',')
        if (annexTypeArr.length > 1) {
          let reg = new RegExp('^(' + annexTypeArr.join('|') + ')+$', 'i')
          if (!reg.test(fileExt)) {
            let params = {
              code: 'ERROR',
              message: `${file.name}上传失败！暂不支持该格式`
            }
            return params
          } else {
            let params = {
              code: 'SUCCESS',
            }
            return params
          }
        }
      },
      upload($ele, file, lrzFile) {
        let params = {
          // domain: Api.resource.getsignature,
          domain: api.getSig2,
          name: file.name,
          body: lrzFile,
          busId: this.pathKey,
          onProgress: progress => {
            this.percentage = progress.percent*100
          }
        }
        this.percentage = 0
        this.uploadready = true
        $cos.putObject(params, item => {
          this.cancel($ele)
          this.__dispatch('uploadend', file, item)
        })
      },
      cancel($ele) {
        $ele.value = ''
        this.uploadready = false
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .yb-list-enter-active, .yb-list-leave-active
    transition: all 1s cubic-bezier(0.55, 0, 0.1, 1)
  .yb-list-enter, .yb-list-leave-to
    opacity: 0;
    transform: translateY(-20px)
  .progress-wrapper
    width: 140px;
  .image-upload-btn
    position: relative
    overflow hidden
    display inline-block
    .image-upload-form
      display: block
      position: absolute
      left: 0px
      top: 0px
      bottom: 0
      right 0
      opacity: 0
      margin: 0px
      padding: 0px
      overflow: hidden
    .image-upload-label
      position: absolute
      left: 0px
      top: 0px
      bottom: 0
      right 0
      opacity: 0
      margin: 0px
      padding: 0px
      cursor pointer
    .image-upload-input
      width: 100%
      height: 0
  .file-ul
    margin: 0
    padding: 0
    list-style: none
    padding-top: 10px
    li
      font-size: 14px
      color: #606266
      line-height: 1.8
      margin-top: 5px
      display flex
      box-sizing: border-box
      border-radius: 4px
      padding-left: 4px
      width: 100%
      align-items: center
      &:hover
        background-color: #F5F7FA
        color: $company-theme-color
        a
          color: $company-theme-color
          cursor pointer
        .el-icon-upload-success
          display none
        .el-icon-close
          display: inline-block
      a
        flex 1
        color: #606266
        display: block
        margin-right: 40px
        overflow: hidden
        text-overflow: ellipsis
        transition: color .3s
        white-space: nowrap
      .el-icon-document
        flex 0 0 auto
        margin-right: 7px
        color: #909399
        line-height: inherit
      .el-icon-upload-success
        display block
        flex 0 0 auto
        color: $company-theme-color
      .el-icon-close
        display: none
        flex 0 0 auto
        cursor: pointer
        opacity: .75
        color: #606266
</style>
