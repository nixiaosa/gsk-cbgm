<template>
  <div>
    <div class="progress-wrapper" v-show="uploadready">
      <el-progress :type="progressType" :text-inside="textInside" :stroke-width="strokeWidth"
                   :percentage="percentage"></el-progress>
    </div>
    <div class="image-upload-btn" v-show="!uploadready">
      <slot></slot>
      <form class="image-upload-form">
        <label class="image-upload-label" :for="upId"></label>
        <input v-if="multiple > 1" class="image-upload-input" :id="upId" type="file" @change="getFile" multiple>
        <input v-else class="image-upload-input" :id="upId" type="file" @change="getFile">
      </form>
    </div>
  </div>
</template>

<script>
// import {Api} from '@/api/api'
import api from "@/api/tenantInfoSave";
import $cos from 'yb-cos'
import lrz from 'lrz'
// Location // 一般链接
// downLoadUrl // 下载链接

export default {
  name: 'Image-upload',
  props: {
    multiple: { // 最多同时选择多少
      type: Number,
      default: 1,
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    annexType: {
      type: String,
      default: 'png,jpg,jpeg'
    },
    maxFileSize: {
      type: Number,
      default: 52428800 // 52428800 / 1024 /1024 = 50 Mb
    },
    pathKey: {
      type: [String, Number]
    },
    isLrz: { // 是否需要JS压缩后再上传  只适用于图片压缩
      type: Boolean,
      default: false
    },
    progressType: {
      type: String,
      default: 'line'
    },
    strokeWidth: {
      type: Number,
      default: 26
    },
    textInside: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      upId: '',
      percentage: 0,
      uploadready: false
    }
  },
  created() {
    this.upId = 'uid_' + Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 9))
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
    upload($ele, file, lrzFile) {
      let params = {
        // domain: Api.resource.getsignature,
        domain: api.getSig2,
        name: file.name,
        body: lrzFile,
        busId: this.pathKey,
        onProgress: progress => {
          this.__dispatch('uploading', file, progress)
          this.percentage = progress.percent * 100
        }
      }
      this.__dispatch('uploadready', file, 0)
      this.percentage = 0
      this.uploadready = true
      $cos.putObject(params, item => {
        this.cancel($ele)
        this.__dispatch('uploadend', file, item)
      })
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
    cancel($ele) {
      $ele.value = ''
      this.uploadready = false
    }
  },
  components: {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.progress-wrapper
  width 140px

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
</style>
