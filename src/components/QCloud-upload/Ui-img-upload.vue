<template>
  <div class="upImgBox">
    <li v-for="item in imgSrcs" :key="item">
      <el-image
          style="width: 100%; height: 100%"
          :src="item"
          :preview-src-list="[item]">
      </el-image>
      <span  @click="fileDelete(item)">
            <i class="el-icon-close"></i>
          </span>
    </li>
    <div class="uploadBox" v-show="!loadend"> <img :src="loadingSrc" alt=""> </div>
    <file-upload
        v-if="imgSrcs.length < 10"
        v-show="loadend"
        class="uploadBox"
        :path-key="pathKey || userId"
        :max-file-size="maxSize"
        @uploadend="imageuploaded"
        @uploadready="uploadready"
    >
      <div>
        <i class="el-icon-plus"></i>
        <div class="addTip">点击上传图片</div>
        <div class="upTip">图片小于20MB</div>
      </div>
    </file-upload>
    <li v-for="item in (EachLine-(imgSrcs.length+1)%EachLine)" v-if="(imgSrcs.length+1)%EachLine !== 0 && imgSrcs.length < maxLength" :key="item"></li>
  </div>
</template>

<script>
import FileUpload from '@/base/QCloud-upload/File-upload'
import _loadingSrc from '@/common/image/loading.gif'
import { mapGetters } from 'vuex'

export default {
  name: "Ui-img-upload",
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  props: {
    maxLength: {
      default: 10,
      type: Number
    },
    EachLine: {
      default: 5,
      type: Number
    },
    maxSize: {
      type: Number,
      default: 20971520
    },
    imgSrcs: {
      type: Array,
      default() {
        return []
      }
    },
    pathKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loadend: true,
      loadingSrc: _loadingSrc,
    }
  },
  methods: {
    delLoad() {
      this.loadend = true
    },
    uploadready(file) {
      this.loadend = false
    },
    imageuploaded (file, response) {
      this.delLoad()
      this.imgSrcs.push(response.data.downLoadUrl)
    },
    uploadError() {
      this.delLoad()
      this.$message.error('上传失败')
    },
    fileDelete(val) {
      let _index = this.imgSrcs.findIndex(item => {
        return val === item
      })
      this.imgSrcs.splice(_index, 1)
    }
  },
  components: {
    FileUpload
  }
}
</script>

<style scoped lang="stylus">
.uploadBox
  margin-top: 20px
  width: 200px
  height: 200px
  box-sizing border-box
  border 1px dashed $company-theme-color
  text-align center
  padding-top: 40px
  cursor pointer
  border-radius:4px
  overflow hidden
  >img
    width: 60px
    margin-top: 25px
  .el-icon-plus
    color: $company-theme-color
    font-size: 46px
    font-weight: 700
  .addTip
    color $company-theme-color
    font-size: 14px
    padding-top: 20px
  .upTip
    color #A6A6A6
    font-size: 12px
    margin-top: 24px
.upImgBox
  display flex
  flex-wrap: wrap
  justify-content: space-between
  flex-wrap wrap
  width: 100%
  max-width: 1200px
  font-size: 16px
  font-weight: 700
  li
    box-sizing border-box
    width: 200px
    flex 0 0 auto
    height: 200px
    position: relative
    margin-top: 20px
    border-radius:4px
    overflow hidden
    img
      display block
      width: 100%
      height: 100%
    span
      width: 32px
      height: 32px
      position: absolute
      right: 10px
      top: 10px
      border-radius 50%
      cursor pointer
      color #ffffff
      text-align center
      font-size: 20px
      line-height: 32px
      background-color $company-theme-color

</style>