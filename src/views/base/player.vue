<template>
  <div class="base-set">
    <audio v-if="videoInfo.programType" :src="videoInfo.audioUrl" controls/>
    <video v-show="show" :src="videoUrl" controls></video>
    <!-- <div class="videoBox" v-show="show">
      <div id="id_test_video" style="width:100%; height:auto;"></div>
    </div>
    <div v-show="listShow" style="margin-top: 30px">回放列表</div>
    <ul v-show="listShow" class="videoList">
      <li v-for="(list,index) in programs" :key="list.id">
        <span style="margin-right: 10px">序号:{{index}}</span>
        <span>{{list.name}}</span>
        <el-button type="info" style="float: right" @click="goPlay(index)">播放</el-button>
      </li>
    </ul> -->
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    name: 'createLive',
    components: {
    },
    data() {
      return {
        programs: '',
        flv: '123',
        show: true,
        listShow: false,
        m3u8Url: '',
        m3u8_hd:'',
        m3u8_sd:'',
        mp4_30: '',
        mp4_20: '',
        mp4_10: '',
        player: {},
        videoId: this.$route.params.videoId,
        videoUrl: ''
      }
    },
    props: {
      videoInfo: {
        type: Object,
        default: {}
      }
    },
    beforeDestroy() {
      this.player.destroy()
    },
    computed: {
      ...mapGetters([
        'service',
        'serviceType'
      ])
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {
    },
    watch: {
      videoInfo(old) {
        var that = this
        if (old.type === 2) {
          if (!this.videoInfo.programType) {
            this.getVideoUrl()
          }
          // setTimeout(function () {
          //   that.windPlayer()
          // }, 400)
        }
        this.programs = old.programList
        if (this.programs && this.programs.length > 1) {
          this.listShow = true
        }
        if (old.status === 9) {
          this.getVideoplayback(0)
          // setTimeout(function () {
          //   that.windPlayer()
          // }, 400)
        }
      }
    },
    methods: {
      getVideoUrl: async function() {
        let url = api.videoAddress + this.$route.params.id + '/' + this.videoId
        const res = await http.get(url)
        if (res.data.code === 0) {
          for (var i = 0; i < res.data.data.length; i++) { // 获取点播播放地址
            if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 10040) {
              this.mp4_30 = res.data.data[i].playbackUrl
              this.videoUrl = res.data.data[i].playbackUrl
              console.log(this.videoUrl)
            }
            if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 10030) {
              this.mp4_20 = res.data.data[i].playbackUrl
              this.videoUrl = res.data.data[i].playbackUrl
              console.log(this.videoUrl)
            }
            if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 10010) {
              this.mp4_10 = res.data.data[i].playbackUrl
              this.videoUrl = res.data.data[i].playbackUrl
              console.log(this.videoUrl)
            }
          }
          this.windPlayer()
        } else {
          this.$message.error(res.data.message)
        }
      },
      getVideoplayback: async function(index) { // 获取回放播放地址
        let url = api.videoAddress + this.$route.params.id + '/' + this.programs[index].id
        const res = await http.get(url)
        if (res.data.code === 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].deviceType === 'mp4') {
              if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 100040) {
                this.mp4_30 = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 100030) {
                this.mp4_20 = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              if( res.data.data[i].deviceType === 'mp4' && res.data.data[i].definition === 100010) {
                this.mp4_10 = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              this.windPlayer()
              return false
            } else {
              if( res.data.data[i].deviceType === 'hls' && res.data.data[i].definition === 100210) {
                this.m3u8Url = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              if( res.data.data[i].deviceType === 'hls' && res.data.data[i].definition === 100230) {
                this.m3u8_hd = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              if( res.data.data[i].deviceType === 'hls' && res.data.data[i].definition === 100240) {
                this.m3u8_sd = res.data.data[i].playbackUrl
                this.videoUrl = res.data.data[i].playbackUrl
                console.log(this.videoUrl)
              }
              this.windPlayer()
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      },
      windPlayer() {
        var that = this
        that.player =  new TcPlayer('id_test_video', {
          "mp4": that.mp4_30, //增加了一个flv的播放地址，用于PC平台的播放 请替换成实际可用的播放地址
          "mp4_hd": that.mp4_20,
          "mp4_sd": that.mp4_10,
          "m3u8": that.m3u8Url,
          "m3u8_hd": that.m3u8_hd,
          "m3u8_sd": that.m3u8_sd,
          "autoplay" : true,      //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          "coverpic" : { 'style': 'stretch', 'src': this.videoInfo.coverUrl },
          "width" :  '800',//视频的显示宽度，请尽量使用视频分辨率宽度
          "height" : '500'//视频的显示高度，请尽量使用视频分辨率高度
        })
      },
      goPlay(index) {
        var that = this
        that.player.destroy()
        // that.windPlayer()
        that.show = true
        this.getVideoplayback(index)
      }
    }
  }
</script>
<style scoped>
  .videoList{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    color: #333333;
    list-style: none;
    width: 800px;
    border: 1px solid #eeeeee;
  }
  .videoList li{
    overflow: hidden;
    line-height: 40px;
    padding: 6px 10px;
    border-bottom: 1px solid #eeeeee;
  }
  .videoList li:nth-last-child(1) {
    border-bottom: none;
  }
  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .piont-flex{
    display: flex;
    justify-content: space-between;
    height:36px;
    margin-bottom:15px;
  }
  .piont-flex .point-title{
    height: 36px;
    line-height: 36px;
  }
  .background {
    margin-left:auto;
    margin-right:auto;
    display: block;
    width: 100px;
    height: 80px;
  }
  .videoBox {
    width: 800px;
    height:500px;
  }
</style>
