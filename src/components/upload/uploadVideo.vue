<template>
  <div class="uploadVideo">
    <form id="uploadVideoForm">
      <input id="uploadVideoNow-file" type="file" style="display:none;"/>
    </form>
    <el-button v-show="uploadBoxIsShow" type="primary" id="uploadVideoNow">上传视频</el-button>
    <div style="width: 400px;" v-if="schedule">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentageNumber"></el-progress>
    </div>
    <span v-if="isError" style="color: red">上传失败</span>
    <div v-if="isTag">
      <el-tag
            style="margin: 0;margin-right: 10px"
            v-for="tag in videoName"
            :key="tag"
            @close="closeFunction"
            closable
            :type="type">
        {{tag}}
      </el-tag>
    </div>
  </div>
</template>

<script>
  import api from '@/api/tenantInfoSave'
  import $ from 'jquery'
  import Bus from '@/api/event'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        isTag: true,
        isError: false,
        uploadCos: '',
        uploadTaskId: '',
        type: 'info',
        schedule: false,
        percentageNumber: 0,
        uploadBoxIsShow: true,
        videoName: []
      }
    },
    created: function () {
    },
    mounted() {
      var that = this
      Bus.$on('startLookTask', () => {
        // 父组件 直接触发
        $('#uploadVideoNow-file').val('')
        $('#uploadVideoNow-file').click()
      })
      var getSignature = function(callback) {
        $.ajax({
          url: api.videoManage.getsignature,
          type: 'POST',
          dataType: 'json',
          success: function(result) {
            callback(result.data)
          }
        })
      }
      $('#uploadVideoNow-file').on('change', function () {
        that.percentageNumber = 0
        that.uploadVideoState = true
        that.schedule = true
        that.uploadBoxIsShow = false
        let videoFile = {}
        videoFile = this.files[0]
        that.videoName.push(videoFile.name)
        // 上传视频格式限制
        // 上传使用了腾讯云的ugcUploader.js插件
        // 文档地址：https://cloud.tencent.com/document/product/266/9239#.E5.8F.96.E6.B6.88.E4.B8.8A.E4.BC.A0
        // 例子：http://video.qcloud.com/sdk/ugcuploader.html?_ga=1.64126252.2055090588.1523940227
        let videoAllowFormat = ['MP4', 'FLV', 'MOV', 'WMV', 'RM', 'RMVB', 'MPG', '3GP']
        let uploadType = videoFile ? videoFile.name.substring(videoFile.name.lastIndexOf('.') + 1) : 'false'
        let AllowState = videoAllowFormat.indexOf(uploadType.toUpperCase())
        if (resultMsg || AllowState === -1) {
          if (uploadType !== 'false') {
            that.removeUpload()
            that.videoName = []
            that.$message.error({showClose: true, message: '文件格式不对，请上传视频文件'})
            return false
          }
        }
        console.log(AllowState)
        let resultMsg = window.qcVideo.ugcUploader.start({
          videoFile: videoFile,
          coverFile: '',
          getSignature: getSignature,
          allowAudio: 1,
          progress: function(result) {
            var time = result.shacurr + result.curr
            that.percentageNumber = parseInt(time / 2 * 100)
            that.uploadCos = result.cos
            that.uploadTaskId = result.taskId
            console.log('执行了这里')
            that.$emit('VideoSchedule', that.percentageNumber)
          },
          finish: function(result) {
            that.schedule = false
            that.type = 'success'
            that.$emit('VideoUrl', result)
          },
          error: function(result) {
            that.percentageNumber = 0
            that.uploadBoxIsShow = true
            that.schedule = false
            that.type = 'danger'
            that.isError = true
            alert('上传失败的原因：' + result.msg)
          }
        })
      })
      $('#uploadVideoNow').on('click', function () {
        $('#uploadVideoNow-file').val('')
        $('#uploadVideoNow-file').click()
      })
    },
    methods: {
      closeFunction() {
        this.removeUpload()
        this.$emit('videoUrl', '')
        this.$emit('VideoSchedule', 'repeat')
        this.type = 'info'
        this.schedule = false
        this.uploadBoxIsShow = true
        this.isError = false
        this.videoName = []
      },
      // 暂停上传
      suspendUpload() {
        window.qcVideo.ugcUploader.cancel({
          cos: this.uploadCos,
          taskId: this.uploadTaskId
        })
      },
      // 删除上传
      removeUpload() {
        this.percentageNumber = 0
        this.uploadVideoState = false
        this.schedule = false
        this.uploadBoxIsShow = true
        this.suspendUpload()
        $('#uploadVideoForm')[0].reset()
      },
      // 继续上传
      goOnUpload() {
        this.r.upload()
      }
    },
    components: {}
  }
</script>
<style>
  .uploadVideo {
    background: #ffffff
  }
</style>
